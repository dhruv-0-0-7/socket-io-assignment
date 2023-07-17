const Filter = require('bad-words');
const { generateMessage, generateLocation } = require('../utils/messages');
const { addUser, removeUser, getUser, getUsersInRoom } = require('../utils/users');

module.exports = (io) => {
    return (socket) => {

        // Listener for 'join' event
        socket.on('join', (options, callback) => {
            const { error, user } = addUser({ id: socket.id, username: options.username, room: options.room });
            if (error) {
                return callback(error);
            }

            socket.join(user.room);

            // Emitting message back to Same socket
            socket.emit('message', generateMessage(`Welcome ${user.username}`));
            // Broadcasting message to every other socket than the current
            socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined.`));
            io.to(user.room).emit('roomStatus', { room: user.room, users: getUsersInRoom(user.room) });

            callback();
        });

        // Listener for 'sentMessage' event
        socket.on('sentMessage', (text, callback) => {
            const user = getUser(socket.id);
            if (user) {
                // Filtering bad words from message
                const filter = new Filter();

                if (filter.isProfane(text)) {
                    return callback('Not Allowed');
                }
                io.to(user.room).emit('message', generateMessage(text, user.username));
                callback();
            }
        });

        // Listener for 'sentLocation' event
        socket.on('sendLocation', (latitude, longitude, callback) => {
            const user = getUser(socket.id);
            if (user) {
                io.to(user.room).emit('shareLocation', generateLocation(latitude, longitude, user.username));

                callback();
            }
        });

        // Listener for 'disconnect' event
        socket.on('disconnect', () => {
            const user = removeUser(socket.id);
            if (user) {
                io.to(user.room).emit('message', generateMessage(`${user.username} has left the room.`));
                io.to(user.room).emit('roomStatus', { room: user.room, users: getUsersInRoom(user.room) });
            }
        });
    };
};