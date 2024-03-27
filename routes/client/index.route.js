const homeRouter = require('./home.route');
const productsRouter = require('./products.route');
const searchRouter = require('./search.route');
const cartRouter = require('./cart.route');
const checkoutRouter = require('./checkout.route');
const userRouter = require('./user.router');
const chatRouter = require('./chat.route');
const usersRouter = require('./users.router');
const roomsChatRouter = require('./rooms-chat.route')

const categoryMiddleware = require('../../middlewares/client/category.middlewares');
const cartMiddleware = require('../../middlewares/client/cart.middlewares');
const userMiddleware = require('../../middlewares/client/user.middlewares');
const settingMiddleware = require("../../middlewares/client/setting.middlewares");
const authMiddleware = require("../../middlewares/client/auth.middlewares");

module.exports = (app) => {
    app.use(settingMiddleware.settingGeneral);
    app.use(categoryMiddleware.category);
    app.use(cartMiddleware.cart);
    app.use(userMiddleware.infoUser);
    app.use('/', homeRouter);
    app.use('/products', productsRouter);
    app.use("/search", searchRouter);
    app.use("/cart", cartRouter);
    app.use("/checkout", checkoutRouter);
    app.use("/user", userRouter);
    app.use("/chat", authMiddleware.requireAuth, chatRouter);
    app.use("/users", authMiddleware.requireAuth, usersRouter);
    app.use("/rooms-chat", authMiddleware.requireAuth, roomsChatRouter);
}