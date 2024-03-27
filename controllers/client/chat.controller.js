const Chat = require("../../model/chat.model");
const User = require("../../model/users.model");

const chatSocket = require("../../sockets/client/chat.socket");


module.exports.index = async(req, res) => {
    const roomChatId = req.params.roomChatId;

    chatSocket(req, res);

    const chats = await Chat.find({
        room_chat_id: roomChatId,
        deleted: false
    })

    for(const chat of chats){
        const infoUser = await User.findOne({
            _id: chat.user_id
        }).select("fullName");

        chat.infoUser = infoUser;
    }

    res.render("client/pages/chat/index",{
        pageTitle: "Chat",
        chats: chats
    })
}

