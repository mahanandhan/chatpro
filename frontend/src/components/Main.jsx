import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ChatSpace from "./ChatSpace";

const Main = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  // 👇 function to handle user selection
  const handleSelectUser = (user) => {
    console.log("Selected user:", user);
    setSelectedUser(user);
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-linear-to-b from-gray-200 to-gray-400">
      <div
        className="flex rounded-3xl shadow-2xl overflow-hidden"
        style={{ width: "900px", height: "650px", background: "#232B3E" }}
      >
        {/* ✅ pass the prop here */}
        <Sidebar onSelectUser={handleSelectUser} />

        {/* ✅ show the chat space for the selected user */}
        <ChatSpace selectedUser={selectedUser} />
      </div>
    </div>
  );
};

export default Main;
