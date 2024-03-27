const Cart = require('../../model/carts.model');
const Product = require('../../model/products.model');
const Order = require('../../model/orders.model')

module.exports.index = async(req, res) => {
    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({
        _id: cartId
    })

    if(cart){
        cart.totalPrice = 0;

        for(const item of cart.products){
            const product = await Product.findOne({
                _id: item.product_id,
                status: "active",
                deleted: false
            }).select("thumbnail title slug price discountPercentage");

            product.priceNew = (product.price * (100 - product.discountPercentage)/100).toFixed(0);

            item.productInfo = product;
      
            item.totalPrice = item.quantity * product.priceNew;
      
            cart.totalPrice += item.totalPrice;
        }
    }

    res.render('client/pages/checkout/index',{
        pageTitle: "Trang mua hàng",
        cartDetail: cart
    });
}

module.exports.orderPost = async(req, res) => {
    const cartId = req.cookies.cartId;

    try {
        const userInfo = req.body;
    
        const cart = await Cart.findOne({
            _id: cartId
        })
    
        const productsOrder = [];
    
        if(cart.products.length > 0){
            for(const item of cart.products){
                const product = await Product.findOne({
                    _id: item.product_id,
                    status: "active",
                    deleted: false
                })

                const objectProduct = {
                    product_id: product.id,
                    price: product.price,
                    discountPercentage: product.discountPercentage,
                    quantity: item.quantity
                }
    
                productsOrder.push(objectProduct);
            }

            const orderInfo = {
                cartId: cartId,
                userInfo: userInfo,
                products: productsOrder
            }

            const order = new Order(orderInfo);
            await order.save();

            await Cart.updateOne({
                _id: cartId
            }, {
                products: []
            });
    
            res.redirect(`/checkout/success/${order.id}`);
        } else {
            req.flash("erorr", "Bạn không có sản phẩm nào trong giỏ hàng!");
        }

    } catch (error) {
        req.flash("erorr", "Đặt hàng không thành công!");
        res.redirect('back');
    }
}

module.exports.success = async (req, res) => {
    const order = await Order.findOne({
      _id: req.params.orderId
    });
  
    order.totalPrice = 0;
  
    for (const product of order.products) {
            const infoProduct = await Product.findOne({
            _id: product.product_id,
            deleted: false,
            status: "active"
        });
  
        product.title = infoProduct.title;
        product.thumbnail = infoProduct.thumbnail;
    
        product.priceNew = (product.price * (100 - product.discountPercentage)/100).toFixed(0);
    
        product.totalPrice = product.priceNew * product.quantity;
    
        order.totalPrice += product.totalPrice;
    }
  
    res.render("client/pages/checkout/success", {
        pageTitle: "Đặt hàng thành công",
        order: order
    });
  };