import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    isGroupChat: {
        type: Boolean,
        default: false,
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
    },
}, {
    timestamps: true,
})

const Channel = mongoose.model('Channel', channelSchema);
export default Channel;