import { catchAsyncError } from "../middelware/catchAsyncError.middelware.js"
import { User } from '../model/user.model.js'
import { Message } from '../model/message.model.js'
import { v2 as cloudinary } from 'cloudinary'
import { getReceiverSocketId, io } from "../utils/socket.io.js"

export const getAllUsers = catchAsyncError(async (req, resp, next) => {
    const user = req.user;
    const filteredUser = await User.find({ _id: { $ne: user } }).select("-password")//abko find kro accepte _id: not include
    // ye sriph all user ko get knre ke liya hai accepte current user
    return resp.status(200).json({ success: false, message: "All Users fetch from DB.", filteredUser })

})
export const getMessages = catchAsyncError(async (req, resp, next) => {
    const reciverId = req.params.id;//get from the frontend application
    const myId = req.user._id;
    const reciver = await User.findById(reciverId);// reciver ki id le ke DB me check kruga 
    if (!reciver) {
        return resp.status(400).json({ success: false, message: "Reciver id invalid." })
    }

    const messages = await Message.find({
        $or: [
            { senderId: myId, reciverId: reciverId },//jb me message send kruga to bhi message fetch kreke do 
            { senderId: reciverId, reciverId: myId }//jb koi aur message krega to bhi fetch krke do
        ],
    }).sort({ createdAt: 1, _id: 1 }); // Ascending: oldest message first (top), newest last (bottom)

    return resp.status(200).json({ success: true, messages })



});
export const sendMessage = catchAsyncError(async (req, resp, next) => {
    const text = req.body?.text;
    const media = req?.files?.media;
    const { id: reciverId } = req.params;
    const senderId = req.user._id;
    const reciver = await User.findById(reciverId);
    if (!reciver) {
        return resp.status(400).json({ success: false, message: "Receiver In Invalid." })
    }
    const sanitizedText  = text?.trim() || "";
    if (!sanitizedText && !media) {
        return resp.status(400).json({ success: false, message: 'Cannot send empty message.' })
    }
  let mediaUrl = "";// isme hm cloudnary pe jo vid/img hai uska url store krege jo frontend me jaye ga

    if (media) {
        try {
            console.log("Uploading media:", { fileName: media.name, size: media.size });
            
            // Upload directly from buffer using upload_stream (works on Vercel serverless)
            const uploadResponse = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: "auto",
                        folder: "CHAT_APP_MEDIA",
                        transformation: [
                            { width: 1080, height: 1080 },
                            { quality: "auto" },
                            { fetch_format: "auto" },
                        ]
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                stream.end(media.data); // Use buffer directly
            });
            
            console.log("Cloudinary upload successful:", uploadResponse.public_id);
            mediaUrl = uploadResponse.secure_url;
        }catch(err){
            console.error("Cloudinary upload error:", err.message);
            return resp.status(500).json({success:false,message:'Failed to upload media.Please try again later.'})
        }
    }
    const newMessage=await Message.create({
        senderId,
        reciverId,
        text:sanitizedText,
        media: mediaUrl
    });
    
    console.log("Message saved to DB:", newMessage._id);
    
    const receiverSocketId= getReceiverSocketId(reciverId);
    if(receiverSocketId){
        io.to(receiverSocketId).emit("newMessage",newMessage)
    }
    return resp.status(201).json(newMessage);
})




