const User= require("../../models/users.model");
module.exports.notFriend = async(req, res) =>{
    const userId= res.locals.user.id
    const users= await User.find({
        _id: { $ne: userId},
        status: "active",
        deleted: false
    }).select("fullName avatar id");
    res.render("client/pages/users/not-friend", {
        titlePage: "Danh sách người dùng",
        users: users

    })
}