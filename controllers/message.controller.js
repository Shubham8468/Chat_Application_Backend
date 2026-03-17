import { catchAsyncError } from "../middelware/catchAsyncError.middelware.js"
import { User } from '../model/user.model.js'
import { Message } from '../model/message.model.js'
import { v2 as cloudinary } from 'cloudinary'

export const getAllUsers = catchAsyncError(async (req, resp, next) => {
    const user = req.user;
    const filteredUser = await User.find({ _id: { $ne: user } }).select("-password")//abko find kro accepte _id: not include
    // ye sriph all user ko get knre ke liya hai accepte current user
    return resp.status(200).json({ success: false, message: "All Users fetch from DB.", filteredUser })

})
export const getMessages = catchAsyncError(async (req, resp, next) => {
    const reciverId = req.params.id;
    const myId = req.user._id;
    const reciver = await User.findById(reciverId);// reciver ki id le ke DB me check kruga 
    if (!reciver) {
        return resp.status(400).json({ success: false, message: "Reciver id invalid." })
    }

    //
    const messages = await Message.find({
        $or: [
            { senderId: myId, reciverId: reciverId },//jb me message send kruga to bhi message fetch kreke do 
            { senderId: reciverId, reciverId: myId }//jb koi aur message krega to bhi fetch krke do
        ],
    }).sort({ createdAt: 1 }) // ye message ko shor kr ke dega jo last me aaya vo phle hoga

    return resp.status(200).json({ success: true, message: "" })



});
export const sendMessage = catchAsyncError(async (req, resp, next) => {
    const { text } = req.body;
    const media = req?.files?.media;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    const reciver = await User.findById(receiverId);
    if (!reciver) {
        return resp.status(400).json({ success: false, message: "Receiver In Invalid." })
    }
    const sanitizedText = text?.trim() || "";
    if (!sanitizedText && !media) {
        return resp.status(400).json({ success: false, message: 'Cannot send empty message.' })
    }
  let mediaUrl = "";// isme hm cloudnary pe jo vid/img hai uska url store krege jo frontend me jaye ga

    if (media) {
        try {
            const uploadResponse = await cloudinary.uploader.upload();
            media.tempFilePath, {
                resource_type: "auto", // auto-detecy img/videos come from frontend
                folder: "CHAT_APP_MEDIA",
                transformation: [{ width: 1080, height: 1080 },
                { quality: "auto" },
                { fetch_formet: "auto" },
                ]
            }
            mediaUrl = uploadResponse.secure_url;// lo isme put kr diya img/vid ka url jo frondent ko jaye ga
        }catch(err){
            console.log("Cloudnary error:",err)
            return resp.status(500).json({success:false,message:'Failed to upload media.Please try again later.'})
        }
    }
    
})




