import express from 'express'
import cookieParser from 'cookie-parser'
import { config } from 'dotenv'
import cors from 'cors'
import fileUpload from 'express-fileupload';
import DbConnection from './database/db.js';
import router from './routes/user.route.js';
import messageRouter from './routes/message.route.js'
const app=express();
config({ path: './config/.env' })
app.use(cors({
    origin:[process.env.FRONTEND_URL],
    credentials:true,
    methods:['GET','PUT','POST','DELETE']
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(
    fileUpload(
        {
            useTempFiles:true,
            tempFileDir:'/temp/', // jo fule frontend se aa rhi hai vo temp folder me store hoga
        }
    )
);
app.use('/api/v1/user',router)// this is the static url
app.use('/api/v1/message',messageRouter);
DbConnection();

export default app;