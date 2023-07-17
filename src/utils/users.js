const users = [];

// Add User to Room
const addUser = ({ id, username, room }) => {
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    if (!username || !room) {
        return {
            error: 'Username and Room are required!'
        };
    }

    const existingUser = users.find((user) => {
        return user.room === room && user.username === username;
    });

    if (existingUser) {
        return {
            error: 'Username already taken...'
        };
    }

    const user = {
        id, username, room
    };

    users.push(user);
    return { user };
};

// Removing User from Room
const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id;
    });

    if (index != -1) {
        return users.splice(index, 1)[0];
    }
};

// Fetching User
const getUser = (id) => {
    return users.find((user) => {
        return user.id === id;
    });
};

// Fetching all users in Room
const getUsersInRoom = (room) => {
    return users.filter((user) => {
        return user.room === room;
    });
};

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
};