const Cart = require("../../models/carts.model")
const Product = require("../../models/product.model")
const Order= require("../../models/orders.model")
const productHelper = require("../../helpers/product")


// /checkout  - trang chủ
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

    res.render("client/pages/checkout/index", {
        titlePage: "Đặt hàng",
        cartDetail: cart
    })
}

// [POST] /checkout/order
module.exports.orderPost = async(req, res) =>{
    const cartId= req.cookies.cartId;
    const userInfo= req.body;
    const myCart= await Cart.findOne({
        _id: cartId
    })
    let products=[];
    if(myCart.products.length >0){
        for(item of myCart.products){
            const product= await Product.findOne({
                _id: item.product_id
            }).select("price discountPercentage")
            product.quantity= item.quantity;
            const objectProduct={
                product_id: item.product_id,
                price: product.price,
                discountPercentage: product.discountPercentage,
                quantity: product.quantity
            }
            products.push(objectProduct)
        }
    }
    console.log(products)
    const orderInfo={
        cart_id: cartId,
        userInfo: userInfo,
        products: products
    }
    const order= new Order(orderInfo);
    order.save();

    await myCart.updateOne(
        {
            _id: cartId
        },
        {
            products: [],
        }
    )
    res.redirect(`/checkout/success/${order.id}`)
}

module.exports.success = async(req, res) =>{
    console.log(req.params.orderId);
    res.render("client/pages/checkout/success", {
        titlePage: "Đặt hàng thành công",
    })
}