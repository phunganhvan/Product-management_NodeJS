module.exports = (query, countProducts) => {
    const objectPagination = {
        currentPage: 1,
        limitItem: 4,
        // pageQuery: 0
    }
    if (query.page) {
        objectPagination.currentPage = parseInt(query.page);
        objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItem
    }
    const totalPage = Math.ceil(countProducts / objectPagination.limitItem);
    // console.log(totalPage);
    objectPagination.totalPage = totalPage;
    if(objectPagination.currentPage > objectPagination.totalPage){
        objectPagination.currentPage= 1;
        // url.searchParams.set("page", 1);
    }
    return objectPagination;
}