const express = require('express');
const router = express.Router();
const multer = require('multer')

const uploadCloud = require('../../middlewares/admin/uploadToCloud.middlewares');
const upload = multer();

const controller = require("../../controllers/admin/my-account.controller")
router.get("/", controller.index)
router.get("/edit", controller.edit)
router.patch(
    "/edit",
    upload.single("avatar"),
    uploadCloud.uploads,
    controller.editPatch
)


module.exports = router;