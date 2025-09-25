const systemConfig= require("../../config/system")
const User= require("../../models/users.model")
module.exports.requireAuth = async(req, res, next) =>{

    // req.cookies.token

    if(!req.cookies.tokenUser){
        req.flash("error", "Bạn không thể truy cập vào trang này")
        return res.redirect(`/user/login`)
        
    }
    else{
        const user= await User.findOne({
            token:req.cookies.token
        }).select("-password");
        if(!user){
            req.flash("error", "Bạn không thể truy cập vào trang này")
            return res.redirect(`/user/login`)
        }
        else{
            res.locals.user= user 
            next()
        }
    }
    
}