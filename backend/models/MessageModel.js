import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        trim: true,
        required: true,
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel",
        required: true,
    },
    readBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true,
    },
}, {
    timestamps: true,
});

const Message = mongoose.model("Message", messageSchema);
export default Message;