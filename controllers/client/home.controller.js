// [GET] / 
const Product= require("../../models/product.model")
const productHelper= require("../../helpers/product")
module.exports.index =async(req, res) => {
    
    const find={
        featured: "1",
        deleted: false,
        status: "active",
    }
    const productsFeatured= await Product.find(find).limit(6);
    const newProducts = productHelper.priceNew(productsFeatured)
    const productNew= await Product.find({
        deleted: false,
        status: "active"
    }).sort({position: "desc"}).limit(6);

    const newProductNew= productHelper.priceNew(productNew)
    // console.log(newProductsCatagory)
    res.render('client/pages/Home/index', {
        titlePage: "Trang chủ",
        productsFeatured: newProducts,
        productsNew: newProductNew
    });
}