const express = require('express');
const path = require('path');
const { createServer } = require('http');
const socketio = require('socket.io');
const socketController = require('./controller/socket.controller');

const app = express();
const server = createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, '../public');

app.use(express.json());
app.use(express.static(PUBLIC_DIR));

io.on('connection', socketController(io));

server.listen(port, () => {
    console.log(`Server is up and running on PORT: ${port}`);
});