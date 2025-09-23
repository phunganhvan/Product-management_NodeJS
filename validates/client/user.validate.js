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
