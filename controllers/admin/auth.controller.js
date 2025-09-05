const Account = require("../../models/account.model")
const md5= require("md5")
const systemConfig= require("../../config/system")
module.exports.login =(req, res) =>{
    const token= req.cookies.token
    const user= Account.findOne({
        token: token
    })
    if(token && user){
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`)
        return;
    }
    res.render("admin/pages/auth/login", {
        pageTitle: "Trang đăng nhập"
    });
}

module.exports.loginPost = async(req, res) =>{
    // console.log(req.body)

    const email= req.body.email
    const password= req.body.password

    const user= await Account.findOne({
        email: email,
        deleted: false
    });

    if(!user){
        req.flash("error", "Email không tồn tại");
        res.redirect(req.get("Referer"))
        return;
    }
    if(md5(password) != user.password){
        req.flash("error", "Sai mật khẩu");
        res.redirect(req.get("Referer"))
        return;
    }
    if(user.status!="active"){
        req.flash("error", "Tài khoản đã bị khóa");
        res.redirect(req.get("Referer"))
        return;
    }
    req.flash("success", "Đăng nhập thành công")

    res.cookie("token", user.token)
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`)
}

module.exports.logout = (req, res) =>{
    res.clearCookie("token")
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
}