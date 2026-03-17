export const catchAsyncError= (func)=>{
    return (req,resp,next)=>{
        Promise.resolve(func(req,resp,next));
    }
}
// this are for  use catch error , no need to use try catch in fuction 