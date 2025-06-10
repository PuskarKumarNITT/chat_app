const express = require("express");
const { Server } = require('socket.io');
const http = require('http');
const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken');
const UserModel = require("../models/UserModel");



const app = express();

// socket connections

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL, // e.g., 'http://localhost:5173'
        credentials: true
    }
});


// online user
const onlineUser = new Set();

io.on('connection', async (socket) => {
    console.log("connected user", socket.id);

    const token = socket.handshake.auth.token;
    // current user detail
    const user = await getUserDetailsFromToken(token);

    // create a room
    socket.join(user?._id);
    onlineUser.add(user?._id);

    io.emit('onlineUser', Array.from(onlineUser));


    socket.on('message-page', async (userId) => {
        console.log("user id:", userId);
        const userDetails = await UserModel.findById(userId).select("-password");

        const payload = {
            name: userDetails?.name,
            _id: userDetails?._id,
            email: userDetails?.email,
            online: onlineUser?.has(userId)
        }

        socket.emit('message-user', payload);
    })
    // disconnect
    socket.on('disconnect', () => {
        onlineUser.delete(user?._id);
        console.log('disconnected user', socket.id)
    })
})

module.exports = {
    app, server
}