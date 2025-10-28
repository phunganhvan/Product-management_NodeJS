const ProductCategory = require("../../models/product-category.model")
const BlogCategory = require("../../models/blog-category.model");
const createTreeHelper = require("../../helpers/create-tree")
module.exports.category = async (req, res, next) => {

    let find = {
        deleted: false,
    };
    const productCategory = await ProductCategory.find(find);
    const blogCategory = await BlogCategory.find(find);

    const newProductsCategory = createTreeHelper.create(productCategory);
    const newBlogCategory = createTreeHelper.create(blogCategory);
    res.locals.layoutProductCategory = newProductsCategory;
    res.locals.layoutBlogCategory= newBlogCategory
    next();
}