import userAppStore from "@/store";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";
import { RiCloseFill } from "react-icons/ri";

const ChatHeader = () => {
  const { closeChat, selectedChatData ,selectedChatType} = userAppStore();
  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20">
      <div className="flex gap-5 items-center">
        <div className="flex gap-3 items-center justify-center">
          <div className="flex items-center justify-center gap-5">
            <div className="w-12 h-12 relative">
              <Avatar className="h-12 w-12 rounded-full overflow-hidden ">
                {selectedChatData.image ? (
                  <AvatarImage
                    src={
                      selectedChatData.image &&
                      selectedChatData.image.startsWith("http")
                        ? selectedChatData.image
                        : `${HOST}/${selectedChatData.image}`
                    }
                    alt="profile"
                    className="object-cover w-full h-full bg-black rounded-full"
                  />
                ) : (
                  <div
                    className={`uppercase h-12 w-12 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                      selectedChatData.color
                    )}`}
                  >
                    {selectedChatData.firstName
                      ? selectedChatData.firstName.split("").shift()
                      : selectedChatData.email.split("").shift()}
                  </div>
                )}
              </Avatar>
            </div>
            <span className="ml-4 text-lg font-semibold">
              {selectedChatData.firstName? selectedChatData.firstName : selectedChatData.email}
            </span>
            <button
              className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
              onClick={closeChat}
            >
              <RiCloseFill className="text-3xl" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
//3:38:40
