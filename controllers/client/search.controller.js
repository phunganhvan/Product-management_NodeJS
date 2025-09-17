const productHelper= require("../../helpers/product")
const Product= require("../../models/product.model")
module.exports.index = async (req, res) =>{
    let keyword = req.query.keyword;
    let newProducts = [];
    if(keyword){
        const regex= new RegExp(`${keyword}`,"i");
        const products= await Product.find({
            title: regex,
            deleted: false,
            status: "active"
        });
        console.log(products);
        newProducts= productHelper.priceNew(products);
    }
    res.render('client/pages/search/index', {
        titlePage: "Kết quả tìm kiếm",
        keyword: keyword,
        products: newProducts
    })
}