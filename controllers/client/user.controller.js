const md5 = require("md5");
const User = require("../../models/users.model");
const generateHelper = require("../../helpers/generate");
const ForgotPassword = require("../../models/forgotPassword.model")
// {GET} /user/register
module.exports.register = async (req, res) => {
    res.render("client/pages/user/register", {
        titlePage: "Đăng kí tài khoản"
    });
}
// /user/register [POST]
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
// /user/login [get]
module.exports.login = async (req, res) => {

    if (res.locals.user) {
        res.redirect("/");
        return;
    }
    res.render("client/pages/user/login", {
        titlePage: "Đăng nhập",

    })
}

// /user/login [POST]
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
// /user/logput [GET]
module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser");
    res.redirect("/")
}

module.exports.forgotPassword = async (req, res) => {
    res.render("client/pages/user/forgot-password", {
        titlePage: "Quên mật khẩu"
    })
}

module.exports.forgotPasswordPost = async (req, res) => {
    // console.log(req.body.email)
    const email = req.body.email;
    const user = await User.findOne({
        email: email,
        deleted: false
    });
    if (!user) {
        req.flash("error", "Người dùng không tồn tại")
        res.redirect(req.get("Referer"));
        return
    }
    if (user.status === "locked") {
        req.flash("error", "Tài khoản đã bị khóa");
        res.redirect(req.get("Referer"));
        return;
    }


    // lưu thông tin vào db rồi mới gửi
    const otp= generateHelper.generateRandomOtp(6)
    const objectForgotPassword = {
        email: email,
        otp: otp,
        expiresAfter: new Date(Date.now() + 12 * 10000)
    }
    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();

    // nếu có thì gửi mã OTP
    res.send("OK");
}