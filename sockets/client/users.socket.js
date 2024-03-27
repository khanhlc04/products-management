const User = require("../../model/users.model");
const RoomChat = require("../../model/rooms-chat.model");

module.exports = (res) => {
    _io.once("connection", (socket) => {
        socket.on("CLIENT_ADD_FRIEND", async(userIdB) => {
            const userIdA = res.locals.user.id;
    
            const existUserAinB = await User.findOne({
                _id: userIdB,
                acceptFriends: userIdA
            })
    
            if(!existUserAinB){
                await User.updateOne({
                    _id: userIdB,
                }, {
                    $push:{acceptFriends: userIdA}
                })
            }
    
            const existUserBInA = await User.findOne({
                    _id: userIdA,
                    requestFriends: userIdB
                });
        
            if(!existUserBInA) {
                await User.updateOne({
                    _id: userIdA
                }, {
                    $push: { requestFriends: userIdB }
                });
            }
            const infoUserB = await User.findOne({
                _id: userIdB
            }).select("acceptFriends");

            const lengthAcceptFriends = infoUserB.acceptFriends.length;

            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
                userId: infoUserB.id,
                lengthAcceptFriends: lengthAcceptFriends
            })

            const infoUserA = await User.findOne({
                _id: userIdA
            }).select("id fullName avatar");
        
            socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIEND", {
                userIdB: userIdB,
                infoUserA: infoUserA
            });
        });

        socket.on("CLIENT_CANCEL_FRIEND", async(userIdB) => {
            const userIdA = res.locals.user.id;
    
            await User.updateOne({
                _id: userIdB,
            }, {
                $pull:{acceptFriends: userIdA}
            })
    
            await User.updateOne({
                _id: userIdA
            }, {
                $pull: { requestFriends: userIdB }
            });

            const infoUserB = await User.findOne({
                _id: userIdB
            }).select("acceptFriends");

            const lengthAcceptFriends = infoUserB.acceptFriends.length;

            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
                userId: infoUserB.id,
                lengthAcceptFriends: lengthAcceptFriends
            })

            socket.broadcast.emit("SERVER_RETURN_ID_CANCEL_FRIEND", {
                userIdB: userIdB,
                userIdA: userIdA
            });
        });

        socket.on("CLIENT_REFUSE_FRIEND", async(userIdA) => {
            const userIdB = res.locals.user.id;
    
            await User.updateOne({
                _id: userIdB,
            }, {
                $pull:{acceptFriends: userIdA}
            })
    
            await User.updateOne({
                _id: userIdA
            }, {
                $pull: { requestFriends: userIdB }
            });

            socket.broadcast.emit("SERVER_RETURN_ID_REFUSE_FRIEND", {
                userIdB: userIdB,
                userIdA: userIdA
            })
        });

        socket.on("CLIENT_ACCEPT_FRIEND", async(userIdA) => {
            const userIdB = res.locals.user.id;

            const roomChat = new RoomChat ({
                typeRoom: "friend",
                users: [
                    {
                        user_id: userIdA,
                        role: "superAdmin"
                    },
                    {
                        user_id: userIdB,
                        role: "superAdmin"
                    }
                ]
            })

            roomChat.save();

    
            await User.updateOne({
                _id: userIdB,
            }, {
                $push: {
                    friendsList: {
                        user_id: userIdA,
                        room_chat_id: roomChat.id
                    }
                }, 
                $pull:{acceptFriends: userIdA}
            })
    
            await User.updateOne({
                _id: userIdA
            }, {
                $push: {
                    friendsList: {
                        user_id: userIdB,
                        room_chat_id: roomChat.id
                    }
                }, 
                $pull: { requestFriends: userIdB }
            });

            socket.broadcast.emit("SERVER_RETURN_ID_ACCEPT_FRIEND", {
                userIdB: userIdB,
                userIdA: userIdA
            })
        });
    });
}