const Product = require("../models/product.model")
module.exports.checkQuantity = async(productId, newQuantity) => {
    const product = await Product.findOne({
        _id: productId
    }).select("stock");
    newQuantity= parseInt(newQuantity);
    if (newQuantity > product.stock || newQuantity <1 || !Number.isInteger(newQuantity)) {
        return false; 
    } 
    else return true;
}