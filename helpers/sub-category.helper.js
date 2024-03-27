const ProductCategory = require('../model/products-category.model');

const getSubCategory = async(parentId) => {
    const subs = await ProductCategory.find({
        deleted: false,
        status: "active",
        parent_id: parentId
    })

    let allSubs = [...subs];

    for(const sub of subs){
        const childs = await getSubCategory(sub.id);
        allSubs = allSubs.concat(childs);
    }

    return allSubs;
}

module.exports = (parentId) => {
    const subCategory = getSubCategory(parentId);
    return subCategory;
}