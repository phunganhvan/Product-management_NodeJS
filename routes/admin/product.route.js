const express = require("express");
const router = express.Router();
const multer = require('multer')
//thư viện để upload file ảnh

const uploadCloud= require('../../middlewares/admin/uploadToCloud.middlewares');



const controller = require("../../controllers/admin/product.controller");
// const storage = require("../../helpers/storageMulter");
// của multer

const validate = require("../../validates/admin/product.validate");

const upload = multer();
// const upload = multer({ dest: './public/uploads', storage: storage() })
//upload theo folder
router.get("/", controller.index);
//router giao diện trang chủ product
router.patch("/change-status/:status/:id", controller.changeStatus);
// update trạng thái 1 sản phẩm
router.patch("/change-multi", controller.changeMulti);
//update nhiều sản phẩm, xóa nhiều, khôi phục nhiều
router.delete("/delete/:id", controller.deleteProduct);
//xóa 1 sản phẩm
router.patch("/restore/:id", controller.restore);
//khôi phục 1 sản phẩm

router.get("/create", controller.create);
//giao diện tạo mới 1 sản phẩm
router.post(
    "/create",
    upload.single("thumbnail"),
    uploadCloud.uploads,
    validate.createPost,
    controller.createPost)
//logic tọa mới
//product/edit/:id [GET]
router.get("/edit/:id", controller.edit);
// giao diện chỉnh sửa sản phaamr

//product/edit/:id [PATCH]
router.patch("/edit/:id", upload.single("thumbnail"), uploadCloud.uploads,
    validate.createPost, controller.editPatch)
// product/detail/:id
router.get("/detail/:id", controller.detail)

router.patch("/restore/:id", controller.restoreOne)



module.exports = router;