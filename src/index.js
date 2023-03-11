const path = require('path');
const http = require('http');

const express = require('express');
const hbs = require('hbs');
const socketio = require('socket.io');

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


io.on('connection', () => {
    console.log('New connection!')
})


// Running Server on specific port
server.listen(port, () => {
    console.log(`Server is up at port ${port}`) 
});