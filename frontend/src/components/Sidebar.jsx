import React, { useEffect, useState } from "react";
import axios from "axios";

const Sidebar = ({ onSelectUser }) => {
  const [chatUsers, setChatUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChatUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/private/user", {
          withCredentials: true,
        });

        let users = [];

        if (Array.isArray(res.data?.chats)) {
          res.data.chats.forEach((chat) => {
            if (Array.isArray(chat.participants)) {
              chat.participants.forEach((p) => {
                if (!users.some((u) => u._id === p._id)) {
                  users.push(p);
                }
              });
            }
          });
        } else if (Array.isArray(res.data?.users)) {
          users = res.data.users;
        }

        setChatUsers(users);
      } catch (error) {
        console.error("Error fetching chat users:", error);
        setChatUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChatUsers();
  }, []);

  return (
    <div className="w-64 h-screen bg-[#19203B] p-4">
      <h1 className="text-white text-center mt-4 font-semibold text-lg">
        Chats
      </h1>

      {loading ? (
        <p className="text-gray-400 text-center mt-4">Loading...</p>
      ) : chatUsers.length > 0 ? (
        <ul className="mt-6 space-y-3">
          {chatUsers.map((user) => (
            <li
              key={user._id}
              onClick={() => onSelectUser(user)} // 👈 send selected user to parent
              className="text-white bg-[#1E2A4A] hover:bg-[#2C3C6C] p-3 rounded-lg cursor-pointer transition"
            >
              <p className="font-semibold">{user.fullname || user.fullName}</p>
              <p className="text-sm text-gray-400">@{user.username}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 text-center mt-6">No chats yet</p>
      )}
    </div>
  );
};

export default Sidebar;
