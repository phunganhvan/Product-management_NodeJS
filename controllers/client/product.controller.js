const Product = require('../../models/product.model')
const productHelper= require("../../helpers/product")
const ProductCategory= require("../../models/product-category.model")
const getSubCategoryHelper= require("../../helpers/products-category")
module.exports.index = async (req, res) =>{
    const products = await Product.find({
        status: "active",
        deleted: false,
    }).sort({position: "desc"});
    
    const newProducts = productHelper.priceNew(products)
    res.render('client/pages/products/index', {
        titlePage: "Danh sách sản phẩm",
        products: newProducts
    });
}

module.exports.detail = async(req, res) =>{
    try {
        const slug= req.params.slugProduct;
        const find ={
            deleted: false,
            status: "active",
            slug: slug
        };
        const product= await Product.findOne(find);

        if(product.product_category_id){
            const category= await ProductCategory.findOne({
                _id: product.product_category_id,
                status: "active",
                deleted: false
            })
            if(category){
                product.category= category;
            }
        }
        const newProduct= productHelper.priceNewProduct(product)

        // console.log(product.status)
        res.render('client/pages/products/detail', {
            titlePage: "Chi tiết sản phẩm",
            product: newProduct
        })
    } catch (error) {
        res.redirect('/products');
    }
}


module.exports.category = async(req, res) =>{
    const slug= req.params.slugCategory;
    const category= await ProductCategory.findOne({
        slug: slug,
        status: "active",
        deleted: false
    });



    const listSub= await getSubCategoryHelper.getSubCategory(category.id)
    const listSubCategoryId= listSub.map(item => item.id)
    const products= await Product.find({
        deleted: false,
        product_category_id: {$in: [category.id, ...listSubCategoryId]}
    }).sort({position: "desc"})
    
    const newProducts= productHelper.priceNew(products)
    // console.log(category)
    res.render("client/pages/products/index", {
        titlePage: category.title,
        products: newProducts
    })
}