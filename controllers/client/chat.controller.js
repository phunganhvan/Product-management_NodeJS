const Chat = require("../../models/chat.model")
const User= require("../../models/users.model");
module.exports.index = async (req, res) => {
    const userId= res.locals.user.id;
    //gửi 1 lần
    _io.once('connection', (socket) => {
        // console.log('a user connected', socket.id);
        socket.on("CLIEN_SEND_MESSAGE", async(content) =>{
            // lưu vào DB
            const chat = new Chat({
                user_id: userId,
                content: content
            });
            await chat.save()

            console.log(content)
        });
    });

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
    res.render("client/pages/chat/index", {
        titlePage: "Chat",
        chats: chats
    })
} 