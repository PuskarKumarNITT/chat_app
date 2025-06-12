const express = require("express");
const { Server } = require('socket.io');
const http = require('http');
const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken');
const UserModel = require("../models/UserModel");
const { MessageModel, ConversationModel } = require("../models/ConversationModel")


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
    // console.log("connected user", socket.id);

    const token = socket.handshake.auth.token;
    // current user detail
    const user = await getUserDetailsFromToken(token);

    // create a room
    socket.join(user?._id.toString());
    onlineUser.add(user?._id.toString());

    io.emit('onlineUser', Array.from(onlineUser));


    socket.on('message-page', async (userId) => {
        // console.log("user id:", userId);
        const userDetails = await UserModel.findById(userId).select("-password");

        const payload = {
            name: userDetails?.name,
            _id: userDetails?._id,
            email: userDetails?.email,
            online: onlineUser?.has(userId.toString()),
            profile_pic: userDetails?.profile_pic
        }

        socket.emit('message-user', payload);
    })

    // new message

    socket.on('new Message', async (data) => {

        // check conversation is available for both user

        let conversation = await ConversationModel.findOne({
            "$or": [
                {
                    sender: data?.sender,
                    receiver: data?.receiver
                },
                {
                    sender: data?.receiver,
                    receiver: data?.sender
                }
            ]
        })

        // if conversation is not available
        if (!conversation) {
            const createConversation = await ConversationModel({
                sender: data?.sender,
                receiver: data?.receiver
            })
            conversation = await createConversation.save();
        }

        const message = new MessageModel({
            text: data?.text,
            imageUrl: data?.imageUrl,
            videoUrl: data?.videoUrl,
            msgByUserId: data?.msgByUserId
        })

        const saveMessage = await message.save();

        const updateConversation = await ConversationModel.updateOne({_id:conversation?._id},{
            "$push":{
                messages: saveMessage?._id
            }
        })
        const getConversationMessage = await ConversationModel.findOne({
            "$or": [
                {
                    sender: data?.sender,
                    receiver: data?.receiver
                },
                {
                    sender: data?.receiver,
                    receiver: data?.sender
                }
            ]
        }).populate('messages').sort({updatedAt:-1});

        io.to(data?.sender).emit('message',getConversationMessage.messages);
        io.to(data?.receiver).emit('message',getConversationMessage.messages);

        console.log("get Conversation message",getConversationMessage.messages);
    })
    // disconnect
    socket.on('disconnect', () => {
        onlineUser.delete(user?._id);
        // console.log('disconnected user', socket.id)
    })
})

module.exports = {
    app, server
}