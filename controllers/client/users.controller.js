const User= require("../../models/users.model");
const usersSocket= require("../../sockets/client/users.socket")
module.exports.notFriend = async(req, res) =>{
    //Socket
    usersSocket(req, res);

    //end_socket


    const userId= res.locals.user.id
    const myUser= await User.findOne({
        _id: userId
    });
    const requestFriends= myUser.requestFriends
    const acceptFriends= myUser.acceptFriends;

    // trick lord
    const users= await User.find({
        $and: [
            {_id: { $ne: userId}},
            {_id: { $nin: requestFriends}},
            {_id: { $nin: acceptFriends}},
        ],
        status: "active",
        deleted: false
    }).select("fullName avatar id");
    res.render("client/pages/users/not-friend", {
        titlePage: "Danh sách người dùng",
        users: users

    })
}