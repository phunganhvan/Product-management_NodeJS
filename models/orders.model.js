const mongoose = require("mongoose");
const { payment } = require("../controllers/client/checkout.controller");
const orderSchema = new mongoose.Schema(
    {
        user_id: String,
        cart_id: String,
        userInfo:{
            fullName: String,
            phone: String,
            address: String
        },
        statusOrder: {
            type: String,
            default: "initial"
        },
        products:[
            {
                product_id: String,
                price: Number,
                discountPercentage: Number, 
                quantity: Number
            }
        ],
        orderCode: String,
        paymentMethod: String,
        paymentStatus: {
            type: String,
            default: "inactive"
        },
        paymentProof: {
            type: String,
            default: ""
        },
        deleted:{
            type: Boolean,
            default: false
        },
        deletedAt: Date,
        updatedBy: [
            {
                accountId: String,
                updatedAt: Date
            }
        ],
        deletedBy: {
            accountId: String,
            deletedAt: Date
        },
    },
    {
        timestamps: Date,
    }
);

const Order= mongoose.model("Order", orderSchema, "orders")
module.exports= Order;