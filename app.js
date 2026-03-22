import express from 'express'
import cookieParser from 'cookie-parser'
import { config } from 'dotenv'
import cors from 'cors'
import fileUpload from 'express-fileupload';
import path from 'path';
import DbConnection from './database/db.js';
import router from './routes/user.route.js';
import messageRouter from './routes/message.route.js'
const app=express();
config({ path: './config/.env' })

const fallbackOrigins = [
    'https://chat-application-fontend.vercel.app',// here you pase frontend url 
    'http://localhost:5173',
    'http://localhost:5174'
];

const allowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || fallbackOrigins.join(','))
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin:(origin, callback)=>{
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error('Not allowed by CORS'));
    },
    credentials:true,
    methods:['GET','PUT','POST','PATCH','DELETE','OPTIONS'],
    allowedHeaders:['Content-Type','Authorization']
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(
    fileUpload(
        {
            useTempFiles:true,
            tempFileDir:path.join(process.cwd(), 'temp'), // store uploads in project temp folder
            createParentPath:true,
        }
    )
);
app.use('/api/v1/user',router)// this is the static url
app.use('/api/v1/message',messageRouter);
DbConnection();

export default app;