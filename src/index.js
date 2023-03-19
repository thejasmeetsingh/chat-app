const path = require('path');
const http = require('http');

const express = require('express');
const hbs = require('hbs');
const socketio = require('socket.io');
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const app = express();
const server = http.createServer(app);
const io = socketio(server)


const port = process.env.PORT

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
// const viewsPath = path.join(__dirname, '../templates/views');
// const partialsPath = path.join(__dirname, '../templates/partials')


// // Setup handlebars engine and views location
// app.set('view engine', 'hbs');
// app.set('views', viewsPath);
// hbs.registerPartials(partialsPath);


// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
    console.log('New connection!')

    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMessage("Welcome!"))
        socket.broadcast.to(user.room).emit("message", generateMessage(`${user.username} has joined!`))
    })

    socket.on("sendMessage", (message, callback) => {
        socket.broadcast.emit("message", generateMessage(message))
        callback();
    })

    socket.on("sendLocation", (coords, callback) => {
        const location = `https://www.google.com/maps/?q=${coords.lat},${coords.lng}`
        socket.broadcast.emit("locationMessage", generateLocationMessage(location))
        callback();
    })

    socket.on("disconnect", () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit("message", generateMessage(`${user.username} has left!`))
        }
    })
})


// Running Server on specific port
server.listen(port, () => {
    console.log(`Server is up at port ${port}`) 
});