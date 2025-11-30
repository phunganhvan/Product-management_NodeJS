const Cart = require("../../models/carts.model")
const Product = require("../../models/product.model")
const Order = require("../../models/orders.model")
const productHelper = require("../../helpers/product")
const { generateOrderCode } = require("../../helpers/generate")


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
            }).select("title thumbnail slug price discountPercentage stock")
            if (item.quantity > product.stock || item.quantity < 1) {
                // item.quantity=1;
                req.flash("error", "số lượng hàng không hợp lệ");
                res.redirect("/cart");
                return;
            }
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
module.exports.orderPost = async (req, res) => {
    const cartId = req.cookies.cartId;
    const userInfo = {
        fullName: req.body.fullName,
        phone: req.body.phone,
        address: req.body.address
    };
    const paymentMethod = req.body.paymentMethod;
    const myCart = await Cart.findOne({
        _id: cartId
    })
    // console.log(req.body);
    let products = [];
    if (myCart.products.length > 0) {
        for (item of myCart.products) {
            const product = await Product.findOne({
                _id: item.product_id
            }).select("price discountPercentage")
            product.quantity = item.quantity;
            const objectProduct = {
                product_id: item.product_id,
                price: product.price,
                discountPercentage: product.discountPercentage,
                quantity: product.quantity
            }
            products.push(objectProduct)
        }
    }
    const orderInfo = {
        cart_id: cartId,
        userInfo: userInfo,
        products: products,
        paymentMethod: paymentMethod
    }
    orderInfo.orderCode = generateOrderCode();
    const order = new Order(orderInfo);
    order.save();

    await Cart.updateOne(
        {
            _id: cartId
        },
        {
            products: [],
        }
    );
    if (req.body.paymentMethod === "bank" || req.body.paymentMethod === "momo" ) {
        return res.redirect(`/checkout/payment/${order.id}`)
    }
    res.redirect(`/checkout/success/${order.id}`)
}

// [GET] /checkout/payment/:orderId
module.exports.payment = async (req, res) => {
    const orderId = req.params.orderId;
    const order = await Order.findOne({
        _id: orderId
    });
    // console.log(order);
    if(order.paymentMethod === "momo"){
        res.render("client/pages/checkout/payment-momo", {
            titlePage: "Thanh toán MoMo",
            momoInfo: {
                momoName: "MOMO",
                accountNumber: "NTHT1221332",
                accountName: "Nguyen Thi Huyen Trang",
                qrImage: "/images/momo.jfif",
                orderId: orderId
                // transferNote: "Thanh toan don hang #" + req.session.orderCode   
            }
        });
        return;
    }
    res.render("client/pages/checkout/payment-bank", {
        titlePage: "Thanh toán chuyển khoản",
        bankInfo: {
            bankName: "MBbank",
            accountName: "Ngô Minh Sơn",
            accountNumber: "54936666868",
            qrImage: "/images/mbBank.jfif",
            orderId: orderId
            // transferNote: "Thanh toan don hang #" + req.session.orderCode
        }
        // bankInfo: {
        //     bankName: "Vietinbank",
        //     accountName: "PHUNG ANH VAN",
        //     accountNumber: "102877060925",
        //     qrImage: "/images/QRNganHang.jpg",
        //     orderId: orderId
        //     // transferNote: "Thanh toan don hang #" + req.session.orderCode
        // }
    });

}

// [POST] /checkout/payment/confirm/:orderId
module.exports.paymentConfirmPost = async (req, res) => {
    console.log(req.body);
    const orderId = req.params.orderId;
    let paymentProofUrl = req.body.paymentProof;
    await Order.updateOne(
        {
            _id: orderId
        },
        {
            paymentProof: paymentProofUrl,
            paymentStatus: "pending"
        }
    );
    res.redirect(`/checkout/success/${orderId}`)
}

// [GET] /checkout/success/:orderId
module.exports.success = async (req, res) => {
    // console.log(req.params.orderId);

    const order = await Order.findOne({
        _id: req.params.orderId
    });

    for (product of order.products) {
        const productInfo = await Product.findOne({
            _id: product.product_id
        }).select("title thumbnail")

        product.productInfo = productInfo;
        product = productHelper.priceNewProduct(product);
        product.totalPrice = product.priceNew * product.quantity;
        // console.log(product.productInfo)
    }
    order.totalPrice = order.products.reduce((sum, item) => sum + item.totalPrice, 0);
    // console.log(order.totalPrice);
    res.render("client/pages/checkout/success", {
        titlePage: "Đặt hàng thành công",
        order: order
    })
}