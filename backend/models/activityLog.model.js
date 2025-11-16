import mongoose from 'mongoose';

const ActivityLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true
    },
    loginTime: {
        type: Date,
        required: true,
    },
    logoutTime: {
        type: Date,
        default: null,
    },
    durationInSeconds: {
        type: Number,
        default: null,
    },
});

const ActivityLog = mongoose.model('ActivityLog', ActivityLogSchema);

export default ActivityLog;