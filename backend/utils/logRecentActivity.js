import RecentActivity from "../models/recentActivity.js";


export const logRecentActivity = async (req, action, module, description, metaData = {}) => {
    try {
        if (!req.user) return;

        await RecentActivity.create({
            organizationId: req.user.organizationId,
            user: req.user._id,
            action,
            module,
            description,
            metaData,
        })
    } catch (error) {
        console.error("Error logging recent activity:", error);
    }
}