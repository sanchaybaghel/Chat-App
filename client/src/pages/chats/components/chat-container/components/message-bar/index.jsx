import userAppStore from "@/store";
import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";
import { useSocket } from "@/context/SocketContext";
import { ApiClient } from "@/lib/Api-client";
import { UPLOAD_FILE_ROUTES } from "@/utils/constants";

const MessageBar = () => {
  const [message, setMessage] = useState("");
  const { selectedChatData, selectedChatType, userInfo } = userAppStore();
  const socket = useSocket();
  const fileInputRef = useRef();
  const emojiRef = useRef();
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  const handleAttachment = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    console.log("clicked");
    if (selectedChatType === "contact") {
      console.log("sending message");

      if (!socket) {
        console.error("Socket is not available");
        return;
      }

      // Use socket directly since we're now getting the actual socket instance from context
      socket.emit(
        "sendMessage",
        {
          sender: userInfo.id,
          recipient: selectedChatData._id,
          messageType: "text",
          content: message,
          fileUrl: undefined,
        },
        (response) => {
          console.log("Message sent response:", response);
        }
      );

      setMessage("");
    }
  };

  const handleAttachmentchange = async (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const response = await ApiClient.post(UPLOAD_FILE_ROUTES, formData, {
          withCredentials: true,
        });

        if (response.status == 200 && response?.data?.result?.url) {
          if (selectedChatType === "contact") {
            socket.emit(
              "sendMessage",
              {
                sender: userInfo.id,
                recipient: selectedChatData._id,
                messageType: "file",
                content: undefined,
                fileUrl: response.data.result.url,
              },
              (response) => {
                console.log("Message sent response:", response);
              }
            );
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="h-[10vh] bg-[#1c1d25] flex items-center px-4 mb-6 gap-6 sm:gap-2">
      <div className="flex-1 flex bg-[#2a2b33] rounded items-center gap-5 pr-5 px-4">
        <input
          type="text"
          className="flex gap-5 flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
        />
        <button
          className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
          onClick={handleAttachment}
        >
          <GrAttachment className="text-2xl" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleAttachmentchange}
          name="file"
          accept="image/*,video/*,audio/*,application/*"
        />
        <div className="relative">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={() => setEmojiPickerOpen(true)}
          >
            <RiEmojiStickerLine className="text-2xl" />
          </button>
          <div ref={emojiRef} className="absolute bottom-16 right-0">
            <EmojiPicker
              theme="dark"
              open={emojiPickerOpen}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>
      <button
        className="bg-[#8417ff] rounded-md flex items-center justify-center p-5 focus:border-none hover:bg-[#741bda] focus:focus-outline-none focus:outline-none focus:text-white duration-300 transition-all"
        onClick={handleSendMessage}
      >
        <IoSend className="text-2xl" />
      </button>
    </div>
  );
};

export default MessageBar;
