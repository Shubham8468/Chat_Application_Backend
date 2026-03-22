import {Server} from 'socket.io'

const userSocketMap={};
let io;

const fallbackOrigins = [
    'https://chat-application-fontend.vercel.app',
    'https://chat-application-frontend.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174',
];

const normalizeOrigin = (value) => (value || '').trim().replace(/\/$/, '');
const socketAllowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || fallbackOrigins.join(','))
    .split(',')
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean);

export function initSocket(server){
    io=new Server(server,{
        cors:{
            origin: (origin, callback) => {
                if (!origin) return callback(null, true);
                const requestOrigin = normalizeOrigin(origin);
                if (socketAllowedOrigins.includes(requestOrigin)) return callback(null, true);
                return callback(new Error('Socket origin not allowed'));
            },
            credentials: true,
        }
    });
    io.on("connection",(socket)=>{// this is listen the event that are arise from the frontend.. its name is "connection"
        console.log("A User connected to the server",socket.id)
        const userId=socket.handshake.query.userId // this are method to get user id from the socket 
        if(userId){
            userSocketMap[userId]=socket.id;// ime userSocketMap me "userId" name is key bnao jiski value socket.id kro
        }
        io.emit("getOnlineUsers",Object.keys(userSocketMap));// emit ka mtlab hai ki jitne connected user hai system ke sath .unsmko ek event trigar kro jika name hoga "
        // " unsmko data bhejna hai jo "Object.keys(userSocketMap)"
        socket.on("disconnect",()=>{//agr frontend pe user disconnect hota hai to ..
            console.log("A user disconnected",socket.io);
            delete userSocketMap[userId];// user ko delete kro 
            io.emit('getOnlineUsers',Object.keys(userSocketMap));
        })
    })
}

export function getReceiverSocketId(userId){
    return userSocketMap[userId];
}
export{io}