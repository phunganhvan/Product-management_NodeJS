const ProductCategory = require("../../models/product-category.model")
const createTreeHelper = require("../../helpers/create-tree")
module.exports.category = async (req, res, next) => {

    let find = {
        deleted: false,
    };
    const records = await ProductCategory.find(find)
    const newProductsCategory = createTreeHelper.create(records);
    res.locals.layoutProductCategory = newProductsCategory;
    next();
}