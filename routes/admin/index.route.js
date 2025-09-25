const dashboardRoutes = require("./dashboard.route");
const productRoutes= require("./product.route");
const productCategoryRoutes = require("./product-category.route");
const rolesRoutes= require("./roles.route")
const accountsRoutes= require("./accounts.route");
const settingRoutes = require("./setting.route");
const authRoutes= require("../../routes/admin/auth.route")
const myAccountRoutes= require("../../routes/admin/my-account.route") 
const PATH = require("../../config/system");
const authMiddleware= require("../../middlewares/admin/auth.middlewares")

// console.log(PATH);
module.exports = (app) => {
    const PATH_ADMIN= "/admin";
    app.use(PATH.prefixAdmin+ '/dashboard',authMiddleware.requireAuth, dashboardRoutes);
    app.use(PATH.prefixAdmin + "/product", authMiddleware.requireAuth , productRoutes);
    app.use(PATH.prefixAdmin + "/product-category", authMiddleware.requireAuth , productCategoryRoutes);
    app.use(PATH.prefixAdmin + "/roles", authMiddleware.requireAuth , rolesRoutes);
    app.use(PATH.prefixAdmin + "/accounts", authMiddleware.requireAuth , accountsRoutes)
    app.use(PATH.prefixAdmin + "/auth", authRoutes)
    app.use(PATH.prefixAdmin +"/my-account", authMiddleware.requireAuth, myAccountRoutes)
    app.use(PATH.prefixAdmin + "/settings", authMiddleware.requireAuth, settingRoutes)
}