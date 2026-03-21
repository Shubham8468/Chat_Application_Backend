import jwt from 'jsonwebtoken'
export const generateJWTToken= async (user,message,statusCode,resp)=>{
    const isProduction = process.env.NODE_ENV === 'production';
    const token=jwt.sign({id:user._id},process.env.JWT_SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRE
    })
    return resp.status(statusCode).cookie('token',token,{
        httpOnly:true,
        maxAge:process.env.COOKIE_EXPIRE *24 *60*60*1000,
        sameSite: isProduction ? 'none' : 'strict',
        secure: isProduction
        //hai to false mtlb http allowed!!!
    }).json({
        success:true,
        message,
        token,
    })
};