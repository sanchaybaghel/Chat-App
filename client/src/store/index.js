import { create } from "zustand";
import { createAuthSlice } from "./slice/authslice";
import { createChatSlice } from "./slice/chatslice";

const userAppStore=create()((...a)=>({
    ...createAuthSlice(...a),
    ...createChatSlice(...a)

}))
export default userAppStore;
