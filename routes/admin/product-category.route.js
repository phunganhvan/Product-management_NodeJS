const express = require("express");
const router = express.Router();
const multer = require('multer')
//thư viện để upload file ảnh
const controller = require('../../controllers/admin/product-category.controller')


const uploadCloud = require('../../middlewares/admin/uploadToCloud.middlewares');
const validate = require("../../validates/admin/products-category.validate");

const upload = multer();
router.get("/", controller.index);
router.get("/create", controller.create);
router.post("/create", 
    upload.single("thumbnail"),
    uploadCloud.uploads,
    validate.createPost,
    controller.createPost
);
router.patch("/change-status/:status/:id", controller.changeStatus);

router.get("/edit/:id", controller.edit);
router.patch("/edit/:id", upload.single("thumbnail"), uploadCloud.uploads,
    validate.createPost, controller.editPatch)
module.exports = router;