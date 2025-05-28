import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Chat_files", // Just a string, not a function
    resource_type: "raw",
  },
});

export default storage;