import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';

const ChatSpace = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  // ✅ Fetch current logged-in user once
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/me", {
          withCredentials: true,
        });
        setCurrentUser(res.data);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
    fetchCurrentUser();
  }, []);

  // ✅ Fetch messages when user changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser?._id) return;
      try {
        const res = await axios.get(
          `http://localhost:5000/api/private/${selectedUser._id}`,
          { withCredentials: true }
        );
        setMessages(res.data.messages || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessages([]);
      }
    };
    fetchMessages();
  }, [selectedUser]);

  // ✅ Send message
  const handleSend = async () => {
    if (!newMsg.trim() || !selectedUser?._id || !currentUser?._id) return;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/private/send",
        {
          receiverId: selectedUser._id,
          message: newMsg,
        },
        { withCredentials: true }
      );

      const newMessage = {
        ...res.data.data,
        senderId: currentUser._id,
      };

      setMessages((prev) => [...prev, newMessage]);
      setNewMsg("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // ✅ Delete message (only for sender)
  const handleDelete = async (msgId) => {
    try {
      await axios.delete(`http://localhost:5000/api/private/message/${msgId}`, {
        withCredentials: true,
      });
      setMessages((prev) => prev.filter((msg) => msg._id !== msgId));
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  // ✅ Empty chat state
  if (!selectedUser) {
    return (
      <div className="flex-1 h-full bg-[#232B3E] flex items-center justify-center text-gray-400">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="flex-1 h-full bg-[#232B3E] p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center space-x-3 pb-4">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
          <span className="text-white font-bold">
            {selectedUser.fullname?.charAt(0).toUpperCase()}
          </span>
        </div>
        <h1 className="text-white text-xl font-semibold">
          {selectedUser.fullname}
        </h1>
      </div>

      <hr className="border-gray-700" />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {messages.map((msg) => {
          const senderId =
            typeof msg.senderId === "object"
              ? msg.senderId._id
              : msg.senderId;

          const isMe = senderId === currentUser?._id;
          return (
            <div
              key={msg._id}
              className={`flex items-start gap-2 ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs p-3 rounded-2xl shadow-lg ${
                  isMe
                    ? "bg-blue-600 text-white rounded-bl-none order-2"
                    : "bg-gray-700 text-white rounded-br-none order-1"
                }`}
              >
                <p className="text-sm">{msg.message}</p>
              </div>

              {/* ✅ Trash icon only for sender */}
              {isMe && (
                <button
                  onClick={() => handleDelete(msg._id)}
                  className="text-red-400 hover:text-red-600 transition p-1 mt-1 order-1"
                  title="Delete message"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="flex items-center gap-4 mt-4">
        <input
          type="text"
          placeholder="Enter your message..."
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="placeholder:text-gray-400 bg-gray-700 p-3 flex-1 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 p-3 rounded-full hover:bg-blue-600 transition-colors cursor-pointer shrink-0 shadow-md"
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default ChatSpace;
