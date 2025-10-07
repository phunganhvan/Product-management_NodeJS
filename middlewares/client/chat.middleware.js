const RoomChat = require("../../models/rooms-chat.model");

module.exports.accessRoomChat= async(req, res, next) =>{
    const roomChatId= req.params.roomChatId;
    const userId= res.locals.user.id;

    const existUserInRoom= await RoomChat.findOne({
        _id: roomChatId,
        "users.user_id": userId,
        deleted: false
    })
    if(existUserInRoom){
        next();
    }else{
        res.redirect("/users/friends");
    }
}