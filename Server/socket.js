console.log("socket.js")

import {Server as SocketIOServer} from "socket.io";
import Message from "./models/MessagesModel.js";
const setupSocket=(server)=>{
    const io=new SocketIOServer(server,{
        cors:{
            origin:["https://chat-app-git-main-sanchay-baghels-projects.vercel.app",
        "https://chat-app-ruddy-phi-27.vercel.app",
        "http://localhost:5173"],
            methods:["GET","POST","PUT","PATCH","DELETE"],
            credentials:true,
        }
    })

    const userSocket=new Map()
    const disconnect=(socket)=>{
       console.log(`Client Disconnected: ${socket.id}`);
       for(const [userId,socketId] of userSocket.entries()){
        if(socketId===socket.id){
            userSocket.delete(userId)
            break;
        }
       }
    }

    const sendMessage = async (message) => {
        try {
            const senderSocketId = userSocket.get(message.sender);
            const recipientSocketId = userSocket.get(message.recipient);
            
            console.log("Creating message:", message);
            console.log("Socket IDs - Sender:", senderSocketId, "Recipient:", recipientSocketId);
            
            const createMessage = await Message.create(message);
            const messageData = await Message.findById(createMessage._id)
                .populate("sender", "id email firstName lastName image color")
                .populate("recipient", "id email firstName lastName image color");
            
            console.log("Message created and populated:", messageData);
            
            if (recipientSocketId) {
                console.log("Emitting message to recipient:", recipientSocketId);
                io.to(recipientSocketId).emit("message", messageData);
            }
            
            if (senderSocketId) {
                console.log("Emitting message to sender:", senderSocketId);
                io.to(senderSocketId).emit("message", messageData);
            }
            
            return messageData;
        } catch (error) {
            console.error("Error in sendMessage function:", error);
            throw error;
        }
    };
    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId) {
            userSocket.set(userId, socket.id);
            console.log(`User connected: ${userId} with socket ID ${socket.id}`);
        } else {
            console.log("User not connected");
        }
        
        // Add debug logging for all events
        socket.onAny((event, ...args) => {
            console.log(`Event received: ${event}`, args);
        });
        
        // Add explicit handler for sendMessage event
        socket.on("sendMessage", async (messageData, callback) => {
            console.log("Message received:", messageData);
            try {
                await sendMessage({
                    sender: messageData.sender,
                    recipient: messageData.recipient,
                    messageType: messageData.messageType,
                    content: messageData.content,
                    fileUrl: messageData.fileUrl
                });
                
                if (callback && typeof callback === 'function') {
                    callback({ success: true, message: "Message sent successfully" });
                }
            } catch (error) {
                console.error("Error sending message:", error);
                if (callback && typeof callback === 'function') {
                    callback({ success: false, error: error.message });
                }
            }
        });
        
        socket.on("disconnect", () => disconnect(socket));
    })
}
export default setupSocket;
