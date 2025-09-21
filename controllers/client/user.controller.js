const md5 = require("md5");
const User = require("../../models/users.model");
// {GET} /user/register
module.exports.register = async (req, res) => {
    res.render("client/pages/user/register", {
        titlePage: "Đăng kí tài khoản"
    });
}

module.exports.registerPost = async (req, res) => {
    const existEmail = await User.findOne({
        email: req.body.email
    });

    if (existEmail) {
        req.flash("error", "Email đã tồn tại, vui lòng nhập email khác");
        res.redirect(req.get("Referer"));
    }
    req.body.password = md5(req.body.password);
    const user = new User(req.body)
    await user.save()
    res.cookie("tokenUser", user.tokenUser)
    res.redirect("/");
}

module.exports.login = async (req, res) => {

    res.render("client/pages/user/login", {
        titlePage: "Đăng nhập",

    })
}

module.exports.loginPost = async (req, res) => {

    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({
        email: email
    });
    if (!user) {
        req.flash("error", "Email không tồn tại");
        res.redirect(req.get("Referer"));
        return;
    }
    if (md5(password) !== user.password) {
        req.flash("error", "Mật khẩu không chính xác");
        res.redirect(req.get("Referer"));
        return;
    }
    if (user.status === "locked") {
        req.flash("error", "Tài khoản đã bị khóa");
        res.redirect(req.get("Referer"));
        return;
    }

    res.cookie("tokenUser", user.tokenUser)
    req.flash("success", "Đăng nhập thành công");
    res.redirect("/")
}