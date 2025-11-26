const express= require('express');
const router= express.Router();
const controller= require("../../controllers/client/checkout.controller")

const productValidate= require("../../validates/client/product.validate")
const multer = require('multer')
//thư viện để upload file ảnh

const uploadCloud= require('../../middlewares/admin/uploadToCloud.middlewares');
const upload = multer();



router.get('/', controller.index);

router.post('/order', productValidate.validateQuantityCheckout,controller.orderPost)

// router.get('/payment/:orderId', controller.payment)
router.get('/payment/:orderId', controller.payment)


router.post('/payment/confirm/:orderId', upload.single("paymentProof"),
    uploadCloud.uploads ,controller.paymentConfirmPost)

router.get('/success/:orderId', controller.success)
module.exports = router;