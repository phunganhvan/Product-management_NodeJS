const Cart = require("../../models/carts.model")
const Product = require("../../models/product.model")

const productHelper = require("../../helpers/product")
const checkoutQuantityHelper = require("../../helpers/checkoutQuantity")
// get  /cart
module.exports.index = async (req, res) => {


    const cartId = req.cookies.cartId;
    const cart = await Cart.findOne({
        _id: cartId
    })

    //pp tính tổng tiền kiểu khác
    cart.total = 0;

    //test
    // let totalMoney=0;
    // let productInfo = [];
    if (cart.products.length > 0) {
        for (item of cart.products) {
            let product = await Product.findOne({
                _id: item.product_id,
                deleted: false
            }).select("title thumbnail slug price discountPercentage")
            product.quantity = item.quantity;
            product = productHelper.priceNewProduct(product)
            item.productInfo = product;
            item.totalPrice = product.priceNew * product.quantity;
        };

        cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0)
        for (item of cart.products) {
            cart.total += item.productInfo.priceNew * item.productInfo.quantity;
        }
    }

    //test
    // console.log(cart, cartId);
    // console.log(res.locals.miniCart || 0);
    res.render("client/pages/cart/index", {
        titlePage: "Giỏ hàng",
        cartDetail: cart,
    })
}
// POST /cart/add/:productId
module.exports.addPost = async (req, res) => {
    const productId = req.params.productId;
    const quantity = req.body.quantity
    const cartId = req.cookies.cartId;
    // console.log(productId, cartId, quantity);
    const cart = await Cart.findOne({ _id: cartId });
    const existProduct = cart.products.find(item => item.product_id == productId);
    if (existProduct) {
        // cập nhật obj số lượng


        const newQuantity = parseInt(quantity) + parseInt(existProduct.quantity);
        const checkQuantity = await checkoutQuantityHelper.checkQuantity(productId, newQuantity);
        if (!checkQuantity) {
            req.flash("error", "số lượng hàng không hợp lệ");
            res.redirect("/cart");
            return;
        }
        // console.log(newQuantity);
        await Cart.updateOne({
            _id: cartId,
            "products.product_id": productId
        },
            {
                $set: {
                    'products.$.quantity': newQuantity
                }
            }
        )
    } else {
        // thêm mới
        const objCart = {
            product_id: productId,
            quantity: quantity
        }
        console.log(quantity);
        const checkQuantity = await checkoutQuantityHelper.checkQuantity(productId, quantity);
        if (!checkQuantity) {
            req.flash("error", "số lượng hàng không hợp lệ");
            res.redirect("/cart");
            return;
        }
        await Cart.updateOne({
            _id: cartId
        }, {
            $push: { products: objCart }
        })
    }
    req.flash("success", "Thêm vào giỏ hàng thành công")
    res.redirect(req.get("Referer"));
    // res.send("Cart add")
}

module.exports.delete = async (req, res) => {
    const productId = req.params.productId;
    const cartId = req.cookies.cartId;

    // minicart cũng vậy
    await Cart.updateOne(
        {
            _id: cartId,
        },
        {
            $pull: { products: { product_id: productId } }
        }
    )
    // console.log(productId);
    req.flash("success", "Đã xóa sản phẩm khỏi giỏ hàng")
    res.redirect(req.get("Referer"));
}

// get   /cart/update-quantity/:productId/:newQuantity
module.exports.update = async (req, res) => {
    const productId = req.params.productId;
    const newQuantity = req.params.newQuantity;
    // console.log(productId, newQuantity);

    const cartId = req.cookies.cartId;
    //cập nhật số lượng kiểm tragg
    const checkQuantity = await checkoutQuantityHelper.checkQuantity(productId, newQuantity);
    // console.log(checkQuantity);
    if (!checkQuantity) {
        req.flash("error", "số lượng hàng không hợp lệ");
        res.redirect("/cart");
        return;
    }
    await Cart.updateOne(
        {
            _id: cartId,
            "products.product_id": productId
        },
        {
            $set: {
                'products.$.quantity': newQuantity
            }
        }
    )
    req.flash("success", "Cập nhật số lượng")
    res.redirect(req.get("Referer"));
}