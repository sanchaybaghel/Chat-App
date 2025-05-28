import React, { useEffect } from "react";
import ProfieInfo from "./components/profile-info";
import NewDm from "./new-dm";
import { ApiClient } from "@/lib/Api-client";
import { GET_DM_CONTACTS_ROUTES } from "@/utils/constants";
import ContactList from "@/components/ui/ContactList";
import userAppStore from "@/store";

const ContactsContainer = () => {

  const {setDirectMessagesContacts,directMessagesContacts}=userAppStore();
  useEffect(()=>{
    const getContacts=async()=>{
      const res=await ApiClient.get(GET_DM_CONTACTS_ROUTES,{
        withCredentials:true,
      });
      if(res.status===200 && res.data.contacts){
        setDirectMessagesContacts(res.data.contacts);
      }
     // console.log("res",res);
    }
    getContacts();
  })
  return (
    <div className="relative md:w-min-[250px] bg-[#1b1c24] border-r-2 border-[#2f303b] flex flex-col h-full overflow-y-auto">
      <div className="pt-3">
        <Logo />
      </div>
      <div className="my-5">
        <Title text="Direct Messages" />
        <NewDm/>
      </div>
      <div className="max-h-[300px] overflow-y-auto scrollbar-hidden">
        <ContactList contacts={directMessagesContacts} />
      </div>
      <div className="my-5">
        <Title text="Channels" />
      </div>
      <div className="mt-auto">
        <ProfieInfo />
      </div>
    </div>
  );
};

export default ContactsContainer;

const Logo = () => {
  return (
    <div className="flex p-5 justify-start items-center gap-2">
      <svg
        id="logo-38"
        width="78"
        height="32"
        viewBox="0 0 78 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z"
          className="ccustom"
          fill="#8338ec"
        ></path>
        <path
          d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"
          className="ccompli1"
          fill="#975aed"
        ></path>
        <path
          d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z"
          className="ccompli2"
          fill="#a16ee8"
        ></path>
      </svg>
      <span className="text-3xl font-semibold">Syncronus</span>
    </div>
  );
};

const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">
      {text}
    </h6>
  );
};
