const User= require("../../models/users.model");
module.exports = (res) => {
    //gửi 1 lần
    const userId= res.locals.user.id;
    const fullName= res.locals.user.fullName;
    _io.once('connection', (socket) => {
        // console.log('a user connected', socket.id);

        // chức năng gửi yêu cầu
        socket.on("CLIENT_ADD_FRIEND", async(friendId) =>{
            const myId= res.locals.user.id;


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
                );
            }
        });

        // chức năng xóa yêu cầu
        socket.on("CLIENT_CANCEL_ADD", async(friendId) =>{
            const myId= res.locals.user.id;
            
            // xóa id của A trong acceptFriend của B
            const existAcpFriend = await User.findOne({
                _id: friendId,
                acceptFriends: myId,
            });
            if(existAcpFriend){
                await User.updateOne(
                    {
                        _id: friendId
                    },
                    {
                        $pull: { acceptFriends: myId}
                    }
                )
            }

            //xóa id của B trong requestFriend của A

            const existReqFriend = await User.findOne({
                _id: myId,
                requestFriends: friendId,
            });
            if(existReqFriend){
                await User.updateOne(
                    {
                        _id: myId
                    },
                    {
                        $pull: { requestFriends: friendId}
                    }
                )
            }
        });
    });
}