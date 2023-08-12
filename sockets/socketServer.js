const db = require('../models');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('socket connection');

        socket.on('login', (userName) => {
            console.log('socket login: ' + userName);
        });

        socket.on('disconnect', () => {
            console.log('socket disconnect');
        });
    });
}