module.exports = (limitItems, query, count) => {
    const objectPagination = {
        currentPage: 1,
        limitItems: limitItems
    }

    if(query.page){
        objectPagination.currentPage = query.page;
    }

    objectPagination.totalPage = Math.ceil(count / limitItems);
    objectPagination.skip = (objectPagination.currentPage - 1) * limitItems;

    return objectPagination;
}