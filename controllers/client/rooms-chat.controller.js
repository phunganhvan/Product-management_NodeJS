const User= require("../../models/users.model");
const RoomChat= require("../../models/rooms-chat.model")
module.exports.index= async(req, res) =>{
    res.render("client/pages/rooms-chat/index", {
        titlePage: "Danh sách cuộc trò chuyện"
    })
}

module.exports.create= async(req, res) =>{
    const friendList = res.locals.user.friendList;
    for(const friend of friendList){
        const infoFriend= await User.findOne({
            _id: friend.user_id,
            deleted: false
        }).select("fullName avatar");
        friend.info= infoFriend
    }
    const userFriend = await User.find()
    res.render("client/pages/rooms-chat/create", {
        titlePage: "Tạo cuộc trò chuyện mới",
        friendList: friendList
    })
}

module.exports.createPost = async(req, res) =>{
    const title= req.body.title;
    const usersId= req.body.usersId;
    const dataRoom = {
        title: title,
        avatar: "",
        typeRoom: "group",
        users: [],

    }
    for( const info of usersId){
        const data= {
            user_id: info,
            role: "user"
        }
        dataRoom.users.push(data);
    }
    dataRoom.users.push(
        {
            user_id: res.locals.user.id,
            role: "superAdmin"
        }
    )
    console.log(dataRoom);

    const roomChat= new RoomChat(dataRoom);
    await roomChat.save();
    req.flash("success", "Tạo cuộc trò chuyện mới thành công");
    res.redirect(`/chat/${roomChat.id}`);
}