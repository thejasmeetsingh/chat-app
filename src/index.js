const path = require('path');
const http = require('http');

const express = require('express');
const socketio = require('socket.io');
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const app = express();
const server = http.createServer(app);
const io = socketio(server)


const port = process.env.PORT


// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')


app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
    console.log('New connection!')

    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMessage("Admin", "Welcome!"))
        socket.broadcast.to(user.room).emit("message", generateMessage("Admin", `${user.username} has joined!`))
        
        // Send list of all users in the room when any user join the room
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
    })

    socket.on("sendMessage", (message, callback) => {
        const user = getUser(socket.id)

        if (user) {
            socket.broadcast.to(user.room).emit("message", generateMessage(user.username, message))
        }
        callback();
    })

    socket.on("sendLocation", (coords, callback) => {
        const user = getUser(socket.id)

        if (user) {
            const location = `https://www.google.com/maps/?q=${coords.lat},${coords.lng}`
            socket.broadcast.to(user.room).emit("locationMessage", generateLocationMessage(user.username, location))
        }
        callback();
    })

    socket.on("disconnect", () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit("message", generateMessage("Admin", `${user.username} has left!`))
            
            // Send list of all users in the room when a user leaves the room
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})


// Running Server on specific port
server.listen(port, () => {
    console.log(`Server is up at port ${port}`) 
});