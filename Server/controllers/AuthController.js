import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import pkg from "jsonwebtoken";
import { renameSync, existsSync, mkdirSync,unlinkSync } from "fs";
import fs from "fs";
import cloudinary from "cloudinary";
const { sign } = pkg;
const maxAge = 5 * 24 * 60 * 60;
const createToken = (email, userId) => {
  return sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge });
};

export const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).send("Email and password is required");
    const user = await User.create({ email, password });
    res.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });
    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
  } catch (err) {
    console.log({ err });
    return res.status(500).send("Internal Server Error");
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).send("Email and Password is required");
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("user with the given email not found");
    }
    const auth = await compare(password, user.password);
    if (!auth) {
      return res.status(400).send("password is incorrect");
    }
   // console.log("token 12",createToken(email, user.id))
    res.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });
    //console.log("res in",res)
    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        color: user.color,
      },
    });
  } catch (err) {
    console.log("email", email);
    console.log({ err });
    return res.status(500).send("Internal Server Error");
  }
};

export const getuserInfo = async (req, res, next) => {
  
  try {
    const userData = await User.findOne({ _id: req.userId });
    if (!userData) {
      return res.status(401).send("User with the given id not found.");
    }
    return res.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      color: userData.color,
      image: userData.image,
    });
  } catch (err) {
    console.error("Error in getuserInfo:", err);
    return res.status(500).send("Internal Server Error");
  }
};

export const updateProfile = async (req, res, next) => {
  
  try {
    const { userId } = req;
    const { firstName, lastName, color } = req.body;

    if (!firstName || !lastName ) {
      return res.status(400).send("FirstName, lastName, and color are required.");
    }

    const userData = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        color,
        profileSetup: true,
      },
      { new: true, runValidators: true }
    );

    if (!userData) {
      return res.status(404).send("User not found.");
    }

    return res.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.color,
      color: userData.color,
    });
  } catch (err) {
    console.error("Error in updateProfile:", err);
    return res.status(500).send("Internal Server Error");
  }
};

export const addProfileImage = async (req, res, next) => {

  try{
    if(!req.file) return res.status(400).send("File is required");
    const result=await cloudinary.v2.uploader.upload(req.file.path,{
      folder:"profiles"
    });
    fs.unlinkSync(req.file.path);
    const updateUser=await User.findByIdAndUpdate(
      req.userId,
      {image:result.secure_url},
      {new:true,runValidators:true}
    );
    if(!updateUser) return res.status(404).send("User not found");
    return res.status(200).json({
      image:updateUser.image
    });
  } catch(err){
    console.error("Error in addProfileImage:", err);
    return res.status(500).send("Internal Server Error");
  }
};

export const removeProfileImage = async (req, res, next) => {
  
  try {
    const { userId } = req;
    const user = await User.findById(userId)
    if(!user) return res.status(404).send("User not found");
    if(user.image){
      unlinkSync(user.image)
    }

    user.image=null;
    await user.save();
    
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        color,
        profileSetup: true,
      },
      { new: true, runValidators: true }
    );

    if (!userData) {
      return res.status(404).send("User not found.");
    }

    return res.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.color,
      color: userData.color,
    });
  } catch (err) {
    console.error("Error in updateProfile:", err);
    return res.status(500).send("Internal Server Error");
  }
};

export const logout = async (req, res, next) => {
  
  try {
    res.cookie("jwt","",{maxAge:1,secure:true,sameSite:"None"})
    res.status(200).send("Logout successfully. ")
  } catch (err) {
    console.error("Error in updateProfile:", err);
    return res.status(500).send("Internal Server Error");
  }
};




//2:34:00
