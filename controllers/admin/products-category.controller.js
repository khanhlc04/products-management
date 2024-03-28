const systemConfig = require('../../config/system');
const ProductCategory = require('../../model/products-category.model');
const createTreeHelper = require('../../helpers/create-tree.helper');

module.exports.index = async (req, res) => {
    try {
        if(res.locals.role.permissions.includes("products-category_view")){
            const productsCategory = await ProductCategory.find({
                deleted: false
            })
        
            res.render('admin/pages/products-category/index',{
                pageTitle: "Danh mục sản phẩm",
                records: productsCategory
            })
        } else {
            req.flash("error", "Bạn không sở hữu quyền truy cập vào trang này!");
            res.redirect("back");
        }
    } catch (error) {
        res.redirect("back");
    }
}

module.exports.create = async (req, res) => {
    try {
        if(res.locals.role.permissions.includes("products-category_create")){
            const productsCategory = await ProductCategory.find({
                deleted: false
            })
    
            const records = createTreeHelper(productsCategory);
    
            res.render('admin/pages/products-category/create', {
                pageTitle: "Thêm mới danh mục sản phẩm",
                records: records
            })
        } else {
            req.flash("error", "Bạn không sở hữu quyền truy cập vào trang này!");
            res.redirect("back");
        }
    } catch (error) {
        res.redirect("back")
    }
    
}

module.exports.createPost = async (req, res) => {
    if(res.locals.role.permissions.includes("products-category_create")){
        try {
            if(req.file){
                req.body.thumbnail = `/uploads/${req.file.filename}`;
            }

            if(req.body.position == ""){
                const countProductsCategory = await ProductCategory.countDocuments();
                req.body.position = countProductsCategory + 1;
            }

            const productCategory = new ProductCategory(req.body);

            await productCategory.save()

            console.log(productCategory);

            req.flash("success", "Thêm mới danh mục thành công!");

            res.redirect(`/${systemConfig.prefixAdmin}/products-category`);
        } catch (error) {
            res.redirect(`/${systemConfig.prefixAdmin}/products-category`);
        }
    } else {
        req.flash("error", "Bạn không sở hữu quyền thực hiện chức năng này!");
        res.redirect("back");
    }
}

module.exports.edit = async(req, res) => {
    if(res.locals.role.permissions.includes("products-category_edit")){
        try {
            const id = req.params.id;
            const productsCategory = await ProductCategory.find({deleted:false});
            const records = createTreeHelper(productsCategory);
            const data = await ProductCategory.findOne({
                _id: id,
                deleted: false
            })
            res.render('admin/pages/products-category/edit',{
                pageTitle: "Chỉnh sửa danh mục sản phẩm",
                data: data,
                records: records
            });
        } catch (error) {
            res.redirect(`/${systemConfig.prefixAdmin}/products-category`);
        }
    } else {
        req.flash("error", "Bạn không sở hữu quyền truy cập vào trang này!");
        res.redirect("back");
    }
}

module.exports.editPatch = async(req, res) => {
    if(res.locals.role.permissions.includes("products-category_edit")){
        try {
            const id = req.params.id;

            if(req.file){
                req.body.thumbnail = `/uploads/${req.file.filename}`;
            }

            if(req.body.position === ""){
                const countProductsCategory = await ProductCategory.countDocuments();
                req.body.position = countProductsCategory+1;
            }else{
                req.body.position = parseInt(req.body.position);
            }

            await ProductCategory.updateOne({
                _id: id,
                deleted: false
            }, req.body)

            req.flash("success", "Cập nhật danh mục sản phẩm thành công!");

            res.redirect(`/${systemConfig.prefixAdmin}/products-category`);
        } catch (error) {
            res.redirect(`/${systemConfig.prefixAdmin}/products-category`);
        }
    } else {
        req.flash("error", "Bạn không sở hữu quyền thực hiện chức năng này!");
        res.redirect("back");
    }
}