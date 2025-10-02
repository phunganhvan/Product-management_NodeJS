const User= require("../../models/users.model");
module.exports = (req, res) => {
    //gửi 1 lần
    const userId= res.locals.user.id;
    const fullName= res.locals.user.fullName;
    _io.once('connection', (socket) => {
        // console.log('a user connected', socket.id);
        socket.on("CLIENT_ADD_FRIEND", async(friendId) =>{
            const myId= res.locals.user.id;
            
            console.log(friendId, myId);


            // thêm id của A vào acceptFriend của B
            const existAcpFriend = await User.findOne({
                _id: friendId,
                acceptFriends: myId,
            });
            if(!existAcpFriend){
                await User.updateOne(
                    {
                        _id: friendId
                    },
                    {
                        $push: { acceptFriends: myId}
                    }
                )
            }else{
                req.flash("error", "Bạn đã kết bạn người dùng này rồi!");
                res.redirect("/users/not-friend");
                return;
            }

            //thêm id của B vào requestFriend của A

            const existReqFriend = await User.findOne({
                _id: myId,
                requestFriends: friendId,
            });
            if(!existReqFriend){
                await User.updateOne(
                    {
                        _id: myId
                    },
                    {
                        $push: { requestFriends: friendId}
                    }
                )
            }
        });
    });
}