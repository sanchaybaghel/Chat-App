import { userAppStore } from "@/store";

const Profile = () => {
  const {userInfo} = userAppStore();
  console.log("userInfo",userInfo)
  return (
    <div>
      Profile:
      <div>Email:{userInfo.email}</div>
    </div>
  );
};

export default Profile;
