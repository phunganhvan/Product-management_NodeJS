const BlogCategory = require("../../models/blog-category.model");
const Account = require("../../models/account.model");
const filterStatusHelper = require("../../helpers/filterStatus")
const search = require("../../helpers/search");
const createTreeHelper = require("../../helpers/create-tree");
// /admin/blogs

module.exports.index = async (req, res) => {
    const find = {
        deleted: false,
    };
    const filterStatus = filterStatusHelper(req.query);

    // tìm kiếm danh mục bài viết
    let keyword;
    const objSearch = search(req.query); // object search trả về
    // console.log(objSearch);
    if (req.query.title) {
        find.title = objSearch.regex
        keyword = objSearch.keyword
    }
    // trạng thái
    let status = req.query.status;
    if (status) {
        find.status = status;
    }
    if (status === "deleted") {
        find = {
            deleted: true,
        }
        find.status = "deleted"
    }

    const records = await BlogCategory.find(find);
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
            })
            if (userUpdated) {
                updatedBy.accountFullname = userUpdated.fullName
            }
        }
    }
    let newRecords
    if (find.status != undefined) {
        newRecords = records;
    } else {
        newRecords = createTreeHelper.create(records);
    }
    res.render("admin/pages/blog-category/index", {
        pageTitle: "Danh mục bài viết",
        records: newRecords,
        filter: filterStatus,
        keyword: keyword,
        find: find,
        isDelete: find.deleted
    })
}