module.exports.createPost=  (req, res, next) =>{

    if(!req.body.fullName || !req.body.email ||!req.body.password){
        req.flash("error", "Vui lòng nhập đủ thông tin");
        res.redirect(req.get('Referrer'));
        return;
    }
    // console.log("OK")
    next();
}

module.exports.editPatch=  (req, res, next) =>{

    if(!req.body.fullName || !req.body.email){
        req.flash("error", "Vui lòng nhập đủ thông tin");
        res.redirect(req.get('Referrer'));
        return;
    }
    // console.log("OK")
    next();
}