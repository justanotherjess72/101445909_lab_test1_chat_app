const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const GroupMessage = require('./models/GroupMessage');
const PrivateMessage = require('./models/PrivateMessage');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

connectDB();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

const users = {};
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinRoom', ({ username, room }) => {
        socket.join(room);
        users[socket.id] = { username, room };
        io.to(room).emit('message', { user: "admin", text: `${username} joined ${room}` });
    });

    socket.on('sendMessage', async ({ message, to }) => {
        const user = users[socket.id];
        if (to) {
            const newMessage = new PrivateMessage({ from_user: user.username, to_user: to, message });
            await newMessage.save();
            io.to(to).emit('message', { user: user.username, text: message });
        } else {
            const newMessage = new GroupMessage({ from_user: user.username, room: user.room, message });
            await newMessage.save();
            io.to(user.room).emit('message', { user: user.username, text: message });
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(3000, () => console.log('Server running on port 3000'));