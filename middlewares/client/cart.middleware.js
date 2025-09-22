const Cart = require("../../models/carts.model")
module.exports.cartId = async (req, res, next) => {

    // console.log("cart middleware");
    if (!req.cookies.cartId) {
        // chưa có thì tạo giỏ hàng
        const cart = new Cart();
        await cart.save();

        const expiresCookie = 365 * 24 * 60 * 60 * 1000;
        res.cookie("cartId", cart.id, {
            expires: new Date(Date.now() + expiresCookie)
        });

    } else {
        // lấy ra thôi
        const cart = await Cart.findOne({
            _id: req.cookies.cartId
        })
        if (!cart) {
            res.clearCookie("cartId");
            res.redirect("/");
            return;
        }
        else {
            cart.totalQuantity = cart.products.reduce((total, item) => total + item.quantity, 0);
            // cart.totalQuantity= totalQuantity;
            res.locals.miniCart = cart;
        }
    }
    next();
} 