import { redisClient } from "../config/redisClient.js";

const cacheMiddleware = (options = {}) => {
  // Set a default expiry time of 1 hour if not specified
  const { expiration = 3600 } = options;

  return async (req, res, next) => {
    // Check if req.user exists before creating the key
    if (!req.user || !req.user._id) {
      console.warn("User data not available on request. Bypassing cache.");
      return next();
    }

    // Create a unique cache key based on the original request URL
    const key = `cache:${req.user._id}:${req.originalUrl}`;

    // Ensure Redis client is connected
    if (!redisClient.isReady) {
      console.warn("Redis is not ready. Bypassing cache.");
      return next();
    }

    try {
      const cacheData = await redisClient.get(key);

      if (cacheData) {
        console.log(`CACHE HIT for key: ${key}`);
        // If data is found in the cache, send it back immediately
        return res.status(200).json(JSON.parse(cacheData));
      }

      // If no data is found (cache miss), proceed to the controller
      console.log(`CACHE MISS for key: ${key}`);

      // "Hijack" the res.json method to automatically cache the response
      const originalJson = res.json;
      res.json = (data) => {
        // Only cache successful (2xx) responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // Store the data in Redis for specified expiration
          redisClient.setEx(key, expiration, JSON.stringify(data));
        }
        // Call the original res.json to send the response to the client
        return originalJson.call(res, data);
      };
      next();
    } catch (error) {
      // If any Redis error occurs, log it and bypass the cache to ensure the app still functions
      console.error(`Redis cache error for key ${key}:`, error);
      next();
    }
  };
};

export default cacheMiddleware;