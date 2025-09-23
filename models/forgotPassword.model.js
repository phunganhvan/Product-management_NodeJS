const mongoose = require("mongoose");

const forgotPasswordSchema = new mongoose.Schema(
    {
        email: String,
        otp: String,
        expiresAfter: {
            type: Date,
            // TTL index: xóa khi thời điểm này đã qua
            expires: 0
        }
    },
    {
        timestamps: true,
    }
);
const ForgotPassword = mongoose.model("ForgotPassword", forgotPasswordSchema, "forgotPassword");
module.exports = ForgotPassword;