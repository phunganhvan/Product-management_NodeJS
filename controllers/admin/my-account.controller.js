const Account = require("../../models/account.model")
const md5= require('md5')
module.exports.index = async (req, res) => {
    res.render("admin/pages/my-account/index", {
        pageTitle: "Thông tin cá nhân",
    })
}


module.exports.edit = async (req, res) => {
    res.render("admin/pages/my-account/edit", {
        pageTitle: "Chỉnh sửa thông tin cá nhân",
    })
}

module.exports.editPatch = async (req, res) => {
    // console.log(req.body)
    const id = res.locals.user.id;
    const emailExist = await Account.findOne({
        _id: { $ne: id },
        email: req.body.email,
        deleted: false
    });
    if (emailExist) {
        req.flash("error", "Email đã được sử dụng, vui lòng điền email khác");
    }
    else {
        if (req.body.password) {
            req.body.password = md5(req.body.password)
        }
        else {
            delete req.body.password;
        }
        await Account.updateOne({
            _id: id
        }, req.body)
        req.flash("success", "Cập nhật tài khoản thành công")
    }
    res.redirect(req.get("Referer"))
}