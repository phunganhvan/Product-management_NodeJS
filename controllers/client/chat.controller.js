const Chat = require("../../models/chat.model")
const User= require("../../models/users.model");

const chatSocket= require("../../sockets/client/chat.socket")
module.exports.index = async (req, res) => {

    chatSocket(res);
    // Lấy data từ db ra

    const chats= await Chat.find({
        deleted: false
    })

    for( const chat of chats) {
        const infoUser= await User.findOne({
            _id: chat.user_id
        }).select("fullName avatar");
        chat.infoUser= infoUser;
    }
    // hết lấy từ db
    res.render("client/pages/chat/index", {
        titlePage: "Chat",
        chats: chats
    })
} 