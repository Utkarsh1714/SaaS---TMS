import Channel from "../models/channelModel.js";
import Message from '../models/MessageModel.js'

export const accessOrCreateChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) return res.status(400).json({ message: "UserId is required." });

  const loggedInUserId = req.body.id;
  const organizationId = req.body.organizationId;

  let existingChat = await Channel.findOne({
    isGroupChat: false,
    organizationId: organizationId,
    $and: [
      { participants: { $elemMatch: { $eq: loggedInUserId } } },
      { participants: { $elemMatch: { $eq: userId } } },
    ],
  }).populate("participants", "-password");

  if (existingChat) return res.status(200).json(existingChat);

  // If no chat exist, create a new one
  const newChatData = {
    isGroupChat: false,
    participants: [loggedInUserId, userId],
    organizationId: organizationId,
  };

  try {
    const newChat = await Channel.create(newChatData);

    const fullChat = await Channel.findById(newChat._id).populate(
      "participants",
      "-password"
    );

    res.status(201).json(fullChat);
  } catch (error) {
    console.error("Error creating new chat:", error);
    res.status(500).json({ message: "Server error while creating chat." });
  }
};

export const fetchuserChat = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;

    const chats = await Channel.find({
      participants: { $elemMatch: { $eq: loggedInUserId } },
    })
      .populate("participants", "-password")
      .populate("groupAdmin", "-password")
      .sort({ updatedAt: -1 });

    res.status(200).json(chats);
  } catch (error) {
    console.error("Error fetching user chats:", error);
    res.status(500).json({ message: "Server error while fetching chats." });
  }
};

export const getMessagesForChannel = async (req, res) => {
    try {
        const { channelId } = req.params;

        const messages = await Message.find({ channel: channelId })
            .populate("sender", "username email"); // Populate sender's info

        res.status(200).json(messages);

    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Server error while fetching messages." });
    }
};