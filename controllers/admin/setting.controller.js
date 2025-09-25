const SettingGeneral = require("../../models/settings-general.model")
module.exports.general = async (req, res) => {
    let settingGeneral = await SettingGeneral.findOne({
        // khong truyen gi vao => lay ra ban ghi đau tien
    })
    if(!settingGeneral){
        settingGeneral={
            websiteName: "",
            logo: "",
            email: "",
            phone: "",
            address: "",
            copyright: ""
        }
    }
    res.render("admin/pages/settings/general", {
        pageTitle: "Cài đặt chung",
        settingGeneral: settingGeneral 
    })
}

module.exports.generalPatch = async (req, res) => {
    // console.log(req.body);  
    const settingGeneral = await SettingGeneral.findOne({})
    if (settingGeneral) {
        await SettingGeneral.updateOne(
            {
                _id: settingGeneral.id
            },
            req.body
        )
    }
    else{
        const record = new SettingGeneral(req.body)
        await record.save();
    }
    req.flash("success", "Cập nhật cài đặt chung thành công")
    res.redirect(req.get("Referer"));
}