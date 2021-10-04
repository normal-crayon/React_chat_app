const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
const http = require('http');

const PORT = process.env.PORT || 5000
const app = express()
const { addUser, removeUser, getUser, getUserInRoom} = require('./users');
const server = http.createServer(app);
corsOptions = {
    cors: true,
    origins: ["http://localhost:5000"],
}
const io = socketio(server, {cors: {origin: 'http://localhost:3000', credentials: true}});
const router = require('./router');
// const { use } = require('./router')

app.use(cors());
app.use(router)
io.on('connect', (socket)=>{
    socket.on('join', ({ name, room }, callback) => {
        const { error, user } = addUser({ id : socket.id, name, room });
        
        if(error) return callback(error);

        socket.emit('message', {user: 'admin', text: `${user.name}, welcome to ${user.room}`});
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name}, has joined the chat`});
        
        io.to(user.room).emit('roomData', {room: user.room , users: getUserInRoom(user.room)});
        socket.join(user.room);
        callback();

    })
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit('message', { user: user.name, text: message});

        callback()
    })


    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        
        if (user){
            io.to(user.room).emit('message', { user: 'admin', text:`${user.name} has left the chat.`});
            io.to(user.room).emit('roomData', {room: user.room, users: getUserInRoom(user.room)});
        }
    })
})
server.listen(PORT, ()=> console.log('server on!!'));