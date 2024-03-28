const User = require('../../model/users.model');
const ForgotPassword = require('../../model/forgot-password.model');
const Cart = require("../../model/carts.model");
const md5 = require("md5");
const generateHelper = require('../../helpers/generate.helper');
const sendMailHelper = require('../../helpers/send-mail.helper');

module.exports.register = async (req, res) => {
    try {
        res.render("client/pages/user/register", {
            pageTitle: "Đăng ký tài khoản",
        });
    } catch (error) {
        res.render("client/pages/error/404", {
            pageTitle: "404 Not Found",
          });
    }
    
};

module.exports.registerPost = async (req, res) => {
    try {
        const existUser = await User.findOne({
            email: req.body.email
        });
    
        if(existUser) {
            req.flash("error", "Email đã tồn tại!");
            res.redirect("back");
            return;
        }
    
        const infoUser = {
            fullName: req.body.fullName,
            email: req.body.email,
            password: md5(req.body.password),
            tokenUser: generateHelper.generateRandomString(30)
        };
    
        const user = new User(infoUser);
        await user.save();
    
        res.cookie("tokenUser", user.tokenUser);
    
        req.flash("success", `Xin chào ${user.fullName}!`)
    
        res.redirect("/");
    } catch (error) {
        res.render("client/pages/error/404", {
            pageTitle: "404 Not Found",
          });
    }
    
};

module.exports.login = async (req, res) => {
    try {
        res.render("client/pages/user/login", {
            pageTitle: "Đăng nhập",
        });
    } catch (error) {
        res.render("client/pages/error/404", {
            pageTitle: "404 Not Found",
          });
    }
    
};
  
module.exports.loginPost = async (req, res) => {
    try {
        const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
        email: email,
        deleted: false,
    });

    if (!user) {
        req.flash("error", "Email không tồn tại!");
        res.redirect("back");
        return;
    }

    if (md5(password) !== user.password) {
        req.flash("error", "Sai mật khẩu!");
        res.redirect("back");
        return;
    }

    if (user.status !== "active") {
        req.flash("error", "Tài khoản đang bị khóa!");
        res.redirect("back");
        return;
    }

    res.cookie("tokenUser", user.tokenUser);

    await Cart.updateOne({
        _id: req.cookies.cartId
    }, {
        user_id: user.id
    })

    req.flash("success", `Xin chào ${user.fullName}!`)

    res.redirect("/");
    } catch (error) {
        res.render("client/pages/error/404", {
            pageTitle: "404 Not Found",
          });
    }
    
}

module.exports.logout = async (req, res) => {
    try {
        res.clearCookie("tokenUser");
    res.redirect("/");
    } catch (error) {
        res.render("client/pages/error/404", {
            pageTitle: "404 Not Found",
          });
    }
    
};

module.exports.forgotPassword = async(req, res) => {
    try {
        res.render('client/pages/user/forgot-password', {
            pageTitle: "Lấy lại mật khẩu"
        });
    } catch (error) {
        res.render("client/pages/error/404", {
            pageTitle: "404 Not Found",
          });
    }
    
}

module.exports.forgotPasswordPost = async(req, res) => {
    try {
        const email = req.body.email;
    
    const user = await User.findOne({
        email: email
    })

    if(!user){
        req.flash("error", "Email không tồn tại!");
        res.redirect("back");
        return;
    }

    const existRecord = await ForgotPassword.findOne({
        email: email
    })

    const otp = generateHelper.generateRandomNumber(8);

    if(existRecord){
        await ForgotPassword.updateOne({
            email: email
        }, {
            otp: otp
        })
    }
    
    else{
        const objectForgotPassword = {
            email: email,
            otp: otp,
        }

        const record = new ForgotPassword(objectForgotPassword);
        await record.save();    
    }

    const subject = "Mã OTP lấy lại mật khẩu";
    const content = `Mã OTP của bạn là <b>${otp}</b>. Vui lòng không chia sẻ với bất cứ ai`
    sendMailHelper.sendMail(email, subject, content);
    
    res.redirect(`/user/password/otp?email=${email}`);
    } catch (error) {
        res.render("client/pages/error/404", {
            pageTitle: "404 Not Found",
          });
    }
    
}

module.exports.otpPassword = async(req, res) => {
    try {
        const email = req.query.email;

    res.render("client/pages/user/password-otp",{
        pageTitle: "Nhập mã otp",
        email: email
    });
    } catch (error) {
        res.render("client/pages/error/404", {
            pageTitle: "404 Not Found",
          });
    }
    
}

module.exports.otpPasswordPost = async(req, res) => {
    try {
        const email = req.body.email;
    const otp = req.body.otp;

    const record = await ForgotPassword.findOne({
        email: email
    })

    if(!record){
        req.flash("error", "Mã otp đã hêt hạn, vui lòng thao tác lại để nhận mã otp mới!");
        res.redirect("/user/password/forgot");
        return;
    }

    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    })

    if(!result){
        req.flash("error", "Nhập sai mã otp, vui lòng nhập lại!");
        res.redirect("back");
        return;
    }

    const user = await User.findOne({
        email: email
    });
    
        res.cookie("tokenUser", user.tokenUser);
        
        res.redirect(`/user/password/reset`);
    } catch (error) {
        res.render("client/pages/error/404", {
            pageTitle: "404 Not Found",
          });
    }
    
}

module.exports.resetPassword = async(req, res) => {
    try {
        res.render("client/pages/user/reset-password", {
            pageTitle: "Đổi mật khẩu"
        })
    } catch (error) {
        res.render("client/pages/error/404", {
            pageTitle: "404 Not Found",
          });
    }
    
}

module.exports.resetPasswordPost = async(req, res) => {
    const password = req.body.password;
    const tokenUser = req.cookies.tokenUser;

    try {
        await User.updateOne({
            tokenUser: tokenUser
        },{
            password: md5(password)
        });

        res.redirect("/");
    } catch (error) {
        res.redirect("back");
    }
}

module.exports.info = async (req, res) => {
    try {
        res.render("client/pages/user/info", {
            pageTitle: "Thông tin tài khoản"
        });
    } catch (error) {
        res.render("client/pages/error/404", {
            pageTitle: "404 Not Found",
          });
    }
};