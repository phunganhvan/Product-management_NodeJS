const Product = require('../../models/product.model')

module.exports.index = async (req, res) =>{
    const products = await Product.find({
        status: "active",
        deleted: false,
    }).sort({position: "desc"});
    
    const newProducts = products.map(item => {
        item.priceNew = (item.price * (100 - item.discountPercentage) / 100).toFixed();
        return item;
    });
    res.render('client/pages/products/index', {
        titlePage: "Sản phẩm",
        products: newProducts
    });
}

module.exports.detail = async(req, res) =>{
    try {
        const slug= req.params.slug;
        const find ={
            deleted: false,
            status: "active",
            slug: slug
        };
        const product= await Product.findOne(find);
        // console.log(product.status)
        res.render('client/pages/products/detail', {
            titlePage: "Chi tiết sản phẩm",
            product: product
        })
    } catch (error) {
        res.redirect('/products');
    }
}