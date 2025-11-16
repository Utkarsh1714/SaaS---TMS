import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  content: {
    type: String,
    required: true
  }
}, { timestamps: true, timeseries: true });

const Comment = mongoose.model("Comment", CommentSchema);

export default Comment;
