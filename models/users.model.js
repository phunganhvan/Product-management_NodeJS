const mongoose = require('mongoose');
const generate= require("../helpers/generate")
const userSchema= new mongoose.Schema(
    {
        fullName: String,
        email: String,
        password: String,
        tokenUser: {
            type: String,
            default: generate.generateRandomString(20)
        },
        phone: String,
        description: String,
        avatar: String,
        status: {
            type: String,
            default: "active"
        },
        statusOnline: String,
        requestFriends: Array, // lời mời đã gửi
        acceptFriends: Array, //lời mời đã nhận
        friendList: [
            {
                user_id: String,
                room_chat_id: String,
            }
        ],
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date,
    },
    {
        timestamps: true
    }
);

const User = mongoose.model('User', userSchema, "users");
// tên - tên schema - tên connection trong db
module.exports = User;