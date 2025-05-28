import React, { useState } from "react";
import victory from "@/assets/victory.svg";
import Background from "@/assets/login.jpeg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ApiClient } from "@/lib/Api-client.js";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import userAppStore from "@/store";
import { UserIcon } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const { userInfo,setUserInfo } = userAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validateSignup = () => {
    if (!email.length) {
      toast.error("Please enter your email.");
      return false;
    }
    if (!password.length) {
      toast.error("Please enter your password.");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }
    return true;
  };

  const validatelogin = () => {
    if (!email.length) {
      toast.error("Please enter your email.");
      return false;
    }
    if (!password.length) {
      toast.error("Please enter your password.");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (validatelogin()) {
      setLoading(true);
      try {
        const res = await ApiClient.post(LOGIN_ROUTE, { email, password }, { withCredentials: true });
        if (res.data.user.id) {
          setUserInfo(res.data.user);
          console.log("req.data.user",res.data.user.profileSetup)
          if (res.data.user.profileSetup){
            navigate("/chat");
          } 
          else{
            console.log("enter into else part")
            navigate("/profile")
            }
        }
      } catch (error) {
        console.error("Login failed:", error);
        toast.error("Login failed. Please check your credentials.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSignUp = async () => {
    if (validateSignup()) {
      setLoading(true);
      try {
        const res = await ApiClient.post(SIGNUP_ROUTE, { email, password }, { withCredentials: true });
        console.log({ res });
        if (res.status === 201) {
          setUserInfo(res.data.user);
          navigate("/profile");
        }
      } catch (error) {
        console.error("Signup failed:", error);
        toast.error("Signup failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
      <div className="h-[80vh] bg-white border border-gray-200 shadow-lg w-[90vw] md:w-[70vw] lg:w-[60vw] xl:w-[50vw] rounded-3xl grid xl:grid-cols-2">
        {/* Left Section */}
        <div className="flex flex-col gap-6 items-center justify-center p-6">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold lg:text-5xl text-gray-800">Welcome</h1>
            <img src={victory} alt="Victory illustration" className="h-24 mt-4" />
          </div>
          <p className="font-medium text-center text-gray-600">
            Fill in the details to get started with the best chat app!
          </p>
        </div>

        {/* Right Section */}
        <div className="flex items-center justify-center w-full p-6">
          <Tabs className="w-3/4" defaultValue="login">
            <TabsList className="flex w-full border-b border-gray-300">
              <TabsTrigger
                value="login"
                className="cursor-pointer w-1/2 text-center py-2 text-gray-700 font-medium border-b-2 border-transparent hover:border-purple-500 transition-all duration-300 data-[state=active]:border-purple-500 data-[state=active]:text-purple-500"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="cursor-pointer w-1/2 text-center py-2 text-gray-700 font-medium border-b-2 border-transparent hover:border-purple-500 transition-all duration-300 data-[state=active]:border-purple-500 data-[state=active]:text-purple-500"
              >
                SignUp
              </TabsTrigger>
            </TabsList>
            <TabsContent className="flex flex-col gap-5 mt-10" value="login">
              <Input
                placeholder="Email"
                type="email"
                className="rounded-full p-6 border border-gray-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Password"
                type="password"
                className="rounded-full p-6 border border-gray-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button className="rounded-full p-6" onClick={handleLogin} disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </TabsContent>
            <TabsContent className="flex flex-col gap-5 mt-10" value="signup">
              <Input
                placeholder="Email"
                type="email"
                className="rounded-full p-6 border border-gray-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Password"
                type="password"
                className="rounded-full p-6 border border-gray-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                placeholder="Confirm Password"
                type="password"
                className="rounded-full p-6 border border-gray-300"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button className="rounded-full p-6" onClick={handleSignUp} disabled={loading}>
                {loading ? "Signing up..." : "SignUp"}
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <div className="hidden xl:flex justify-center items-center">
        <img src={Background} alt="background" className="h-[700px]" />
      </div>
    </div>
  );
};

export default Auth;