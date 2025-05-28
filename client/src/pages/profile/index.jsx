import userAppStore from "@/store";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { colors, getColor } from "@/lib/utils";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ApiClient } from "@/lib/Api-client";
import { ADD_PROFILE_IMAGE_ROUTE, HOST, UPDATE_PROFILE_ROUTE } from "@/utils/constants";

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = userAppStore();
  const [firstName, setFirstName] = useState(""); // Initialize with an empty string
  const [lastName, setLastName] = useState(""); // Initialize with an empty string
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userInfo.profileSetup) {
      setLastName(userInfo.lastName || ""); // Fallback to an empty string
      setFirstName(userInfo.firstName || ""); // Fallback to an empty string
      setSelectedColor(userInfo.color || 0);
    }
    {console.log(HOST)}
    if(userInfo.image){
      setImage(`${HOST}/${userInfo.image}`);
    }
  }, [userInfo]);

  const validateProfile = () => {
    if (!firstName) {
      toast.error("First Name is Required");
      return false;
    }
    if (!lastName) {
      toast.error("Last Name is required");
      return false;
    }
    return true;
  };

  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const response = await ApiClient.post(
          UPDATE_PROFILE_ROUTE,
          { firstName, lastName, color: selectedColor },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data) {
          setUserInfo({ ...response.data });
          toast.success("Profile Updated Successfully");
          navigate("/chat");
          console.log("Navigating to /chat");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile. Please try again.");
      }
    }
  };

  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("Please setup profile");
    }
  };

  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the input value
      fileInputRef.current.click(); // Trigger the file input
    } else {
      console.log("File input ref is not set");
    }
  };

  const handleImageChange = async (event) => {
    const file=event.target.files[0];
    if(file){
      const formData=new FormData();
      formData.append("profile-image",file);
      const response=await ApiClient.post(ADD_PROFILE_IMAGE_ROUTE,formData,{withCredentials:true});
      if(response.status==200 && response?.data?.image){
        setUserInfo({...userInfo,image:response.data.image});
        toast.success("Image updated successfully")
      }
      const reader=new FileReader();
      reader.onload=()=>{
        setImage(reader.result);
      }
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = async () => {
    setImage(null); // Clear the image preview
    console.log("Image deleted");
  };

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div onClick={handleNavigate}>
          <IoArrowBack className="text-4xl lg:text-6xl text-white/90 cursor-pointer" />
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Avatar Section */}
          <div
            className="relative flex items-center justify-center h-32 w-32 md:h-48 md:w-48"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-full w-full rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-full w-full text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                    selectedColor
                  )}`}
                >
                  {firstName ? firstName[0] : userInfo.email[0]}
                </div>
              )}
            </Avatar>

            {hovered && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full"
                onClick={image ? handleDeleteImage : handleFileInputClick}
              >
                {image ? (
                  <FaTrash className="text-white text-3xl cursor-pointer" />
                ) : (
                  <div className="relative">
                    <FaPlus className="text-white text-3xl cursor-pointer" />
                  </div>
                )}
              </div>
            )}
            <Input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
              name="profile-image"
              accept="image/*"
            />
          </div>
          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
            <div className="w-full ">
              <Input
                placeholder="Email"
                type="email"
                disabled
                value={userInfo.email || ""}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full ">
              <Input
                placeholder="First Name"
                type="text"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName || ""}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full ">
              <Input
                placeholder="Last Name"
                type="text"
                value={lastName || ""}
                onChange={(e) => setLastName(e.target.value)}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full flex gap-5">
              {colors.map((color, index) => (
                <div
                  className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300
                  ${
                    selectedColor === index
                      ? "outline outline-white/50 outline-1"
                      : ""
                  }
                  `}
                  key={index}
                  onClick={() => setSelectedColor(index)}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full">
          <Button
            className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
            onClick={saveChanges}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
//2:47:57
