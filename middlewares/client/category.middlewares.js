const ProductCategory = require('../../model/products-category.model');
const createTreeHelper = require('../../helpers/create-tree.helper');

module.exports.category = async (req, res, next) => {
    const productsCategory = await ProductCategory.find({
        deleted: false
    })

    const productsCategoryTree = createTreeHelper(productsCategory);

    res.locals.layoutProductsCategory  = productsCategoryTree;

    next();
}