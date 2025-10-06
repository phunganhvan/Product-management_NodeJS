const md5 = require("md5");
const User = require("../../models/users.model");
const Cart = require("../../models/carts.model")

const generateHelper = require("../../helpers/generate");
const ForgotPassword = require("../../models/forgotPassword.model")

const sendMailHelper = require("../../helpers/sendMail")
// gửi mail


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
    await user.save();
    res.locals.user= user
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
    const cart = await Cart.findOne({
        user_id: user.id
    });
    if (cart) {
        res.cookie("cartId", cart.id);
    } else {
        await Cart.updateOne(
            {
                _id: req.cookies.cartId
            },
            {
                user_id: user.id
            }
        )
    }


    await Cart.updateOne(
        {
            _id: req.cookies.cartId
        },
        {
            user_id: user.id
        }
    )
    res.cookie("tokenUser", user.tokenUser);
    await User.updateOne({
        tokenUser: user.tokenUser
    }, {
        statusOnline: "online"
    })

    req.flash("success", "Đăng nhập thành công");
    res.redirect("/")
}
// /user/logput [GET]
module.exports.logout = async (req, res) => {
    await User.updateOne({
        tokenUser: req.cookies.tokenUser
    }, {
        statusOnline: "offline"
    })
    res.clearCookie("tokenUser");
    res.clearCookie("cartId");
    req.flash("success", "Đăng xuất thành công")
    res.redirect("/")
}
// [GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
    res.render("client/pages/user/forgot-password", {
        titlePage: "Quên mật khẩu"
    })
}
// [POST] /user/password/forgot
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
    const otp = generateHelper.generateRandomOtp(6)
    const objectForgotPassword = {
        email: email,
        otp: otp,
        expiresAfter: new Date(Date.now() + 12 * 10000)
    }
    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();

    // gửi otp qua mail

    const subject = "Mã OTP xác minh lấy lại mật khẩu";
    const html = `
        Mã OTP để lấy lại mật khẩu là <b style="color: green; font-size: 24px">${otp}</b>. Thời hạn sử dụng là 2 phút.
    `;

    sendMailHelper.sendMail(email, subject, html);
    // chuyển sang trang nhập otp
    req.flash("success", "Đã gửi mã OTP")
    res.redirect(`/user/password/otp?email=${email}`);
}

//[GET] /user/password/otp
module.exports.otpPassword = async (req, res) => {
    const email = req.query.email

    res.render("client/pages/user/otp-password", {
        titlePage: "Nhập mã OTP",
        email: email
    })
}

//[POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;

    const result = await ForgotPassword.findOne({
        email: email,
    });
    if (!result) {
        req.flash("error", "Mã OTP không còn tồn tại. Vui lòng thử lại");
        res.redirect("/user/password/forgot");
        return;
    }
    if (otp !== result.otp) {
        req.flash("error", "Mã OTP không chính xác, vui lòng kiểm tra lại!");
        res.redirect(`/user/password/otp?email=${email}`);
        return;
    }

    const user = await User.findOne({
        email: email
    })
    res.cookie("tokenUser", user.tokenUser);

    res.redirect("/user/password/reset");
}

// [GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
    res.render("client/pages/user/reset-password", {
        titlePage: "Đặt lại mật khẩu",

    })
}

//  [POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
    const password = req.body.password;
    // const confirmPassword= req.body.confirmPassword;
    const tokenUser = req.cookies.tokenUser;

    await User.updateOne(
        {
            tokenUser: tokenUser,
        },
        {
            password: md5(password)
        }
    );
    req.flash("success", "Đặt lại mật khẩu thành công")
    res.redirect("/")
}

// [GET] /user/info
module.exports.info = async (req, res) => {


    res.render("client/pages/user/info", {
        titlePage: "Thông tin cá nhân",
    })
}