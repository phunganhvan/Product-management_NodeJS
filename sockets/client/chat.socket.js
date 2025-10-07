const Chat = require("../../models/chat.model")
module.exports = (req, res) => {
    //gửi 1 lần
    const userId= res.locals.user.id;
    const fullName= res.locals.user.fullName;
    const roomChatId= req.params.roomChatId
    _io.once('connection', (socket) => {
        socket.join(roomChatId);
        // console.log('a user connected', socket.id);
        socket.on("CLIENT_SEND_MESSAGE", async(content) =>{
            // lưu vào DB
            const chat = new Chat({
                user_id: userId,
                content: content,
                room_chat_id: roomChatId
            });
            await chat.save();

            
            //lưu xong sẽ trả về data client
            _io.to(roomChatId).emit("SERVER_RETURN_MESSAGE", {
                fullName: fullName,
                userId: userId,
                content: content
            })
            // return đúng người
        });
        //typing
        socket.on("CLIENT_SEND_TYPING", async(type) =>{
            // console.log(type);
            socket.broadcast.to(roomChatId).emit("SERVER_RETURN_TYPING", {
                fullName: fullName,
                userId: userId,
                type: type
            })
        })

        //end typing
    });
}