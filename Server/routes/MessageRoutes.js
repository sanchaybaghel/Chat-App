import { Router } from "express";
import verifyToken from "../middlewares/AuthMiddleware.js";
import { getMessages, uploadFile } from "../controllers/MessagesController.js";
import storage from "../config/cloudinaryStorage.js";
import multer from "multer";
const messagesRoutes=Router();
const upload=multer({storage})
messagesRoutes.post("/upload-file",verifyToken,upload.single("file"),uploadFile)

messagesRoutes.post("/get-messages",verifyToken,getMessages)

export default messagesRoutes;