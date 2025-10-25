const mongoose = require('mongoose');
const slug= require("mongoose-slug-updater");
mongoose.plugin(slug);
const blogSchema= new mongoose.Schema(
    {
        title: String,
        summary: String, // tóm tắt ngắn gọn hiển thị ở danh sách
        content: String,
        product_category_id: {
            type: String,
            default: ""
        },
        thumbnail: String,
        status: String,
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

const Blog = mongoose.model('Blog', blogSchema, "blogs");
// tên - tên schema - tên connection trong db
module.exports = Blog;