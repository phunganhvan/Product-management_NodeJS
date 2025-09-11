const categoryMiddleware= require("../../middlewares/client/category.middleware")

const productRoute= require('./product.route');
const HomeRoute = require('./home.route');
module.exports = (app) => {
    app.use(categoryMiddleware.category)
    app.use('/',HomeRoute);
    app.use('/products' ,productRoute);
}