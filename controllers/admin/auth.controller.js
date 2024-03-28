const Account = require("../../model/accounts.model");
const systemConfig = require("../../config/system");
const md5 = require('md5');

module.exports.login = async(req, res) => {
    try {
        res.render("admin/pages/auth/login",{
            pageTitle: "Trang đăng nhập"
        })
    } catch (error) {
        res.render("client/pages/error/404",{
            pageTitle: "404"
        })
    }
}

module.exports.loginPost = async(req, res) => {
    try {
        const user = await Account.findOne({
            email: req.body.email,
            deleted: false
        })
    
        if(!user){
            req.flash("error", "email không tồn tại");
            res.redirect('back');
            return;
        }
    
        if(user.password != md5(req.body.password)){
            req.flash("error", "Mật khẩu sai, vui lòng nhập lại");
            res.redirect("back");
            return;
        }
    
        if(user.status != "active"){
            req.flash("error", "Tài khoản đang bị khóa");
            res.redirect("back");
            return;
        }
    
        res.cookie("token", user.token);
    
        res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);
    } catch (error) {
        res.render("client/pages/error/404",{
            pageTitle: "404"
        })
    }
}

module.exports.logout = async(req, res) => {
    try {
        res.clearCookie("token");

        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
    } catch (error) {
        res.redirect("back");
    }
    
}