const mongoose = require('mongoose');
const slug= require("mongoose-slug-updater");
mongoose.plugin(slug);
const settingsGeneralSchema= new mongoose.Schema(
    {
        websiteName: String,
        logo: String,
        email: String,
        phone: String,
        address: String,
        copyright: String
    },
    {
        timestamps: true
    }
);

const SettingGeneral = mongoose.model('SettingGeneral', settingsGeneralSchema, "settings-general");
// tên - tên schema - tên connection trong db
module.exports = SettingGeneral;