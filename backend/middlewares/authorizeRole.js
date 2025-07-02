// const authorizeRole = (role) => {
//     return (req, res, next) => {
//         if (req.user.role !== role) {
//             return res.status(403).json({
//                 message: `Access denied: Unauthorized role`,
//             })
//         }
//         next();
//     }
// }

// export default authorizeRole;

const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied: Unauthorized role",
      });
    }
    next();
  };
};

export default authorizeRole;
