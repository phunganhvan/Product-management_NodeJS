const express = require("express");
const router = express.Router();
const multer = require('multer')
//thư viện để upload file ảnh
const controller = require('../../controllers/admin/blog-category.controller')


const uploadCloud = require('../../middlewares/admin/uploadToCloud.middlewares');
const upload = multer();



router.get("/", controller.index)


module.exports = router;