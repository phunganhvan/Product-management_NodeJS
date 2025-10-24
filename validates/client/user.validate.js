const User = require("../../models/users.model");
const md5= require("md5");
module.exports.registerPost=  (req, res, next) =>{

    if(!req.body.fullName || !req.body.email ||!req.body.password){
        req.flash("error", "Vui lòng nhập đủ thông tin");
        res.redirect(req.get('Referrer'));
        return;
    }
    // console.log("OK")
    next();
}

module.exports.loginPost=  (req, res, next) =>{

    if(!req.body.email ||!req.body.password){
        req.flash("error", "Vui lòng nhập đủ thông tin");
        res.redirect(req.get('Referrer'));
        return;
    }
    // console.log("OK")
    next();
}

module.exports.forgotPasswordPost=  (req, res, next) =>{

    if(!req.body.email){
        req.flash("error", "Vui lòng nhập email");
        res.redirect(req.get('Referrer'));
        return;
    }
    // console.log("OK")
    next();
}

module.exports.resetPasswordPost=  (req, res, next) =>{

    if(!req.body.password){
        req.flash("error", "Vui lòng nhập mật khẩu");
        res.redirect(req.get('Referrer'));
        return;
    }
    if(!req.body.confirmPassword){
        req.flash("error", "Vui lòng xác nhận mật khẩu");
        res.redirect(req.get('Referrer'));
        return;
    }
    if(req.body.password !== req.body.confirmPassword){
        req.flash("error", "Mật khẩu không trùng khớp. Vui lòng kiểm tra lại");
        res.redirect(req.get('Referrer'));
        return;
    }
    // console.log("OK")
    next();
}

module.exports.editPatch=  async(req, res, next) =>{

    // console.log(req.body);
    const user= await User.findOne({
        tokenUser: req.cookies.tokenUser
    }).select("id password fullName");
    if(!req.body.fullName){
        req.body.fullName= user.fullName;
    }
    if(req.body.newPassword!== req.body.confirmPassword){
        req.flash("error", "Mật khẩu xác nhận không trùng khớp, vui lòng thử lại")
        res.redirect(req.get("Referer"));
        return;
    }
    if(md5(req.body.password)!== user.password){
        req.flash("error", "Mật khẩu hiện tại không chính xác, vui lòng kiểm tra lại")
        res.redirect(req.get("Referer"));
        return;
    }

    next();
}
