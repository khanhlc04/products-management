const Product = require('../../model/products.model');

module.exports.index = async (req, res) => {
    try {
        const keyword = req.query.keyword;

        if(keyword){
            const title = new RegExp(keyword, "i");

            const products = await Product.find({
                deleted: false,
                status: "active",
                title: title
            }).sort({position: "desc"}).limit(6);

            for(const item of productsFeatured)
                item.priceNew = (item.price * (100 - item.discountPercentage)/100).toFixed(0);

            res.render("client/pages/search/index", {
                pageTitle: "Kết quả tìm kiếm",
                keyword: keyword,
                products: products
              });
        } else{
            const url = new URL(window.location.href);
            url.searchParams.delete("keyword");
            window.location.href = url.href;
        }
    } catch (error) {
        res.redirect("/products")
    }
    
}