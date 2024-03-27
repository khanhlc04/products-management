const Product = require('../../model/products.model');
const ProductCategory = require('../../model/products-category.model');
const ProductsCategory = require('../../model/products-category.model');
const subCategoryHelper = require('../../helpers/sub-category.helper');

module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    }).sort({
        position: "desc"
    });

    for(const item of products) {
        item.newPrice = parseInt(item.price - item.price * item.discountPercentage / 100).toFixed(0);
    }

    res.render('client/pages/products/index', {
        pageTitle: "Danh sách sản phẩm",
        products: products
    });
}

module.exports.detail = async (req, res) => {
    try {
        const slugProduct = req.params.slugProduct;

        const product = await Product.findOne({
            slug: slugProduct,
            deleted: false,
            status: "active"
        });

        product.priceNew = (product.price * (100 - product.discountPercentage)/100).toFixed(0);

        if(product.product_category_id) {
            const category = await ProductCategory.findOne({
            _id: product.product_category_id
        });

            product.category = category;
        }

        res.render("client/pages/products/detail", {
            pageTitle: "Trang chi tiết sản phẩm",
            product: product
        });
    } catch (error) {
        res.redirect("back");
    }
}

module.exports.category = async(req, res) => {
    try {
        const slugCategory = req.params.slugCategory;
        
        const productCategory = await ProductCategory.findOne({
            deleted: false,
            status: "active",
            slug: slugCategory
        })

        const allCategory = await subCategoryHelper(productCategory.id);

        const allCategoryIds = allCategory.map(item => item.id);

        const products = await Product.find({
            deleted: false,
            status: "active",
            product_category_id: {
                $in: [
                    productCategory.id,
                    ...allCategoryIds
                ]
            }
        }).sort({ position: "desc" });


        for (const item of products) {
            item.newPrice= (item.price * (100 - item.discountPercentage)/100).toFixed(0);
        }


        res.render('client/pages/products/index', {
            pageTitle: "Danh sách sản phẩm",
            products: products
        });

    } catch (error) {
        res.redirect("back");
    }
}