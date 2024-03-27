const User = require('../../model/users.model');
const usersSocket = require("../../sockets/client/users.socket");

module.exports.notFriend = async(req, res) => {
    usersSocket(res);

    const userId = res.locals.user.id;
    const requestFriends = res.locals.user.requestFriends;
    const acceptFriends = res.locals.user.acceptFriends;
    const friendsListId = res.locals.user.friendsList.map(item => item.user_id);

    const users = await User.find({
        $and:[
            {_id: {$ne: userId} },
            {_id: {$nin: requestFriends} },
            {_id: {$nin: acceptFriends} },
            {_id: {$nin: friendsListId} },
        ],
        status: "active",
        deleted: false
    }).select("id fullName avatar");

    res.render("client/pages/users/not-friend",{
        pageTitle: "Danh sách người dùng",
        users: users
    })
}

module.exports.request = async(req, res) => {
    usersSocket(res);

    const requestFriends = res.locals.user.requestFriends;

    const users = await User.find({
        $and:[
            {_id: {$in: requestFriends}}
        ],
        status: "active",
        deleted: false
    }).select("id fullName avatar");

    res.render("client/pages/users/request", {
        pageTitle: "Lời mời đã gửi",
        users: users
    })
}

module.exports.accept = async(req, res) => {
    usersSocket(res);
    
    const acceptFriends = res.locals.user.acceptFriends;

    const users = await User.find({
        $and:[
            {_id: {$in: acceptFriends}}
        ],
        status: "active",
        deleted: false
    }).select("id fullName avatar");

    res.render("client/pages/users/accept", {
        pageTitle: "Lời mời kết bạn",
        users: users
    })
}

module.exports.friends = async(req, res) => {
    usersSocket(res);
    
    const friendsList = res.locals.user.friendsList
    const friendsListId = friendsList.map(item => item.user_id)

    const users = await User.find({
        $and:[
            {_id: {$in: friendsListId}}
        ],
        status: "active",
        deleted: false
    }).select("id fullName avatar");

    for(const user of users){
        const infoUser = friendsList.find(item => item.user_id == user.id);
        user.roomChatId = infoUser.room_chat_id;
    }

    res.render("client/pages/users/friends", {
        pageTitle: "Danh sách bạn bè",
        users: users
    })
}