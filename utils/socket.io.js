import {Server} from 'socket.io'

const userSocketMap={};
const socketUserMap = {};
let io;

const fallbackOrigins = [
    'https://chat-application-fontend.vercel.app',
    'https://chat-application-frontend.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174',
];

const normalizeOrigin = (value) => (value || '').trim().replace(/\/$/, '');
const envOrigins = [process.env.FRONTEND_URLS, process.env.FRONTEND_URL]
    .filter(Boolean)
    .join(',')
    .split(',')
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean);

const socketAllowedOrigins = [...new Set([...fallbackOrigins.map((origin) => normalizeOrigin(origin)), ...envOrigins])];

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
        const userId = String(socket.handshake.query.userId || ''); // this are method to get user id from the socket 
        if(userId){
            if (!userSocketMap[userId]) {
                userSocketMap[userId] = new Set();
            }
            userSocketMap[userId].add(socket.id);
            socketUserMap[socket.id] = userId;
        }
        io.emit("getOnlineUsers",Object.keys(userSocketMap));// emit ka mtlab hai ki jitne connected user hai system ke sath .unsmko ek event trigar kro jika name hoga "
        // " unsmko data bhejna hai jo "Object.keys(userSocketMap)"
        socket.on("disconnect",()=>{//agr frontend pe user disconnect hota hai to ..
            const disconnectedUserId = socketUserMap[socket.id] || userId;
            if (disconnectedUserId && userSocketMap[disconnectedUserId]) {
                userSocketMap[disconnectedUserId].delete(socket.id);
                if (userSocketMap[disconnectedUserId].size === 0) {
                    delete userSocketMap[disconnectedUserId];
                }
            }
            delete socketUserMap[socket.id];
            io.emit('getOnlineUsers',Object.keys(userSocketMap));
        })
    })
}

export function getReceiverSocketId(userId){
    const sockets = userSocketMap[userId];
    if (!sockets || sockets.size === 0) return null;
    return [...sockets][0];
}
export{io}