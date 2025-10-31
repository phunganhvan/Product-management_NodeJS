const systemConfig= require("../../config/system")
const Account = require("../../models/account.model")
const Role= require("../../models/role.model")
module.exports.requireAuth = async(req, res, next) =>{
    // req.cookies.token
    if(!req.cookies.token){
        req.flash("error", "Bạn không có quyền truy cập vào trang này")
        return res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
        
    }
    else{
        const user= await Account.findOne({
            token:req.cookies.token
        }).select("-password");
        if(!user){
            req.flash("error", "Bạn không có quyền truy cập vào trang này")
            return res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
        }
        else{
            const role= await Role.findOne({
                _id: user.role_id
            }).select("title permission")
            res.locals.user= user
            res.locals.role= role
            next()
        }
    }
    
}