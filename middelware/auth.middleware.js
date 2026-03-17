import jwt from 'jsonwebtoken'
import {User} from '../model/user.model.js'
import {catchAsyncError} from '../middelware/catchAsyncError.middelware.js'
export const isAuthenticated= catchAsyncError(async (req,resp,next)=>{
    const {token}=req.cookies;// distructure krna hai 
    if(!token){
        return resp.status(401).json({message:"User not authenticated. Please sing in.",success:false})
    }
    const decode =jwt.verify(token,process.env.JWT_SECRET_KEY);//ye hm jo lign ke time pe token create hua tha uske sicret
    //key ko verify kra rhe hai apne secret key se 
    if(!decode){
       return resp.status(401).json({success:false,message:"Token verification failed. Please sing in again."})
    }
    const user =await User.findById(decode.id);// ye jb hai token bna rhe the vo use ki id as a payload dale the isme
    req.user=user;//hm req me user ke ditails bhi dal dege
    next();
})