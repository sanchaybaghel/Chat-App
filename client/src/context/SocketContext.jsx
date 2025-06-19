import React, { createContext, useContext, useEffect, useRef } from "react";
import io from "socket.io-client";
import { HOST } from "@/utils/constants";
import userAppStore from "@/store";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socket = useRef();
  const { userInfo } = userAppStore();

  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo.id },
      });

      socket.current.on("connect", () => {
        console.log("Connected to socket server");
      });

      const handleReceiveMessage = (message) => {
        console.log("Raw message received:", message);
        // Get the current state from the store
        const state = userAppStore.getState();
        const { selectedChatData, selectedChatType } = state;
        
        if (
          selectedChatType !== undefined &&
          selectedChatData &&
          (selectedChatData._id === message.sender._id ||
            selectedChatData._id === message.recipient._id)
        ) {
          console.log("Message added to chat:", message);
          // Use the store's actions properly
          const { setSelectedChatMessages, selectedChatMessage } = userAppStore.getState();
          setSelectedChatMessages([...selectedChatMessage, message]);
        }
      };

      // Listen for both event names to be safe
      socket.current.on("message", handleReceiveMessage);
      socket.current.on("recieveMessage", handleReceiveMessage);

      return () => {
        socket.current.disconnect();
      };
    }
  }, [userInfo]);

  // Provide the socket.current (the actual socket instance)
  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
