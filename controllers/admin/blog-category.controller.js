const BlogCategory = require("../../models/blog-category.model");
const Account = require("../../models/account.model");
const filterStatusHelper = require("../../helpers/filterStatus")
const search = require("../../helpers/search");
const createTreeHelper = require("../../helpers/create-tree");
const systemConfig = require("../../config/system");
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

// [GET] /admin/blog-category/create

module.exports.create = async (req, res) => {
    let find = {
        status: "active",
        deleted: false,
    }
    const records = await BlogCategory.find(find);
    const newRecords = createTreeHelper.create(records);
    res.render("admin/pages/blog-category/create", {
        pageTitle: "Tạo mới danh mục",
        records: newRecords
    });
}

// [POST] /admin/blog-category/createPost

module.exports.createPost = async(req, res) =>{
    const permission = res.locals.role.permission
    if (1) {
        const count = await BlogCategory.countDocuments();
        req.body.position = parseInt(req.body.position) || (count + 1)
        req.body.createdBy = {
            accountId: res.locals.user.id
        };
        const record = new BlogCategory(req.body);
        await record.save()
        req.flash("success", "Bạn đã tạo mới danh mục thành công");
        res.redirect(`${systemConfig.prefixAdmin}/blog-category`)
    } else {
        return;
    }
}

// [PATCH]  /admin/blog-category/:status/:id
module.exports.changeStatus= async(req, res) =>{
    const permission = res.locals.role.permission
    if (1) {
        const status = req.params.status;
        const id = req.params.id;
        const updatedBy = {
            accountId: res.locals.user.id,
            updatedAt: new Date()
        }
        await BlogCategory.updateOne({ _id: id }, { status: status, $push: { updatedBy: updatedBy } });
        req.flash("success", "Bạn đã cập nhật trạng thái danh mục bài viết thành công");
        res.redirect(req.get('Referrer'));
    }
    else{
        return;
    }
}

// [PATCH] /admin/blog-category/change-multi
module.exports.changeMulti = async(req, res) =>{
    const permission = res.locals.role.permission
    if (1) {
        // console.log(req.body);
        const type = req.body.type;
        const ids = req.body.ids.split(", ");
        const updatedBy = {
            accountId: res.locals.user.id,
            updatedAt: new Date()
        }
        switch (type) {
            case "active":

                await BlogCategory.updateMany(
                    {
                        _id: { $in: ids }
                    },
                    {
                        $set: { status: type },
                        $push: { updatedBy: updatedBy }
                    }
                )
                req.flash("success", `Bạn đã cập nhật trạng thái ${ids.length} danh mục thành công`);
                break;
            case "inactive":
                await BlogCategory.updateMany(
                    {
                        _id: { $in: ids }
                    },
                    {
                        $set: { status: type },
                        $push: { updatedBy: updatedBy }
                    }
                )
                req.flash("success", `Bạn đã cập nhật trạng thái ${ids.length} danh mục thành công`);
                break;
            case "deleteMany":
                await BlogCategory.updateMany(
                    {
                        _id: { $in: ids }
                    },
                    {
                        deleted: true,
                        deletedBy: {
                            accountId: res.locals.user.id,
                            deletedAt: new Date(),
                        },
                        updatedAt: new Date()
                    }
                )
                req.flash("success", `Bạn đã xóa thành công ${ids.length} danh mục`);
                break;
            case "restore":
                await BlogCategory.updateMany(
                    {
                        _id: { $in: ids }
                    },
                    {
                        deleted: false,
                        $push: { updatedBy: updatedBy }
                    }
                )
                req.flash("success", `Bạn đã khôi phục ${ids.length} danh mục thành công`);
                break;
            case "changePosition":
                // console.log(ids);
                for (const item of ids) {
                    let [id, position] = item.split("-");
                    // destructuring - biết chắc cấu trúc
                    position = parseInt(position);
                    await Product.updateOne(
                        { _id: id },
                        {
                            $set: { position: position },
                            $push: { updatedBy: updatedBy }
                        }
                    )
                }
                req.flash("success", `Bạn đã thay đổi vị trí ${ids.length} danh mục thành công`);
                break;
            default:
                break;
        }
        res.redirect(req.get('Referrer'));
    }
    else {
        return;
    }
}

// [DELETE] /admin/blog-category/delete/:id
module.exports.delete = async(req, res) =>{
    const permission = res.locals.role.permission
    if (1) {
        const id = req.params.id;
        console.log(id);
        await BlogCategory.updateOne(
            { _id: id },
            {
                deleted: true,
                deletedBy: {
                    accountId: res.locals.user.id,
                    deletedAt: new Date(),
                }
            }
        )
        req.flash("success", "Bạn đã xóa danh mục thành công");
        res.redirect(req.get('Referrer'));
    }
    else {
        return;
    }
}