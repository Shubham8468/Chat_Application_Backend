import app from "./app.js";
import {v2 as cloudinary} from 'cloudinary'
import http from 'http' // this is use to create socket server 
import { initSocket } from "./utils/socket.io.js";
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,

})

const server=http.createServer(app)  // create http server with the help of app .. these is the express server 
initSocket(server)




server.listen(process.env.PORT,()=>{
    console.log(`Server is running on PORT ${process.env.PORT} in ${process.env.NODE_ENV}`)
})