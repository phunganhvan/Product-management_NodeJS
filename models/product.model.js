const mongoose = require('mongoose');
const slug= require("mongoose-slug-updater");
mongoose.plugin(slug);
const productSchema= new mongoose.Schema(
    {
        title: String,
        description: String,
        price: Number,
        discountPercentage: Number,
        thumbnail: String,
        status: String,
        stock: Number,
        position: Number,
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date,
        slug: {
            type: String,
            slug: "title",
            unique: true
        },
    },
    {
        timestamps: true
    }
);

const Product = mongoose.model('Product', productSchema, "products");
// tên - tên schema - tên connection trong db
module.exports = Product;