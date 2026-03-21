import jwt from 'jsonwebtoken'
export const generateJWTToken= async (user,message,statusCode,resp)=>{
    const token=jwt.sign({id:user._id},process.env.JWT_SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRE
    })
    return resp.status(statusCode).cookie('token',token,{
        httpOnly:true,
        maxAge:process.env.COOKIE_EXPIRE *24 *60*60*1000,
        sameSite:'strict',// for privent crose site attack 
        secure:process.env.NODE_ENV !=='development' ? true:false //ager project development me nhi hai to true kr do mtlab http not allowed 
        //hai to false mtlb http allowed!!!
    }).json({
        success:true,
        message,
        token,
    })
};