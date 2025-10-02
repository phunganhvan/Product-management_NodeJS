const Chat = require("../../models/chat.model")
module.exports = (res) => {
    //gửi 1 lần
    const userId= res.locals.user.id;
    const fullName= res.locals.user.fullName;
    _io.once('connection', (socket) => {
        // console.log('a user connected', socket.id);
        socket.on("CLIENT_SEND_MESSAGE", async(content) =>{
            // lưu vào DB
            const chat = new Chat({
                user_id: userId,
                content: content
            });
            await chat.save();

            
            //lưu xong sẽ trả về data client
            _io.emit("SERVER_RETURN_MESSAGE", {
                fullName: fullName,
                userId: userId,
                content: content
            })
        });
        //typing
        socket.on("CLIENT_SEND_TYPING", async(type) =>{
            // console.log(type);
            socket.broadcast.emit("SERVER_RETURN_TYPING", {
                fullName: fullName,
                userId: userId,
                type: type
            })
        })

        //end typing
    });
}