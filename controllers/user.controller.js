import {catchAsyncError} from '../middelware/catchAsyncError.middelware.js'
import {User} from '../model/user.model.js'
import bcrypt from 'bcryptjs'
import { generateJWTToken } from '../utils/jwt.js';
export const signup=catchAsyncError(async (req,resp,next)=>{
    const {fullName,email,password}=req.body;
    if(!fullName || !email || !password){
        return resp.status(400).json({success:false,message:'Please provide complete details!!!'})
    }
    const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/   //Email should have no spaces, exactly one @, and valid text before and after dot.
    if(!emailRegex.test(email)){
        return resp.status(400).json({success:false,message:"Invalid email format!!!!"})
    }
    if(password.length <8){
     return resp.status(400).json({success:false,message:"password must be at least 8 characters long."})
    }
    const isEmailAlreadyUserd= await User.findOne({email});
    if(isEmailAlreadyUserd){
        return resp.status(400).json({success:false,message:"Email is  already resistered!!."})
    }
    // For the password security we use hash 
    const hashPassword= await bcrypt.hash(password,10);
    //Now we store in User in MongoDB
    const user = await User.create({
        fullName,
        email,
        password:hashPassword,
        avatar:{
            public_id:"",
            url:"",
        }
    })
    //and create token and cookies
    generateJWTToken(user,"User registed Successfully",201,resp);
})
export const signin=catchAsyncError(async (req,resp,next)=>{
    const {email,password}=req.body;
    if(!email,!password){
        return resp.status(400).json({message:"Please provide email and Password!!"})
    }
    //Now i check email formet
    const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if(!emailRegex.test(email)){
        return resp.status(400).json({message:"Invalid email format.",success:false})
    }
    const user= await User.findOne({email});
    if(!user){
        return resp.status(400).json({success:false,message:"Invalid credentials."})
    }
    
    
    //Now i match user pass with Db pass
    const isPasswordMatched=await bcrypt.compare(password,user.password);
    if(!isPasswordMatched){
        return resp.json({success:false,message:"Pleas Enter correct password."})
    }
    //Now again i generate token 
    generateJWTToken(user,"Login succussfully.",200,resp);

})
export const signout=catchAsyncError(async (req,resp,next)=>
    {
        return resp.status(200).cookie('token',token,{
        httpOnly:true,
        maxAge:process.env.COOKIE_EXPIRE *24 *60*60*1000,
        sameSite:'strict',// for privent crose site attack 
        secure:process.env.NODE_ENV !=='devlopment' ? true:false //ager project devlopment me nhi hai to true kr do mtlab http not allowed 
        //hai to false mtlb http allowed!!!
    }).json({
        success:true,
        message,
        token,
    })
    }
)
export const getUser=catchAsyncError(async (req,resp,next)=>{})
export const updateProfile=catchAsyncError(async (req,resp,next)=>{})