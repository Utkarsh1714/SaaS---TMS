import Comment from "../models/comment.model.js";
import Task from "../models/task.model.js";

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

    if (comment.author.toString() !== req.user._id) {
      return res.status(403).json({ message: "Unauthorized action." });
    }

    comment.remove();

    res.status(200).json({ message: "Comment deleted" });
  } catch (error) {}
};
