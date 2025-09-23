const express= require('express');
const router= express.Router();
const controller= require("../../controllers/client/checkout.controller")

const productValidate= require("../../validates/client/product.validate")
router.get('/', controller.index);

router.post('/order', productValidate.validateQuantityCheckout,controller.orderPost)

router.get('/success/:orderId', controller.success)
module.exports = router;