const express = require("express");
const router = express.Router();
const controller = require('../../controllers/admin/order.controller')


// /admin/orders
router.get("/", controller.index);

// /admin/orders/change-status/:status/:id
router.patch("/change-status/:status/:id", controller.changeStatus);

// /admin/orders/change-statusPayment/:statusPayment/:id
router.patch("/change-statusPayment/:statusPayment/:id", controller.changeStatusPayment);
// /admin/orders/detail/:id  
router.get("/detail/:id", controller.detail);


// /admin/orders/delete/:id
router.delete("/delete/:id", controller.delete);

// /admin/orders/restore/:id

router.patch("/restore/:id", controller.restore);
module.exports = router;