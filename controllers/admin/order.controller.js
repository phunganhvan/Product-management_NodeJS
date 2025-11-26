const Order = require("../../models/orders.model");
const Product= require("../../models/product.model");
const orderStatusHelper = require("../../helpers/orderStatus")
const pag = require("../../helpers/pagination");
//   /admin/orders [GET]
module.exports.index = async (req, res) => {
    let sortKey, sortValue;
    if (req.query.sortKey && req.query.sortValue) {
        sortKey = req.query.sortKey;
        sortValue = req.query.sortValue;
    }
    else {
        sortKey = "createdAt";
        sortValue = "desc";
    }
    const orderStatus = orderStatusHelper(req.query);

    let find = {
        deleted: false,
    }

    let status = req.query.status;
    if (status) {
        find.statusOrder = status;
    }
    if (status === "deleted") {
        find = {
            deleted: true,
        }
    }
    const countOrders = await Order.countDocuments(find);
    const objectPagination = pag(req.query, countOrders);
    const orders = await Order.find(find)
        .sort({ [sortKey]: sortValue })
        .limit(objectPagination.limitItem)
        .skip(objectPagination.skip);
    // console.log(orders);
    for( const order of orders){
        let total=0;
        order.products.forEach(product => {
            total += product.price * (100-product.discountPercentage)/100 * product.quantity;
        });
        order.total= parseInt(total);
        // console.log(total);
    }
    res.render("admin/pages/order/index", {
        pageTitle: "Trang đơn hàng",
        orders: orders,
        pagination: objectPagination,
        find: find,
        filter: orderStatus
    })
}
// /admin/orders/change-status/:status/:id [PATCH]
module.exports.changeStatus = async (req, res) => {
    const permission = res.locals.role.permission;
    if (permission.includes("orders_edit")) {
        const status = req.params.status;
        const id = req.params.id;
        console.log(id, status)
        const updatedBy = {
            accountId: res.locals.user.id,
            updatedAt: new Date()
        }
        await Order.updateOne(
            {
                _id: id
            },
            { statusOrder: status, $push: { updatedBy: updatedBy } }
        );
        req.flash("success", "Đã cập nhật trạng thái đơn hàng");
        res.redirect(req.get('Referrer'));
    }
    else{
        return
    }
}

// /admin/orders/change-statusPayment/:statusPayment/:id [PATCH]
module.exports.changeStatusPayment= async(req, res) =>{
    // const permission= res.locals.role.permission;        
    // if( permission.includes("orders_edit")){    
        const statusPayment= req.params.statusPayment;
        const id= req.params.id;
        const updatedBy= {
            accountId: res.locals.user.id,
            updatedAt: new Date()
        }
        await Order.updateOne(
            {
                _id: id
            },
            { paymentStatus: statusPayment, $push: { updatedBy: updatedBy } }
        );
        req.flash("success", "Đã cập nhật trạng thái thanh toán đơn hàng");
        res.redirect(req.get('Referrer'));
    // }
    // else {
    //     return;
    // }   
}



// /admin/orders/detail/:id [GET]
module.exports.detail= async(req, res) =>{
    try {
        const order= await Order.findOne({
            _id: req.params.id,
        });
        let total=0;
        for(const product of order.products){
            total += product.price * (100-product.discountPercentage)/100 * product.quantity;
            const productInfo= await Product.findOne({
                _id: product.product_id
            }).select("thumbnail title");
            product.productInfo= productInfo;
        }
        order.total= parseInt(total);
        res.render("admin/pages/order/detail", {
            pageTitle: "Chi tiết đơn hàng",
            order: order,
            products: order.products
        });
    } catch (error) {
        req.flash("error", "Không thể tìm thấy đơn hàng");
        res.redirect(`${systemConfig.prefixAdmin}/orders`);
    }
}

// /admin/orders/delete/:id
module.exports.delete = async(req, res) =>{
    const permission = res.locals.role.permission
    if( permission.includes("orders_delete")){
        const id = req.params.id;
        await Order.updateOne(
            {
                _id: id,
            },
            {
                deleted: true,
                deletedBy: {
                    accountId: res.locals.user.id,
                    deletedAt: new Date(),
                }
            }
        );
        req.flash("success", "Đã xóa đơn hàng");
        res.redirect(req.get('Referrer'));
    }
    else {
        return;
    }
}

// /admin/orders/restore/:id

module.exports.restore= async(req, res) =>{
    const permission = res.locals.role.permission;
    if(permission.includes("orders_edit")){
        const id = req.params.id;
        const updatedBy = {
            accountId: res.locals.user.id,
            updatedAt: new Date()
        }
        await Order.updateOne(
            {_id: id,},
            {
                deleted: false,
                $push: { updatedBy: updatedBy}
            }
        );
        req.flash("success", "Đơn hàng được khôi phục thành công");
        res.redirect(req.get('Referrer'));
    }
    else {
        return;
    }
}

// /admin/orders/edit/:id
// module.exports.edit = async(req, res) =>{
//     try {
//         const record= await Order.findOne({
//             _id: req.params.id
//         });
        
//     } catch (error) {
        
//     }
// }