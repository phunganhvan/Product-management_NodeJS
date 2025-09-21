const md5= require("md5");
const User= require("../../models/users.model");
// {GET} /user/register
module.exports.register= async(req, res) =>{
    res.render("client/pages/user/register", {
        titlePage: "Đăng kí tài khoản"
    });
}

module.exports.registerPost= async(req, res) =>{
    const existEmail = await User.findOne({
        email: req.body.email
    });

    if(existEmail){
        req.flash("error", "Email đã tồn tại, vui lòng nhập email khác");
        res.redirect(req.get("Referer"));
    }
    req.body.password= md5(req.body.password);
    const user = new User(req.body)
    await user.save()
    res.cookie("tokenUser", user.tokenUser)
    res.redirect("/");
}