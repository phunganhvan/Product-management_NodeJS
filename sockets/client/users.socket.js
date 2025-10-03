const User = require("../../models/users.model");
module.exports = (res) => {
    //gửi 1 lần
    const userId = res.locals.user.id;
    const fullName = res.locals.user.fullName;
    _io.once('connection', (socket) => {
        // console.log('a user connected', socket.id);

        // chức năng gửi yêu cầu
        socket.on("CLIENT_ADD_FRIEND", async (friendId) => {
            const myId = res.locals.user.id;


            // thêm id của A vào acceptFriend của B
            const existAcpFriend = await User.findOne({
                _id: friendId,
                acceptFriends: myId,
            });
            if (!existAcpFriend) {
                await User.updateOne(
                    {
                        _id: friendId
                    },
                    {
                        $push: { acceptFriends: myId }
                    }
                )
            }

            //thêm id của B vào requestFriend của A

            const existReqFriend = await User.findOne({
                _id: myId,
                requestFriends: friendId,
            });
            if (!existReqFriend) {
                await User.updateOne(
                    {
                        _id: myId
                    },
                    {
                        $push: { requestFriends: friendId }
                    }
                );
            }

            const infoUserAcp= await User.findOne({
                _id: friendId
            });
            const lengthAcpFriend= infoUserAcp.acceptFriends.length
            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACP", {
                userId: friendId,
                lengthAcpFriends: lengthAcpFriend
            });
        });

        // chức năng xóa yêu cầu
        socket.on("CLIENT_CANCEL_ADD", async (friendId) => {
            const myId = res.locals.user.id;

            // xóa id của A trong acceptFriend của B
            const existAcpFriend = await User.findOne({
                _id: friendId,
                acceptFriends: myId,
            });
            if (existAcpFriend) {
                await User.updateOne(
                    {
                        _id: friendId
                    },
                    {
                        $pull: { acceptFriends: myId }
                    }
                )
            }

            //xóa id của B trong requestFriend của A

            const existReqFriend = await User.findOne({
                _id: myId,
                requestFriends: friendId,
            });
            if (existReqFriend) {
                await User.updateOne(
                    {
                        _id: myId
                    },
                    {
                        $pull: { requestFriends: friendId }
                    }
                )
            }
        });


        // chức năng từ chối lời mời kết bạn CLIENT_REFUSE_ADD
        socket.on("CLIENT_REFUSE_ADD", async (friendId) => {
            const myId = res.locals.user.id;

            // xóa id của A trong acceptFriend của B
            const existAcpFriend = await User.findOne({
                _id: myId,
                acceptFriends: friendId,
            });
            if (existAcpFriend) {
                await User.updateOne(
                    {
                        _id: myId
                    },
                    {
                        $pull: { acceptFriends: friendId }
                    }
                )
            }

            //xóa id của B trong requestFriend của A

            const existReqFriend = await User.findOne({
                _id: friendId,
                requestFriends: myId,
            });
            if (existReqFriend) {
                await User.updateOne(
                    {
                        _id: friendId
                    },
                    {
                        $pull: { requestFriends: myId }
                    }
                )
            }
        });
        // Chức năng chấp nhận yêu cầu kết bạn 'CLIENT_ACCEPT_ADD'
        socket.on("CLIENT_ACCEPT_ADD", async (friendId) => {
            const myId = res.locals.user.id;

            // thêm userId của A vào friendList của B 
            // xóa id của A trong acceptFriend của B
            const existAcpFriend = await User.findOne({
                _id: myId,
                acceptFriends: friendId,
            });
            if (existAcpFriend) {
                await User.updateOne(
                    {
                        _id: myId
                    },
                    {   
                        //thêm A vào friend list của B
                        $push: {
                            friendList: {
                                user_id: friendId,
                                room_chat_id: ""
                            }
                        },
                        //Xóa trong danh sách lời mời kết bạn của B
                        $pull: { acceptFriends: friendId }
                    }
                )
            }


            // thêm id của B vào friendList của A
            //xóa id của B trong requestFriend của A

            const existReqFriend = await User.findOne({
                _id: friendId,
                requestFriends: myId,
            });
            if (existReqFriend) {
                await User.updateOne(
                    {
                        _id: friendId
                    },
                    {   
                        //thêm B vào friendList của A
                        $push: {
                            friendList: {
                                user_id: myId,
                                room_chat_id: ""
                            }
                        },
                        //xóa B trong danh sách lời mời đã gửi của A
                        $pull: { requestFriends: myId }
                    }
                )
            }
        });
    });
}