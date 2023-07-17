// Constructing a Message
const generateMessage = (text, username = 'System') => {
    return {
        text,
        createdAt: new Date().getTime(),
        username
    };
};

// Constructing Location Url
const generateLocation = (latitude, longitude, username) => {
    return {
        location: `https://google.com/maps?q=${latitude},${longitude}`,
        createdAt: new Date().getTime(),
        username
    };
};

module.exports = {
    generateMessage,
    generateLocation
};