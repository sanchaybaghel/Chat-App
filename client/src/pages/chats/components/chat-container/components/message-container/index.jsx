import userAppStore from "@/store";
import moment from "moment";
import React, { useEffect, useRef } from "react";

import { ApiClient } from "@/lib/Api-client";
import { GET_ALL_MESSAGES_ROUTES } from "@/utils/constants";
import { MdFolder } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";

const MessageContainer = () => {
  const scrollRef = useRef();
  const { selectedChatData, selectedChatType, userInfo, selectedChatMessage, setSelectedChatMessages } =
    userAppStore();
    
  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await ApiClient.post(GET_ALL_MESSAGES_ROUTES, {
          userId: selectedChatData._id,
        }, {
          withCredentials: true,
        });
       
        if (res.data.messages) {
          const sortedMessages = res.data.messages.sort((a, b) =>
            new Date(a.timestamp) - new Date(b.timestamp)
          );
          setSelectedChatMessages(sortedMessages);
        }
      }
      catch(err) {
        console.log("err", err);
      }
    }
    
    if (selectedChatData && selectedChatData._id) {
      if (selectedChatType === 'contact') {
        getMessages();
      }
    }
  }, [selectedChatData, selectedChatType]);
  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessage]);
  
  const checkIfImage = (filePath) => {
    const imageFileRegex = /\.(jpeg|jpg|png|gif)$/i;
    return imageFileRegex.test(filePath);
  }

  const downloadFile = (url) => {
    const a = document.createElement("a");
    a.href = url;
    {console.log(a)}
    a.download = url.split("/").pop();
    a.click();
  }
  
  const renderDMMessages = (message) => {
    // Fix: Support both string and object for sender
    let senderId = message.sender;
    if (typeof senderId === "object" && senderId !== null) {
      senderId = senderId._id;
    }
    const isSentByMe = senderId === userInfo.id;
    
    if (isSentByMe && message.messageType === "text") {
      // Sent messages (right side)
      return (
        <div className="w-full flex justify-end mb-2">
          <div className="max-w-[70%]">
            <div className="bg-[#2a2b33] text-white/80 rounded-xl rounded-bl-none p-2 px-3">
              {message.content}
            </div>
            <div className="text-xs text-gray-600 text-right mt-1">
              {moment(message.timeStamp).format("LT")}
            </div>
          </div>
        </div>
      );
    } else if (!isSentByMe && message.messageType === "text") {
      // Received messages (left side)
      return (
        <div className="w-full flex justify-start mb-2">
          <div className="max-w-[70%]">
            <div className="bg-[#8417ff]/50 text-white rounded-xl rounded-br-none p-2 px-3">
              {message.content}
            </div>
            <div className="text-xs text-gray-600 text-left mt-1">
              {moment(message.timeStamp).format("LT")}
            </div>
          </div>
        </div>
      );
    } else if (message.messageType === 'file' ) {
      // File messages
      return (
        <div className={`w-full flex ${isSentByMe ? "justify-end" : "justify-start"} mb-2`}>
          <div className="max-w-[70%]">
            <div className={`${isSentByMe
              ? "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
              : "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
            } border p-4 rounded my-1 break-words`}>
              {checkIfImage(message.fileUrl) ? (
                <div className="cursor-pointer">
                 <img src={message.fileUrl} height={200} width={200} alt="Shared image"/>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-4">
                  <span className="text-white/8 text-3xl bg-black/20 rounded-full p-3">
                    <MdFolder/>
                  </span>
                  <span>{message.fileUrl.split("/").pop()}</span>
                  <span className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/30 cursor-pointer transition-all duration-300"
                  onClick={() => downloadFile(message.fileUrl)}>
                    <IoMdArrowRoundDown/>
                  </span>
                </div>
              )}
            </div>
            <div className={`text-xs text-gray-600 ${isSentByMe ? "text-right" : "text-left"} mt-1`}>
              {moment(message.timeStamp).format("LT")}
            </div>
          </div>
        </div>
      );
    }
    

    // Return null for any unhandled message types
    return null;
  };

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessage.map((message) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={message._id}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
        </div>
      );
    });
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 w-full">
      <div className="flex flex-col">
        {renderMessages()}
      </div>
      <div ref={scrollRef} />
    </div>
  );
};

export default MessageContainer;
//6:38:18