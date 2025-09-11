const mongoose = require('mongoose');
const slug= require("mongoose-slug-updater");
mongoose.plugin(slug);
const productSchema= new mongoose.Schema(
    {
        title: String,
        description: String,
        product_category_id: {
            type: String,
            default: ""
        },
        price: Number,
        discountPercentage: Number,
        thumbnail: String,
        status: String,
        stock: Number,
        position: Number,
        featured: String,
        deleted: {
            type: Boolean,
            default: false
        },
        // deletedAt: Date,
        slug: {
            type: String,
            slug: "title",
            unique: true
        },
        createdBy: {
            accountId: String,
            createdAt:{
                type: Date, 
                default: Date.now
            }
        },
        deletedBy: {
            accountId: String,
            deletedAt: Date
        },
        updatedBy: [
            {
                accountId: String,
                updatedAt: Date
            }
        ],
    },
    {
        timestamps: true
    }
);

const Product = mongoose.model('Product', productSchema, "products");
// tên - tên schema - tên connection trong db
module.exports = Product;