const dashboardRouter = require('./dashboard.route');
const productsRouter = require('./products.route');
const productsCategoryRouter = require('./products-category.route');
const accountsRouter = require('./accounts.route');
const myAccountsRouter = require('./my-accounts.route');
const authRouter = require('./auth.route');
const rolesRouter = require('./roles.route');
const settingRouter = require('./settings.route');
const systemConfig = require('../../config/system');
const authMiddleware = require("../../middlewares/admin/auth.middlewares");

module.exports = (app) => {
    const PATH_ADMIN = `/${systemConfig.prefixAdmin}`;

    app.use(
        `${PATH_ADMIN}/dashboard`,
        authMiddleware.requireAuth,
        dashboardRouter
    );

    app.use(
        `${PATH_ADMIN}/products`,
        authMiddleware.requireAuth,
        productsRouter
    );

    app.use(
        `${PATH_ADMIN}/products-category`,
        authMiddleware.requireAuth,
        productsCategoryRouter
    );

    app.use(
        `${PATH_ADMIN}/roles`,
        authMiddleware.requireAuth,
        rolesRouter
    );

    app.use(
        `${PATH_ADMIN}/accounts`,
        authMiddleware.requireAuth,
        accountsRouter);
        
    app.use(`${PATH_ADMIN}/auth`, authRouter);

    app.use(
        `${PATH_ADMIN}/my-account`,
        authMiddleware.requireAuth,
        myAccountsRouter);

    app.use(
        `${PATH_ADMIN}/settings`,
        authMiddleware.requireAuth,
        settingRouter
    );
}