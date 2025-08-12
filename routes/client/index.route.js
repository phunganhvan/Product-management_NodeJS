const productRoute= require('./product.route');
const HomeRoute = require('./home.route');
module.exports = (app) => {
    app.use('/', HomeRoute);
    app.use('/products', productRoute);
    app
}