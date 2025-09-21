const User = require("../../models/users.model")

module.exports.infoUser = async (req, res, next) => {

    //  req.cookies.tokenUser
    if (req.cookies.tokenUser) {
        const user = await User.findOne({
            tokenUser: req.cookies.tokenUser,
            deleted: false,
            status: "active"
        }).select("-password");
        if (user) {
            res.local.user = user
        }
    }

    next();
}