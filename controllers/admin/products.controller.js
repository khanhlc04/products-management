const Product = require('../../model/products.model');
const ProductCategory = require('../../model/products-category.model');
const Account = require('../../model/accounts.model');
const filterStatusHelper = require('../../helpers/filter-state.helper');
const paginationHelper = require('../../helpers/pagination.helper');
const systemConfig = require('../../config/system');
const createTreeHelper = require('../../helpers/create-tree.helper');

module.exports.index = async (req, res) => {
    if(res.locals.role.permissions.includes("products_view")){
        try {
            const filterState = filterStatusHelper(req.query);

            const find = {
                deleted: false
            }
        
            if(req.query.status){
                find.status = req.query.status;
            }
        
            if(req.query.keyword){
                const regex = new RegExp(req.query.keyword, "i");
                find.title = regex;
            }

            const countProduct = await Product.countDocuments(find);
            const objectPagination = paginationHelper(5, req.query, countProduct);

            const sort = {}

            if(req.query.sortKey && req.query.sortValue){
                sort[req.query.sortKey] = req.query.sortValue;
            } else {
                sort["position"] = "desc";
            }
        
            const products = await Product.find(find)
                .sort(sort)
                .limit(objectPagination.limitItems)
                .skip(objectPagination.skip)

            for (const product of products){
                const account = await Account.findOne({
                    _id: product.createdBy.accountId
                })

                if(account)
                    product.createdBy.fullName = account.fullName;
            }
            
            if(req.query.page > objectPagination.totalPage){
                res.redirect(`/${systemConfig.prefixAdmin}/products`);
            }
            
        
            res.render('admin/pages/products/index',{
                pageTitle: "Danh sách sản phẩm",
                products: products,
                filterState: filterState,
                keyword: req.query.keyword,
                pagination: objectPagination
            });
        } catch (error) {
            res.redirect(`/${systemConfig.prefixAdmin}/products`);
        }
    } else {
        req.flash("error", "Bạn không sở hữu quyền truy cập vào trang này!");
        res.redirect("back");
    }
}

module.exports.changeStatus = async(req, res) => {
    if(res.locals.role.permissions.includes("products_edit")){
        try{
            const id = req.params.id;
            const status = req.params.status;

            const objectUpdatedBy = {
                accountId: res.locals.user.id,
                updatedAt: new Date()
            }

            await Product.updateOne({
                _id: id
            },{
                status: status,
                $push: {updatedBy: objectUpdatedBy}
            })

            req.flash("success", "Cập nhật trạng thái thành công!");

            res.redirect("back");
        } catch {
            res.redirect(`/${systemConfig.prefixAdmin}/products`);
        }
    } else {
        req.flash("error", "Bạn không sở hữu quyền thực hiện chức năng này!");
        res.redirect("back");
    }
}

module.exports.changeMulti = async (req, res) => {
    if(res.locals.role.permissions.includes("products_edit")){
        try{
            const type = req.body.type;
            const ids = req.body.ids.split(", ");
        
            switch(type){
                case "active": 
                case "inactive":
                    const objectUpdatedBy = {
                        accountId: res.locals.user.id,
                        updatedAt: new Date()
                    }

                    await Product.updateMany({
                        _id: {$in: ids}
                    },{
                        status: type,
                        $push: {updatedBy: objectUpdatedBy}
                    });

                    req.flash("success", "Cập nhật trạng thái thành công!");

                    break;
                case "delete-all":
                    await Product.updateMany({
                        _id: {$in: ids}
                    },{
                        deleted: true,
                        deletedAt: {
                            accountId: res.locals.user.id,
                            deletedAt: new Date()
                        }
                    });

                    req.flash("success", "Xóa bản ghi thành công!");

                    break;
                case "change-position":
                    const objectUpdatedPositionBy = {
                        accountId: res.locals.user.id,
                        updatedAt: new Date()
                    }

                    for (const item of ids){
                        const itemSplit = item.split("-");
                        await Product.updateOne({
                            _id: itemSplit[0]
                        },{
                            position: itemSplit[1],
                            $push: {updatedBy: objectUpdatedPositionBy}
                        })
                    }

                    req.flash("success", "Thay đổi vị trí thành công!");

                    break;
                default: break
            }
        
            res.redirect("back");
        } catch {
            res.redirect(`/${systemConfig.prefixAdmin}/products`);
        }
    } else {
        req.flash("error", "Bạn không sở hữu quyền thực hiện chức năng này!");
        res.redirect("back");
    }
}

module.exports.deleteItem = async (req, res) => {
    if(res.locals.role.permissions.includes("products-category_delete")){
        try {
            const id = req.params.id;
            
            await Product.updateOne({
                _id: id
            },{
                deleted: true,
                deletedBy: {
                    accountId: res.locals.user.id,
                    deletedAt: new Date()
                }
            })
            
            req.flash("success", "Xóa bản ghi thành công!");

            res.redirect("back");
        } catch (error) {
            res.redirect(`/${systemConfig.prefixAdmin}/products`);
        }
    } else {
        req.flash("error", "Bạn không sở hữu quyền thực hiện chức năng này!");
        res.redirect("back");
    }
}

module.exports.create = async (req, res) => {
    if(res.locals.role.permissions.includes("products-category_create")){
        try {
            const productsCategory = await ProductCategory.find({deleted:false});
            const records = createTreeHelper(productsCategory);
            res.render('admin/pages/products/create', {
                pageTitle: "Thêm mới sản phẩm",
                records: records
            });
        } catch (error) {
            res.redirect(`/${systemConfig.prefixAdmin}/products`);
        }
    } else {
        req.flash("error", "Bạn không sở hữu quyền thực hiện chức năng này!");
        res.redirect("back");
    }
}

module.exports.createPost = async (req, res) => {
    if(res.locals.role.permissions.includes("products-category_create")){
        try {
            req.body.price = parseInt(req.body.price);
            req.body.discountPercentage = parseInt(req.body.discountPercentage);
            req.body.stock = parseInt(req.body.stock);

            if(req.body.position === ""){
                const countProduct = await Product.countDocuments();
                req.body.position = countProduct + 1;
            }
            else{
                req.body.position = parseInt(req.body.position);
            }
            
            // if(req.file){
            //     req.body.thumbnail = `/uploads/${req.file.filename}`;
            // }

            req.body.createdBy = {
                accountId: res.locals.user.id,
                createdAt: new Date()
            }

            const product = new Product(req.body);
            await product.save();

            req.flash("success", "Thêm mới sản phẩm thành công!");
            res.redirect(`/${systemConfig.prefixAdmin}/products`);
        } catch (error) {
            res.redirect(`/${systemConfig.prefixAdmin}/products`);
        }
    } else {
        req.flash("error", "Bạn không sở hữu quyền thực hiện chức năng này!");
        res.redirect("back");
    }
}

module.exports.edit = async (req, res) => {
    if(res.locals.role.permissions.includes("products-category_edit")){
        try {
            const id = req.params.id;

            const productsCategory = await ProductCategory.find({deleted:false});
            const records = createTreeHelper(productsCategory);

            const product = await Product.findOne({
                _id: id,
                deleted: false,
            })

            res.render('admin/pages/products/edit',{
                pageTitle: "Chỉnh sửa sản phẩm",
                product: product,
                records: records,
            });
        } catch (error) {
            res.redirect(`/${systemConfig.prefixAdmin}/products`);
        }
    } else {
        req.flash("error", "Bạn không sở hữu quyền thực hiện chức năng này!");
        res.redirect("back");
    }
}

module.exports.editPatch = async (req, res) => {
    if(res.locals.role.permissions.includes("products-category_create")){
        try {
            const id = req.params.id;

            req.body.price = parseInt(req.body.price);
            req.body.discountPercentage = parseInt(req.body.discountPercentage);
            req.body.stock = parseInt(req.body.stock);

            // if(req.file){
            //     req.body.thumbnail = `/uploads/${req.file.filename}`;
            // }

            const objectUpdatedBy = {
                accountId: res.locals.user.id,
                updatedAt: new Date()
            }

            await Product.updateOne({
                _id: id,
                deleted: false
            }, {
                ...req.body,
                $push: {updatedBy: objectUpdatedBy}
            })

            req.flash("success", "Cập nhật thông tin sản phẩm thành công!");

            res.redirect(`/${systemConfig.prefixAdmin}/products`);

        } catch (error) {
            res.redirect(`/${systemConfig.prefixAdmin}/products`);
        }
    } else {
        req.flash("error", "Bạn không sở hữu quyền thực hiện chức năng này!");
        res.redirect("back");
    }
}

module.exports.detail = async (req, res) => {
    if(res.locals.role.permissions.includes("products_view")){
        try {
            const id = req.params.id;
            const product = await Product.findOne({
                _id: id,
                deleted: false
            })
            res.render(`admin/pages/products/detail`,{
                pageTitle: "Trang chi tiết sản phẩm",
                product: product
            })
        } catch (error) {
            res.redirect(`/${systemConfig.prefixAdmin}/products`);
        }
    } else {
        req.flash("error", "Bạn không sở hữu quyền truy cập vào trang này!");
        res.redirect("back");
    }
}
