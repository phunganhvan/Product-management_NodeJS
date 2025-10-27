const express = require("express");
const router = express.Router();
const multer = require('multer')
//thư viện để upload file ảnh
const controller = require('../../controllers/admin/blog-category.controller')

const validate = require("../../validates/admin/products-category.validate");
// yêu cầu nhập tiêu đề

const uploadCloud = require('../../middlewares/admin/uploadToCloud.middlewares');
const upload = multer();



router.get("/", controller.index)

router.get("/create", controller.create);

router.post("/create", 
    upload.single("thumbnail"),
    uploadCloud.uploads,
    validate.createPost,
    controller.createPost
);


router.patch("/change-status/:status/:id", controller.changeStatus)

router.patch("/change-multi", controller.changeMulti);

router.delete("/delete/:id", controller.delete);

router.patch("/restore/:id", controller.restore)

router.get("/edit/:id", controller.edit);



router.get("/detail/:id", controller.detail);
module.exports = router;