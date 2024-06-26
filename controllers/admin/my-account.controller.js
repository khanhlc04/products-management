const Account = require('../../model/accounts.model');
const systemConfig = require('../../config/system');

module.exports.index = async(req, res) => {
    try {
        res.render("admin/pages/my-account/index", {
            pageTitle: "Trang cá nhân",
        })
    } catch (error) {
        res.redirect("back");
    }
}

module.exports.edit = async(req, res) => {
    try {
        res.render("admin/pages/my-account/edit", {
            pageTitle: "Chỉnh sửa thông tin cá nhân",
        })
    } catch (error) {
        res.redirect("back")
    }
    
}

module.exports.editPatch = async(req, res) => {
    try {
        if(req.file){
            req.body.avatar = `/uploads/${req.file.filename}`;
        }
    
        if(req.body.password) {
            req.body.password = md5(req.body.password);
        } else {
            delete req.body.password;
        }
        
        await Account.updateOne({
            _id: res.locals.user.id
        }, req.body);
    
        console.log(req.body);
        
        req.flash("success", "Cập nhật tài khoản thành công!");
    
        res.redirect(`/${systemConfig.prefixAdmin}/my-account`);
    } catch (error) {
        res.redirect("back");
    }
}
