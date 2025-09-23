const Product = require("../models/product.model")
module.exports.checkQuantity = async(productId, newQuantity) => {
    const product = await Product.findOne({
        _id: productId
    }).select("stock");
    if (newQuantity > product.stock) {
        return false; 
    } 
    else return true;
}