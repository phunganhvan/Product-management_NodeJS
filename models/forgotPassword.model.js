const mongoose= require("mongoose");

const forgotPasswordSchema= new mongoose.Schema(
    {
        email: String, 
        otp: String,
        expiresAt: Date
    },
    {
        timestamps: true,
    }
);
const ForgotPassword = mongoose.model("ForgotPassword", forgotPasswordSchema, "forgotPassword");
module.exports= ForgotPassword;