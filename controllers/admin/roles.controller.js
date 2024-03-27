const Role = require('../../model/roles.model');
const systemConfig = require('../../config/system');

module.exports.index = async(req, res) => {
    if(res.locals.role.permissions.includes("roles_view")){
        const roles = await Role.find({deleted:false});
        res.render('admin/pages/roles/index', {
            pageTitle: "Trang nhóm quyền",
            records: roles
        })
    } else {
        req.flash("error", "Bạn không sở hữu quyền truy cập vào trang này!");
        res.redirect("back");
    }
}

module.exports.create = async(req, res) => {
    if(res.locals.role.permissions.includes("roles_create")){
        res.render('admin/pages/roles/create', {
            pageTitle: "Thêm mới nhóm quyền"
        })
    } else {
        req.flash("error", "Bạn không sở hữu quyền thực hiện chức năng này!");
        res.redirect("back");
    }
}

module.exports.createPost = async(req, res) => {
    if(res.locals.role.permissions.includes("roles_create")){
        const role = new Role(req.body);
        await role.save();

        req.flash("success", "Thêm mới nhóm quyền thành công!");

        res.redirect(`/${systemConfig.prefixAdmin}/roles`);
    } else {
        req.flash("error", "Bạn không sở hữu quyền thực hiện chức năng này!");
        res.redirect("back");
    }
}

module.exports.edit = async(req, res) => {
    if(res.locals.role.permissions.includes("roles_edit")){
        try {
            const id = req.params.id;
            const role = await Role.findOne({
                _id: id,
                deleted: false
            })
            res.render("admin/pages/roles/edit",{
                pageTitle: "Trang chỉnh sửa nhóm quyền",
                record: role
            });
        } catch (error) {
            res.redirect(`/${systemConfig.prefixAdmin}/roles`);
        }
    } else {
        req.flash("error", "Bạn không sở hữu quyền thực hiện chức năng này!");
        res.redirect("back");
    }
}

module.exports.editPatch = async(req, res) => {
    if(res.locals.role.permissions.includes("roles_create")){
        try {
            const id = req.params.id;
            await Role.updateOne({
                _id: id,
                deleted: false
            }, req.body)

            req.flash("success", "Cập nhật nhóm quyền thành công!");

            res.redirect(`/${systemConfig.prefixAdmin}/roles`);
        } catch (error) {
            res.redirect(`/${systemConfig.prefixAdmin}/roles`);
        }
    } else {
        req.flash("error", "Bạn không sở hữu quyền thực hiện chức năng này!");
        res.redirect("back");
    }
}

module.exports.permissions = async (req, res) => {
    if(res.locals.role.permissions.includes("roles_permissions")){
        const roles = await Role.find({
        deleted: false
        });
    
        res.render("admin/pages/roles/permissions", {
        pageTitle: "Phân quyền",
        records: roles
        });
    } else {
        req.flash("error", "Bạn không sở hữu quyền thực hiện chức năng này!");
        res.redirect("back");
    }
}

module.exports.permissionsPatch = async (req, res) => {
    if(res.locals.role.permissions.includes("roles_permissions")){
        try {
            const roles = JSON.parse(req.body.roles);
            for(const role of roles){
                await Role.updateOne({
                    _id: role.id
                },{
                    permissions: role.permissions
                })
            };

            req.flash("success", "Cập nhật phân quyền thành công!")
        } catch (error) {
            req.flash("error", "Cập nhật phân quyền không thành công!")
        }

        res.redirect("back");
    } else {
        req.flash("error", "Bạn không sở hữu quyền thực hiện chức năng này!");
        res.redirect("back");
    }
}