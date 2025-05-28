import React from "react";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import userAppStore from "@/store";
import { getColor } from "@/lib/utils";
import { HOST } from "@/utils/constants";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { IoPowerSharp } from "react-icons/io5";
import { ApiClient } from "@/lib/Api-client";
import { LOGOUT_ROUTE } from "@/utils/constants";

const ProfieInfo = () => {
  const { userInfo, setUserInfo } = userAppStore();

  const navigate = useNavigate();
  const logout = async () => {
    try {
      const res = await ApiClient.post(
        LOGOUT_ROUTE,
        {},
        { withCredentials: true }
      );
      if (res.status === 200) {
        navigate("/auth");
        setUserInfo(null);
      }
    } catch (err) {
      console.log(err);
    }
  };
  
  return (
    <div className="bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33]">
      <div className="flex gap-3 items-center justify-center">
        <div className="w-12 h-12 relative">
          <Avatar className="h-12 w-12 rounded-full overflow-hidden">
            {userInfo.image ? (
              <AvatarImage
                src={
                  userInfo.image.startsWith("http")
                    ? userInfo.image
                    : `${HOST}/${userInfo.image}`
                }
                alt="profile"
                className="object-cover w-full h-full bg-black rounded-full"
              />
            ) : (
              <div
                className={`uppercase h-12 w-12 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                  userInfo.color
                )}`}
              >
                {userInfo.firstName ? userInfo.firstName[0] : userInfo.email[0]}
              </div>
            )}
          </Avatar>
        </div>
        <div className="w-[120px] overflow-hidden text-ellipsis whitespace-nowrap">
          {userInfo.firstName && userInfo.lastName
            ? `${userInfo.firstName}${
                userInfo.lastName ? ` ${userInfo.lastName} ` : ""
              }`
            : userInfo.email || "Anonymous"}
        </div>
      </div>
      <div className="flex gap-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FiEdit2
                className="text-red-500 text-xl font-medium"
                onClick={() => navigate("/profile")}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
              <p>Edit Profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <IoPowerSharp
                className="text-purple-500 text-xl font-medium"
                onClick={logout}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
              <p>Log Out</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ProfieInfo;
//4:03:06
