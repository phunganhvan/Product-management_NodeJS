const mongoose = require('mongoose');
const slug= require("mongoose-slug-updater");
mongoose.plugin(slug);
const productSchema= new mongoose.Schema(
    {
        title: String,
        parent_id:{
            type: String,
            default: "",
        },
        description: String,
        thumbnail: String,
        status: String,
        position: Number,
        deleted: {
            type: Boolean,
            default: false
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

const ProductCategory = mongoose.model('ProductCategory', productSchema, "products-category");
// tên - tên schema - tên connection trong db
module.exports = ProductCategory;