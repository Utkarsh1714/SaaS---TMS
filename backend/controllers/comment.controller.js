import Comment from "../models/comment.model.js";
import Task from "../models/task.model.js";
import { logRecentActivity } from "../utils/logRecentActivity.js";

export const addComment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { author, content } = req.body;

    if (!author || !content)
      return res
        .status(400)
        .json({ message: "Author and content are required." });

    const newComment = await Comment.create({ author, content });

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    task.comments.push(newComment._id);
    task.save();

    await logRecentActivity(req, "POST_COMMENT", "Comment", `Added a comment to task ${task.title}`, {
      taskId: task._id,
      commentId: newComment._id,
    });

    res
      .status(201)
      .json({ message: "Comment added successfully", comment: newComment });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    console.log("Updating comment with ID:", commentId);
    const { content } = req.body;

    if (!content)
      return res.status(400).json({ message: "Content is required." });

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    const isAuthor = comment.author.toString() === req.user._id.toString();
    const isBoss = req.user.role?.name === "Boss";

    if (!isAuthor && !isBoss) {
      return res.status(403).json({ message: "Unauthorized action." });
    }

    comment.content = content;
    const updatedComment = await comment.save();

    res
      .status(200)
      .json({
        message: "Comment updated successfully",
        comment: updatedComment,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    const isAuthor = comment.author.toString() === req.user._id.toString();
    const isBoss = req.user.role?.name === "Boss";

    if (!isAuthor && !isBoss) {
      return res.status(403).json({ message: "Unauthorized action." });
    }

    await Comment.findByIdAndDelete(commentId);

    res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message })
  }
};
