import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

// 1. Debugging: Check if Env vars are actually loaded
if (!process.env.CLOUDINARY_CLOUD_NAME) {
  console.error("❌ FATAL ERROR: CLOUDINARY_CLOUD_NAME is not defined in .env");
} else {
  console.log("✅ Cloudinary Config Loaded for:", process.env.CLOUDINARY_CLOUD_NAME);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Map mime types to Cloudinary formats
    const formatMap = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
    };

    return {
      folder: "Taskify_profile_picture",
      // If format is not found, default to 'jpeg'
      format: formatMap[file.mimetype] || "jpeg", 
      public_id: `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, "")}`, // Safe filename
      transformation: [{ width: 500, height: 500, crop: "limit" }],
    };
  },
});

// 2. Filter logic to reject non-images BEFORE sending to Cloudinary
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter });

export { upload };