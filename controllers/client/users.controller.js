const User = require("../../models/users.model");
const usersSocket = require("../../sockets/client/users.socket")
module.exports.notFriend = async (req, res) => {
    //Socket
    usersSocket(res);
    
    //end_socket


    const userId = res.locals.user.id
    const myUser = await User.findOne({
        _id: userId
    });
    const requestFriends = myUser.requestFriends
    const acceptFriends = myUser.acceptFriends;

    // trick lord
    const users = await User.find({
        $and: [
            { _id: { $ne: userId } },
            { _id: { $nin: requestFriends } },
            { _id: { $nin: acceptFriends } },
        ],
        status: "active",
        deleted: false
    }).select("fullName avatar id");
    res.render("client/pages/users/not-friend", {
        titlePage: "Danh sách người dùng",
        users: users

    })
}

module.exports.requestFriends = async (req, res) => {
    const myId = res.locals.user.id
    usersSocket(res);
    //socket
    const myUser = await User.findOne({
        _id: myId,
    })
    const requestFriends = myUser.requestFriends;

    const userRequest = await User.find(
        {
            _id: { $in: requestFriends },
            status: "active",
            deleted: false
        }
    ).select("id avatar fullName")
    res.render("client/pages/users/request", {
        titlePage: "Lời mời đã gửi",
        users: userRequest
    })
}