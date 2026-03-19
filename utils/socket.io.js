import {Server} from 'socket.io'

const userSocketMap={};
let io;
export function initSocket(server){
    io=new Server(server,{
        cors:{
            origin:[process.env.FRONTEND_URL],
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