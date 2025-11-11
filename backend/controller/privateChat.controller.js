import Private from "../models/private.model.js";
import PrivateMessage from "../models/privateMessage.model.js";
import UserModel from "../models/user.model.js";

// ✅ Send a private message
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user._id;

    const user = await UserModel.findById(receiverId);
    if (!user) {
      return res.status(404).json({ message: "Receiver user not found" });
    }

    let chat = await Private.findOne({ participants: { $all: [senderId, receiverId] } });

    if (!chat) {
      chat = await Private.create({ participants: [senderId, receiverId] });
    }

    const newMessage = await PrivateMessage.create({
      message,
      receiverId,
      senderId,
    });

    chat.messages.push(newMessage._id);
    await chat.save();

    return res.status(201).json({
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Get all messages between two users
export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const senderId = req.user._id;

    const chat = await Private.findOne({
      participants: { $all: [senderId, userId] },
    })
      .populate({
        path: "messages",
        populate: [
          { path: "senderId", select: "username fullname _id" },
          { path: "receiverId", select: "username fullname _id" },
        ],
      })
      .exec();

    if (!chat) {
      return res.status(404).json({ message: "No chat found between users" });
    }

    // Add a flag for each message so the frontend can easily differentiate
    const formattedMessages = chat.messages.map((msg) => ({
      _id: msg._id,
      message: msg.message,
      senderId: msg.senderId,
      receiverId: msg.receiverId,
      createdAt: msg.createdAt,
      isMe: msg.senderId._id.toString() === senderId.toString(),
    }));

    res.status(200).json({ messages: formattedMessages });
  } catch (error) {
    console.error("Error in getMessages:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Delete a message (only if user is sender)
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const senderId = req.user._id;

    const message = await PrivateMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.senderId.toString() !== senderId.toString()) {
      return res.status(403).json({ message: "You can only delete your own messages" });
    }

    await PrivateMessage.findByIdAndDelete(messageId);

    await Private.updateOne(
      { messages: messageId },
      { $pull: { messages: messageId } }
    );

    return res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error in deleteMessage:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Get all users who messaged me or whom I messaged
export const getAllChatUsers = async (req, res) => {
  try {
    const userId = req.user._id;

    const chats = await Private.find({ participants: userId })
      .populate('participants', 'username fullname')
      .exec();

    // remove self from participants list
    const chatUsers = chats.flatMap(chat => 
      chat.participants.filter(p => p._id.toString() !== userId.toString())
    );

    return res.status(200).json({ users: chatUsers });
  } catch (error) {
    console.error("Error in getAllChatUsers:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
