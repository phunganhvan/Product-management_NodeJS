const categoryMiddleware= require("../../middlewares/client/category.middleware")

const productRoute= require('./product.route');
const HomeRoute = require('./home.route');
const searchRoute = require('./search.route');
const cartMiddleware = require("../../middlewares/client/cart.middleware");
const cartRoute= require('./cart.route');
const checkoutRoute = require('./checkout.route');
const userRoute= require('./user.route');
const chatRoute= require("./chat.route");
const usersRoute= require("./users.route");
const roomsChatRoute = require("./rooms-chat.route");
const settingMiddleware= require("../../middlewares/client/setting.middleware");
const userMiddleware= require('../../middlewares/client/user.middleware');
const authMiddleware= require("../../middlewares/client/auth.middlewares");
module.exports = (app) => {
    app.use(categoryMiddleware.category);
    app.use(settingMiddleware.settingGeneral);
    app.use(cartMiddleware.cartId);
    app.use(userMiddleware.infoUser);
    app.use(userMiddleware.connect);
    
    app.use('/',HomeRoute);
    app.use('/products' ,productRoute);
    app.use('/search',searchRoute);
    app.use('/cart', cartRoute);
    app.use('/checkout', checkoutRoute);
    app.use('/user', userRoute);
    app.use('/chat', authMiddleware.requireAuth, chatRoute);
    app.use('/users', authMiddleware.requireAuth, usersRoute);
    app.use('/rooms-chat', roomsChatRoute);
}