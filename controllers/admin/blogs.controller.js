const Blog = require("../../models/blogs.model")

const createTreeHelper = require("../../helpers/create-tree");
const filterStatusHelper = require("../../helpers/filterStatus");
const search = require("../../helpers/search");
const pag = require("../../helpers/pagination");
const systemConfig = require("../../config/system");
const Account = require("../../models/account.model")
// /admin/blogs

module.exports.index = async (req, res) => {
    // sắp xếp
    let sortKey, sortValue;
    if (req.query.sortKey && req.query.sortValue) {
        sortKey = req.query.sortKey;
        sortValue = req.query.sortValue;
    }
    else {
        sortKey = "position";
        sortValue = "desc";
    }
    const filterStatus = filterStatusHelper(req.query);
    let find = {
        deleted: false,
    };
    let status = req.query.status;
    if (status) {
        find.status = status;
    }
    if (status === "deleted") {
        find = {
            deleted: true,
        }
    }
    let keyword;
    const objSearch = search(req.query); // object search trả về
    // console.log(objSearch);
    if (req.query.title) {
        find.title = objSearch.regex;
        keyword = objSearch.keyword
    }
    //Pagination
    const countRecords = await Blog.countDocuments(find);
    // số sản phẩm trả ra giao diện

    const objectPagination = pag(req.query, countRecords);
    //End Pagination
    // console.log(find);
    // let url= new URL(window.location.href);
    // if()

    const records = await Blog.find(find)
        .sort({ [sortKey]: sortValue })
        .limit(objectPagination.limitItem)
        .skip(objectPagination.skip);

    for (const record of records) {
        // Lấy ra thông tin người tạo
        const user = await Account.findOne({
            _id: record.createdBy.accountId
        });
        if (user) {
            record.accountFullname = user.fullName;
        }

        // lấy ra người cập nhật

        let length = record.updatedBy.length
        // console.log(product.updatedBy[length -1])
        const updatedBy = record.updatedBy[length - 1]
        if (updatedBy) {
            const userUpdated = await Account.findOne({
                _id: updatedBy.accountId
            });
            if (userUpdated) {
                updatedBy.accountFullname = userUpdated.fullName
            }
        }
        // console.log(product)
    }

    res.render("admin/pages/blog/index", {
        pageTitle: "Trang bài viết",
        records: records,
        filter: filterStatus,
        keyword: keyword,
        pagination: objectPagination,
        find: find,
        isDelete: find.deleted
    })
}