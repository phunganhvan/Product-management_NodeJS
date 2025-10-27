const express = require("express");
const router = express.Router();
const multer = require('multer')
//thư viện để upload file ảnh

const uploadCloud= require('../../middlewares/admin/uploadToCloud.middlewares');

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

module.exports = router;