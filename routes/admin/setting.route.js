const express= require('express')
const router= express.Router();

const multer= require("multer");
const upload= multer();
const controller= require("../../controllers/admin/setting.controller")
const uploadCloud= require("../../middlewares/admin/uploadToCloud.middlewares");


router.get("/general", controller.general)

router.patch(
    "/general",
    upload.single("logo"),
    uploadCloud.uploads,
    controller.generalPatch
)

module.exports= router;