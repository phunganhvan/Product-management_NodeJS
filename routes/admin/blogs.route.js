const express = require("express");
const router = express.Router();
const multer = require('multer')
//thư viện để upload file ảnh

const uploadCloud = require('../../middlewares/admin/uploadToCloud.middlewares');

const controller = require("../../controllers/admin/blogs.controller");
// const storage = require("../../helpers/storageMulter");
// của multer

const validate = require("../../validates/admin/product.validate");

const upload = multer();

router.get("/", controller.index);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.delete("/delete/:id", controller.deleteBlog);

router.patch("/restore/:id", controller.restoreBlog);

router.get("/create", controller.create);

router.post(
    "/create",
    upload.single("thumbnail"),
    uploadCloud.uploads,
    validate.createPost,
    controller.createPost);

router.get("/edit/:id", controller.edit)

router.patch("/edit/:id", upload.single("thumbnail"), uploadCloud.uploads,
    validate.createPost, controller.editPatch)

router.get("/detail/:id", controller.detail);
module.exports = router;