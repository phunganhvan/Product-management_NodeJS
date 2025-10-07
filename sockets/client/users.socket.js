const User = require("../../models/users.model");
const RoomChat = require("../../models/rooms-chat.model")
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
            // cập nhật số lượng lời mời bên người nhận
            const infoUserAcp = await User.findOne({
                _id: friendId
            });
            const lengthAcpFriend = infoUserAcp.acceptFriends.length
            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACP", {
                userId: friendId,
                lengthAcpFriends: lengthAcpFriend
            });

            // lấy info người gửi trả về bên giao diện người nhận
            const infoUserReq = await User.findOne({
                _id: myId
            }).select("id avatar fullName");
            socket.broadcast.emit("SERVER_RETURN_INFO_ACP", {
                userId: friendId, // người nhận thông tin này là người được gửi yêu cầu
                infoUserReq: infoUserReq
            })
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
            const infoUserAcp = await User.findOne({
                _id: friendId
            });
            const lengthAcpFriend = infoUserAcp.acceptFriends.length
            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACP", {
                userId: friendId,
                lengthAcpFriends: lengthAcpFriend
            });

            // lấy id xóa người gửi tự xóa yêu cầu
            socket.broadcast.emit("SERVER_RETURN_CANCEL_REQ", {
                myId: myId,
                friendId: friendId
            })
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
            // cập nhật số lượng lời mời bên người nhận
            const infoUserAcp = await User.findOne({
                _id: myId
            });
            const lengthAcpFriend = infoUserAcp.acceptFriends.length
            socket.emit("SERVER_RETURN_LENGTH_ACP", {
                userId: myId,
                lengthAcpFriends: lengthAcpFriend
            });
        });
        // Chức năng chấp nhận yêu cầu kết bạn 'CLIENT_ACCEPT_ADD'
        socket.on("CLIENT_ACCEPT_ADD", async (friendId) => {
            const myId = res.locals.user.id;
            let roomChat;
            // check exist
            const existAcpFriend = await User.findOne({
                _id: myId,
                acceptFriends: friendId,
            });

            const existReqFriend = await User.findOne({
                _id: friendId,
                requestFriends: myId,
            });
            // end check exist

            // tạo phòng chat chung cho 2 nguoi
            if (existAcpFriend && existReqFriend) {
                const dataRoom = {
                    // title: String, 
                    // avatar: String,
                    typeRoom: "friend", // group
                    // status: String,
                    users: [
                        {
                            user_id: myId,
                            role: "superAdmin"
                        },
                        {
                            user_id: friendId,
                            role: "superAdmin"
                        }
                    ]
                }
                roomChat = new RoomChat(dataRoom);
                await roomChat.save();
            }
            // end tạo phòng


            // thêm userId của A vào friendList của B 
            // xóa id của A trong acceptFriend của B
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
                                room_chat_id: roomChat.id
                            }
                        },
                        //Xóa trong danh sách lời mời kết bạn của B
                        $pull: { acceptFriends: friendId }
                    }
                )
            }


            // thêm id của B vào friendList của A
            //xóa id của B trong requestFriend của A

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
                                room_chat_id: roomChat.id
                            }
                        },
                        //xóa B trong danh sách lời mời đã gửi của A
                        $pull: { requestFriends: myId }
                    }
                )
            }
            // cập nhật số lượng lời mời bên người nhận
            const infoUserAcp = await User.findOne({
                _id: myId
            });
            const lengthAcpFriend = infoUserAcp.acceptFriends.length
            socket.emit("SERVER_RETURN_LENGTH_ACP", {
                userId: myId,
                lengthAcpFriends: lengthAcpFriend
            });
        });


        // chức năng online offline

    });
}