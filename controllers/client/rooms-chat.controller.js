const User = require("../../model/users.model");
const RoomChat = require("../../model/rooms-chat.model")

module.exports.index = async (req, res) => {
    const userId = res.locals.user.id;

    const listRoomChat = await RoomChat.find({
      "users.user_id": userId,
      typeRoom: "group",
      deleted: false
    });

    res.render("client/pages/rooms-chat/index", {
      pageTitle: "Danh sách phòng",
      listRoomChat: listRoomChat
    });
};

module.exports.create = async (req, res) => {
    const friendsList = res.locals.user.friendsList;

    for (const friend of friendsList) {
      const infoFriend = await User.findOne({
        _id: friend.user_id
      }).select("fullName avatar");

      friend.infoFriend = infoFriend;
    }

    res.render("client/pages/rooms-chat/create", {
      pageTitle: "Tạo phòng",
      friendsList: friendsList
    });
};

module.exports.createPost = async(req, res) => {
    const title = req.body.title;
    const usersId = req.body.usersId;

    const dataRoom = {
        title: title,
        typeRoom: "group",
        users: []
    }

    dataRoom.users.push({
        user_id: res.locals.user.id,
        role: "superAdmin"
    })

    usersId.forEach(userId => {
        dataRoom.users.push({
            user_id: userId,
            role: "user"
        })
    })

    console.log(dataRoom);

    const roomChat = new RoomChat(dataRoom);
    roomChat.save();

    req.flash("success", "Tạo phòng thành công!");

    res.redirect(`/chat/${roomChat.id}`);
}