import userAppStore from "@/store";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ContactsContainer from "./components/contacts-container";
import EmptyChatContainer from "./components/empty-chat-container";
import ChatContainer from "./components/chat-container";

const Chat = () => {
  const { userInfo, selectedChatType } = userAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo && !userInfo.profileSetup) {
      toast("Please setup profile to continue");
      navigate("/profile");
    }
  }, [userInfo?.profileSetup, navigate]);

  return (
    <div className="flex h-[100vh] w-full text-white overflow-hidden border animated-border">
      <div className="h-full">
        <ContactsContainer />
      </div>
      <div className="flex-1 h-full">
        {selectedChatType ? <ChatContainer /> : <EmptyChatContainer />}
      </div>
    </div>
  );
};

export default Chat;
