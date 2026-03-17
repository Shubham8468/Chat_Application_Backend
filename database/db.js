import mongoose from "mongoose";
export const DbConnection= async ()=>{
    try{
        const mongoUrl = process.env.MONGO_URL;
        if (!mongoUrl) {
            throw new Error("MONGO_URL is missing in config.env");
        }
        await mongoose.connect(`${mongoUrl}/Chat-Application`).then(()=>{
            console.log(`Db connected successfully!!!`)
        })
    }
    catch(err){
        console.log(`DB not connected!!! :${err.message || err}`);
    }
}
export default DbConnection;