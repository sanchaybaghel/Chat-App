import dotenv from "dotenv";
dotenv.config();
import { Router } from "express";
import {
  getuserInfo,
  login,
  signup,
  updateProfile,
  addProfileImage,
  removeProfileImage,
  logout
} from "../controllers/AuthController.js";
import verifyToken from "../middlewares/AuthMiddleware.js";
import multer from "multer";
import cloudinary from "cloudinary";
console.log("env",process.env.PORT);
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const authRotes = Router();

const upload = multer({ dest: "uploads/profiles/" });

authRotes.post("/signup", signup); // Route for user signup
authRotes.post("/login", login); // Route for user login
authRotes.get("/user-info", verifyToken, getuserInfo); // Route to fetch user info
authRotes.post("/update-profile", verifyToken, updateProfile); // Route to update user profile
authRotes.post(
  "/add-profile-image",
  verifyToken,
  upload.single("profile-image"),
  addProfileImage
);

authRotes.delete("/remove-profile-image", verifyToken, removeProfileImage);
authRotes.post('/logout',logout)

export default authRotes;
