import Role from "../models/Role.model.js";
import User from "../models/user.model.js";

// A cache to store role permissions and avoid DB calls
const rolePermissionsCache = new Map();

// Function to get permissions for a role
const getRolePermissions = async (roleId) => {
  const roleIdString = roleId.toString();

  if (rolePermissionsCache.has(roleIdString)) {
    return rolePermissionsCache.get(roleIdString);
  }

  const role = await Role.findById(roleId).populate("permissions").lean();
  if (!role) {
    return null;
  }

  const permissions = new Set(role.permissions.map((p) => p.name));
  rolePermissionsCache.set(roleIdString, permissions);

  return permissions;
};

// The Middleware
export const authorizePermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      console.log(req.user);
      if (!req.user || !req.user.role) {
        return res.status(403).json({ message: "Forbidden: No user role." });
      }

      const roleId = req.user.role._id ? req.user.role._id : req.user.role;
      console.log(roleId);

      // req.user.role should be the ROLE ID (from verifyToken)
      const permissions = await getRolePermissions(roleId);

      if (!permissions) {
        return res.status(403).json({ message: "Forbidden: Invalid role." });
      }

      // Check if the role's permissions include the required one
      if (permissions.has(requiredPermission)) {
        next(); // User has permission
      } else {
        return res.status(403).json({
          message: "Forbidden: You do not have permission for this action.",
        });
      }
    } catch (error) {
      console.error("Authorization Error:", error);
      res.status(500).json({ message: "Error during authorization." });
    }
  };
};

// Helper to clear cache if roles are updated (optional but good)
export const clearRoleCache = (roleId) => {
  if (roleId) {
    rolePermissionsCache.delete(roleId);
  } else {
    rolePermissionsCache.clear();
  }
};
