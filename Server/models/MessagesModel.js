import mongoose from "mongoose";

const messageSchema=new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required:[true,"Sender is required"],
    },
    recipient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required:[true,"Recipient is required"],
    },
    messageType:{
        type:String,
        enum:["text","image","video","audio","file"],
        required:[true,"Message type is required"],
    },
    timestamp:{
        type:Date,
        default:Date.now,
    },
    content:{
        type:String,
        required:function(){
            return this.messageType==="text";
        }
    },
    fileUrl:{
        type:String,
        required:function(){
            return this.messageType!=="text";
        }
    }

});
const Message=mongoose.model("Messages",messageSchema);
export default Message;