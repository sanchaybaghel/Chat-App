import Message from "../models/MessagesModel.js";
import cloudinary from "cloudinary";

export const getMessages = async (req, res, next) => {
  
  try {
    const user1=req.userId;
    const user2=req.body.userId;

    if(!user1 || !user2){
        return res.status(400).send("user1 and user2 are required. ")
    }
    const messages=await Message.find({
        $or:[
            {sender:user1,recipient:user2},
            {sender:user2,recipient:user1},
        ],
    }).sort({timestamp:1});
    return res.status(200).json({messages});
  } catch (err) {
    console.error("Error in updateProfile:", err);
    return res.status(500).send("Internal Server Error");
  }
};

export const uploadFile = async (req, res, next) => {
  
  try {
    if(!req.file) return res.status(400).send("File is required");
    return res.status(200).json({result:{url:req.file.path}});
  } catch (err) {
    console.error("Error in updateProfile:", err);
    return res.status(500).send("Internal Server Error");
  }
};
