const express = require('express');
const router= express.Router();
const validate= require("../../validates/admin/accounts.validate")
const multer = require('multer')
//thư viện để upload file ảnh

const uploadCloud= require('../../middlewares/admin/uploadToCloud.middlewares');
const upload = multer();

const controller= require("../../controllers/admin/accounts.controller")
router.get("/", controller.index)
//create
router.get("/create", controller.create)

router.post("/create", upload.single("avatar"),
    uploadCloud.uploads, validate.createPost ,controller.createPost)
//edit
router.get("/edit/:id", controller.edit)
router.patch("/edit/:id", upload.single("avatar"),
    uploadCloud.uploads, validate.editPatch ,controller.editPatch)

module.exports= router;