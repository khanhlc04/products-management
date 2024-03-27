const Chat = require("../../model/chat.model");
const uploadCloudinaryHelper = require("../../helpers/uploadCloudinary.helper")

module.exports =(req, res) => {
    const roomChatId = req.params.roomChatId;

    const userId = res.locals.user.id;
    const fullName = res.locals.user.fullName;

    _io.once("connection", (socket) => {
        socket.join(roomChatId);

        socket.on("CLIENT_SEND_MESSAGE", async(data) => {
            const images = [];

            for (const image of data.images){
                console.log(image);
                const url = await uploadCloudinaryHelper(image);
                images.push(url);
            }

            const chat = new Chat({
                user_id: userId,
                room_chat_id: roomChatId,
                content: data.content,
                images: images
            })

            await chat.save();

            _io.to(roomChatId).emit("SERVER_SEND_MESSAGE", {
                userId: userId,
                fullName: fullName,
                content: data.content,
                images: images
            });
        });

        socket.on("CLIENT_SEND_TYPING", (type) => {
            socket.broadcast.to(roomChatId).emit("SERVER_RETURN_TYPING", {
                userId: userId,
                fullName: fullName,
                type: type
            });
        })
    });
}