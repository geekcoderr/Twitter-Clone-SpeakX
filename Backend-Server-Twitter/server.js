const app = require('./app');
const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 5000;

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

app.set('io', io); // Make io accessible in the app

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
