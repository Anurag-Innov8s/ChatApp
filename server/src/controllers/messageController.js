import User from "../models/userModlel.js";
import Message from "../models/messageModel.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId,io } from "../lib/socket.js";
export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filterUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        res.status(200).json(filterUsers);

    } catch (error) {
        console.error("Error in getting Users", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        })
        res.status(200).json(messages)
    } catch (error) {

    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl=uploadResponse.secure_url; 
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl
        })
        await newMessage.save();

// todo: use of socket.io
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverId){
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }
        res.status(201).json(newMessage)
    } catch (error) {
        console.log("Error in sending message",error.message);
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
        
    }
}