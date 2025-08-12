const dashboardRoutes = require("./dashboard.route");
const productRoutes= require("./product.route");
const PATH = require("../../config/system");
// console.log(PATH);
module.exports = (app) => {
    const PATH_ADMIN= "/admin";
    app.use(PATH.prefixAdmin+ '/dashboard', dashboardRoutes);
    app.use(PATH.prefixAdmin + "/product", productRoutes);
}