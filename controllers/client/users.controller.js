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
    const friendList= [];
    for(const item of myUser.friendList ){
        friendList.push(item.user_id);
    }

    // trick lord
    const users = await User.find({
        $and: [
            { _id: { $ne: userId } },
            { _id: { $nin: requestFriends } },
            { _id: { $nin: acceptFriends } },
            { _id: { $nin: friendList } },
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

module.exports.accept =  async (req, res) =>{
    const myId = res.locals.user.id
    usersSocket(res);
    //socket
    const myUser = await User.findOne({
        _id: myId,
    })
    const acceptFriends = myUser.acceptFriends;

    const userAccept = await User.find(
        {
            _id: { $in: acceptFriends },
            status: "active",
            deleted: false
        }
    ).select("id avatar fullName");
    res.render("client/pages/users/accept", {
        titlePage: "Yêu cầu kết bạn",
        users: userAccept
    })
}
module.exports.friends =async(req, res) =>{
    usersSocket(res);
    // socket


    const myId= res.locals.user.id
    const myUser= await User.findOne({
        _id: myId,
    })
    // cách tự làm
    const friendList= [];
    for(const item of myUser.friendList ){
        friendList.push(item.user_id);
    }

    //cách khác
    // const friendList= myUser.friendList
    // const friendListId= friendList.map(item => item.user_id)
    const user= await User.find({
        _id: {$in: friendList},
        status: "active",
        deleted: false
    }).select("avatar id fullName statusOnline");
    
    res.render("client/pages/users/friend", {
        titlePage: "Danh sách bạn bè",
        users: user
    })
}