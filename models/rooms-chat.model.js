const mongoose = require("mongoose");
const roomChatSchema= new mongoose.Schema(
    {
        title: String,
        avatar: String,
        typeRoom: String,
        status: String,
        theme: String,
        users: [
            {
                user_id: String,
                role: String, // quyền trong phòng chat - truonrg phòng, phó phòng,....
            }
        ],
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date,
    }, {
        timestamps: true,
    }
);
const RoomChat= mongoose.model("RoomChat", roomChatSchema, "rooms-chat");

module.exports = RoomChat;