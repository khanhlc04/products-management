const Product = require('../../model/products.model');

module.exports.index = async (req, res) => {
    try {
        const productsFeatured = await Product.find({
            deleted: false,
            status: "active",
            featured: "1"
        }).sort({position:"desc"}).limit(6);
    
        for(const item of productsFeatured)
            item.priceNew = (item.price * (100 - item.discountPercentage)/100).toFixed(0);
    
        const productsNew = await Product.find({
            deleted: false,
            status: "active"
        }).sort({position: "desc"}).limit(6);
    
        for(const item of productsNew)
            item.priceNew = (item.price * (100 - item.discountPercentage)/100).toFixed(0);
    
        res.render('client/pages/home/index', {
            pageTitle: "Trang chủ",
            productsFeatured: productsFeatured,
            productsNew: productsNew
        });
    } catch (error) {
        res.render("client/pages/error/404", {
            pageTitle: "404 Not Found",
          });
    }
    
}