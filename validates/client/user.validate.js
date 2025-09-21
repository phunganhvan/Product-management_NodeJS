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
