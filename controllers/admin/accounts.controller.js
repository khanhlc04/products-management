const Account = require('../../model/accounts.model');
const Role = require('../../model/roles.model');
const systemConfig = require('../../config/system');
const generateHelper = require('../../helpers/generate.helper');
const md5 = require('md5');

module.exports.index = async(req, res) => {
    try {
        if(res.locals.role.permissions.includes("accounts_view")){
            const accounts = await Account.find({deleted: false});
    
            for (const account of accounts) {
                const role = await Role.findOne({
                    _id: account.role_id,
                    deleted: false
                });
                account.role = role;
            }
        
            res.render("admin/pages/accounts/index",{
                pageTitle: "Danh sách tài khoản",
                records: accounts
            })
        } else {
            req.flash("error", "Bạn không sở hữu quyền truy cập vào trang này!");
            res.redirect("back");
        }
    } catch (error) {
        res.redirect("back");
    }
}

module.exports.create = async(req, res) => {
    try {
        if(res.locals.role.permissions.includes("accounts_create")){
            const roles = await Role.find({deleted: false});
    
            res.render("admin/pages/accounts/create", {
                pageTitle: "Thêm mới tài khoản",
                roles: roles
            })
        } else {
            req.flash("error", "Bạn không sở hữu quyền thực hiện chức năng này!");
            res.redirect("back");
        }
    } catch (error) {
        res.redirect("back");
    }
}

module.exports.createPost = async(req, res) => {
    try {
        if(res.locals.role.permissions.includes("accounts_create")){
            req.body.token = generateHelper.generateRandomString(30);
            req.body.password = md5(req.body.password);
        
            if(req.file){
                req.body.avatar = `/uploads/${req.file.filename}`;
            }
        
            const account = new Account(req.body);
            account.save();
            req.flash("success", "Tạo tài khoản thành công");
            res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
        } else {
            req.flash("error", "Bạn không sở hữu quyền thực hiện chức năng này!");
            res.redirect("back");
        }
    } catch (error) {
        res.redirect("back");
    }
}

module.exports.edit = async (req, res) => {
    try {
        if(res.locals.role.permissions.includes("accounts_create")){
            try {
                const account = await Account.findOne({
                    _id: req.params.id,
                    deleted: false
                });
        
                const roles = await Role.find({
                    deleted: false,
                });
        
                res.render("admin/pages/accounts/edit", {
                    pageTitle: "Chỉnh sửa tài khoản",
                    data: account,
                    roles: roles,
                });
            } catch (error) {
                res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
            }
        } else {
            req.flash("error", "Bạn không sở hữu quyền thực hiện chức năng này!");
            res.redirect("back");
        }
    } catch (error) {
        res.redirect("back");
    }
    
};
  
module.exports.editPatch = async (req, res) => {
    try {
        if(res.locals.role.permissions.includes("accounts_create")){
            try {
                const id = req.params.id;
        
                if(req.file){
                    req.body.avatar = `/uploads/${req.file.filename}`;
                }
            
                if(req.body.password) {
                    req.body.password = md5(req.body.password);
                } else {
                    delete req.body.password;
                }
                
                await Account.updateOne({
                    _id: id
                }, req.body);
                
                req.flash("success", "Cập nhật tài khoản thành công!");
        
                res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
            } catch (error) {
                res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
            }
        } else {
            req.flash("error", "Bạn không sở hữu quyền thực hiện chức năng này!");
            res.redirect("back");
        }
    } catch (error) {
        res.redirect("back");
    }
}