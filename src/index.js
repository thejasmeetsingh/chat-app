const path = require('path');
const http = require('http');

const express = require('express');
const hbs = require('hbs');
const socketio = require('socket.io');
const { generateMessage } = require('./utils/messages')

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

    socket.emit('message', generateMessage("Welcome!"))
    socket.broadcast.emit("message", generateMessage("A new user has joined"))

    socket.on("sendMessage", (message) => {
        socket.broadcast.emit("message", generateMessage(message))
    })

    socket.on("sendLocation", (coords, callback) => {
        const location = `https://www.google.com/maps/?q=${coords.lat},${coords.lng}`
        socket.broadcast.emit("locationMessage", generateMessage(location))
        callback();
    })

    socket.on("disconnect", () => {
        io.emit("message", generateMessage("A user has left!"))
    })
})


// Running Server on specific port
server.listen(port, () => {
    console.log(`Server is up at port ${port}`) 
});