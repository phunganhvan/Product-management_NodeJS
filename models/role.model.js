const mongoose = require('mongoose');
const slug= require("mongoose-slug-updater");
mongoose.plugin(slug);
const roleSchema= new mongoose.Schema(
    {
        title: String,
        description: String,
        permission:{
            type: Array,
            default: []
        },
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

const Role = mongoose.model('Role', roleSchema, "roles");
// tên - tên schema - tên connection trong db
module.exports = Role;