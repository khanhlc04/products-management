const Cart = require('../../model/carts.model');
const Product = require('../../model/products.model');

module.exports.index = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            _id: req.cookies.cartId
        })
    
        if(cart){
            cart.totalPrice = 0;
            
            for (const item of cart.products) {
                const product = await Product.findOne({
                    deleted: false,
                    status: "active",
                    _id: item.product_id
                }).select("thumbnail title slug price discountPercentage");
                product.priceNew = (product.price * (100 - product.discountPercentage)/100).toFixed(0);
      
                item.productInfo = product;
          
                item.totalPrice = item.quantity * product.priceNew;
          
                cart.totalPrice += item.totalPrice;
            }
        }
    
        res.render("client/pages/cart/index", {
            pageTitle: "Giỏ hàng",
            cartDetail: cart
        });
    } catch (error) {
        res.render("client/pages/error/404", {
            pageTitle: "404 Not Found",
          });
    }
    
}

module.exports.addPost = async (req, res) => {
    const productId = req.params.productId;
    const quantity = req.body.quantity;
    const cartId = req.cookies.cartId;

    try {
        const cart = await Cart.findOne({
            _id: cartId
        })

        const existProductInCart = cart.products.find(item => item.product_id == productId);


        if(existProductInCart){
            const newQuantity = existProductInCart.quantity + quantity;

            await Cart.updateOne({
                _id: cartId,
                "products.product_id": productId
            }, {
                $set:{"products.$.quantity": newQuantity}
            })
        } else {
            const objectCart = {
                product_id: productId,
                quantity: quantity
            }

            await Cart.updateOne({
                _id: cartId,
            }, {
                $push:{products: objectCart}
            })
        }

        req.flash("success", "Thêm sản phẩm vào giỏ hàng thành công");

        res.redirect("back");
    } catch (error) {
        req.flash("error", "Thêm sản phẩm vào giỏ hàng không thành công!")
    }
}

module.exports.delete = async(req, res) => {
    try {
        const productId = req.params.productId;

        await Cart.updateOne({
            _id: req.cookies.cartId
        },{
            $pull:{products: {product_id: productId}}
        })

        req.flash("success", "Xóa sản phẩm thành công")

        res.redirect("back");
    } catch (error) {
        req.flash("success", "Xóa sản phẩm không thành công")
    }
}