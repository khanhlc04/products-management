const Product = require("../../model/products.model");
const ProductCategory = require("../../model/products-category.model");
const Account = require("../../model/accounts.model");
const User = require("../../model/users.model");

module.exports.index = async (req, res) => {
    try {
        const statistic = {
            productCategory: {
                total: 0,
                active: 0,
                inactive: 0,
            },
            product: {
                total: 0,
                active: 0,
                inactive: 0,
            },
            account: {
                total: 0,
                active: 0,
                inactive: 0,
            },
            user: {
                total: 0,
                active: 0,
                inactive: 0,
            },
        };
    
        statistic.product.total = await Product.countDocuments({
            deleted: false
        });
        statistic.product.active = await Product.countDocuments({
            status: "active",
            deleted: false
        });
        statistic.product.inactive = await Product.countDocuments({
            status: "inactive",
            deleted: false
        });
    
        statistic.productCategory.total = await ProductCategory.countDocuments({
            deleted: false
        });
        statistic.productCategory.active = await ProductCategory.countDocuments({
            status: "active",
            deleted: false
        });
        statistic.productCategory.inactive = await ProductCategory.countDocuments({
            status: "inactive",
            deleted: false
        });
    
        statistic.account.total = await Account.countDocuments({
            deleted: false
        });
        statistic.account.active = await Account.countDocuments({
            status: "active",
            deleted: false
        });
        statistic.account.inactive = await Account.countDocuments({
            status: "inactive",
            deleted: false
        });
    
        statistic.user.total = await User.countDocuments({
            deleted: false
        });
        statistic.user.active = await User.countDocuments({
            status: "active",
            deleted: false
        });
        statistic.user.inactive = await User.countDocuments({
            status: "inactive",
            deleted: false
        });
    
        res.render("admin/pages/dashboard/index", {
            pageTitle: "Trang tổng quan",
            statistic: statistic
        });
    } catch (error) {
        res.redirect("back");
    }
    
}