const express= require('express')
const router= express.Router()
const controller= require("../../controllers/client/user.controller")
const validate= require("../../validates/client/user.validate")


router.get("/register", controller.register);
router.post("/register", validate.registerPost ,controller.registerPost);

router.get("/login", controller.login);

router.post("/login", validate.loginPost ,controller.loginPost);

router.get("/logout", controller.logout);
// quên mật khẩu
router.get("/password/forgot", controller.forgotPassword);

//gui mail
router.post("/password/forgot", validate.forgotPasswordPost ,controller.forgotPasswordPost)
module.exports = router