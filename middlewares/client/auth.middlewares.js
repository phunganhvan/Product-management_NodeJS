const systemConfig = require("../../config/system")
const User = require("../../models/users.model")
module.exports.requireAuth = async (req, res, next) => {

    // req.cookies.token

    if (!req.cookies.tokenUser) {
        console.log("không có cookies")
        req.flash("error", "Bạn không thể truy cập vào trang này")
        return res.redirect(`/user/login`)

    }
    else {
        const user = await User.findOne({
            tokenUser: req.cookies.tokenUser
        }).select("-password");
        if (!user) {
            console.log("không có người dùng")
            req.flash("error", "Bạn không thể truy cập vào trang này")
            return res.redirect(`/user/login`)
        }
        else {
            // res.locals.user= user 
            // _io.once('connection', (socket) => {
            //     // console.log('a user connected');

            //     socket.on('disconnect', () => {
            //         socket.broadcast.emit("SERVER_RETURN_STATUS", {
            //             userId: res.locals.user.id,
            //             status: "offline"
            //         })
            //     });
            // });
            next();
            // console.log(user, req.cookies.tokenUser);
        }
    }

}