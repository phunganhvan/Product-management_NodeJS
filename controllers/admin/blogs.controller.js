const Blog = require("../../models/blogs.model")

const createTreeHelper = require("../../helpers/create-tree");
const filterStatusHelper = require("../../helpers/filterStatus");
const search = require("../../helpers/search");
const pag = require("../../helpers/pagination");
const systemConfig = require("../../config/system");
const Account = require("../../models/account.model");
const BlogCategory = require("../../models/blog-category.model");


// /admin/blogs [GET]
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

// /admin/blogs/change-status/:status/:id  [PATCH]
module.exports.changeStatus = async (req, res) => {
    const permission = res.locals.role.permission;
    if (permission.includes("blogs_edit")) {
        const status = req.params.status;
        const id = req.params.id;
        const updatedBy = {
            accountId: res.locals.user.id,
            updatedAt: new Date()
        }
        await Blog.updateOne({ _id: id }, { status: status, $push: { updatedBy: updatedBy } });
        // sản phẩm cần update và update cái gì

        // res.send(`${status} - ${id}`);
        // res.redirect("/admin/product");
        req.flash("success", "Bạn đã cập nhật trạng thái bài viết thành công");
        res.redirect(req.get('Referrer'));
    }
    else {
        return;
    }

}

// /admin/blogs/change-multi [PATCH]
module.exports.changeMulti = async (req, res) => {
    const permission = res.locals.role.permission
    if (permission.includes("blogs_edit")) {
        const type = req.body.type;
        const ids = req.body.ids.split(", ");
        const updatedBy = {
            accountId: res.locals.user.id,
            updatedAt: new Date()
        }
        // console.log(ids);
        switch (type) {
            case "active":

                await Blog.updateMany(
                    {
                        _id: { $in: ids }
                    },
                    {
                        $set: { status: type },
                        $push: { updatedBy: updatedBy }
                    }
                )
                req.flash("success", `Bạn đã cập nhật trạng thái ${ids.length} bài viết thành công`);
                break;
            case "inactive":
                await Blog.updateMany(
                    {
                        _id: { $in: ids }
                    },
                    {
                        $set: { status: type },
                        $push: { updatedBy: updatedBy }
                    }
                )
                req.flash("success", `Bạn đã cập nhật trạng thái ${ids.length} bài viết thành công`);
                break;
            case "deleteMany":
                await Blog.updateMany(
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
                req.flash("success", `Bạn đã xóa thành công ${ids.length} bài viết`);
                break;
            case "restore":
                await Blog.updateMany(
                    {
                        _id: { $in: ids }
                    },
                    {
                        deleted: false,
                        $push: { updatedBy: updatedBy }
                    }
                )
                req.flash("success", `Bạn đã khôi phục ${ids.length} bài viết thành công`);
                break;
            case "changePosition":
                // console.log(ids);
                for (const item of ids) {
                    let [id, position] = item.split("-");
                    // destructuring - biết chắc cấu trúc
                    position = parseInt(position);
                    await Blog.updateOne(
                        { _id: id },
                        {
                            $set: { position: position },
                            $push: { updatedBy: updatedBy }
                        }
                    )
                }
                req.flash("success", `Bạn đã thay đổi vị trí ${ids.length} sản phẩm thành công`);
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

// /admin/blogs/delete/:id  [DELETE]
module.exports.deleteBlog = async (req, res) => {
    const permission = res.locals.role.permission;
    if (permission.includes("blogs_delete")) {
        const id = req.params.id;
        // console.log(id);
        await Blog.updateOne(
            { _id: id },
            {
                deleted: true,
                deletedBy: {
                    accountId: res.locals.user.id,
                    deletedAt: new Date(),
                }
            }
        )
        // await Product.deleteOne({_id: id});
        //Xóa hẳn
        // res.send("HELLO XÓA THÀNH CÔNG");
        req.flash("success", "Bạn đã xóa bài viết thành công");
        res.redirect(req.get('Referrer'));
    }
    else {
        return;
    }
}

// /admin/blogs/restore/:id
module.exports.restoreBlog = async (req, res) => {
    const permission = res.locals.role.permission;
    if (permission.includes("blogs_edit")) {
        const id = req.params.id
        const updatedBy = {
            accountId: res.locals.user.id,
            updatedAt: new Date()
        }
        await Blog.updateOne(
            { _id: id },
            {
                deleted: false,
                $push: { updatedBy: updatedBy }
            }
        )
        req.flash("success", "Bạn đã khôi phục bài viết thành công");
        res.redirect(req.get('Referrer'));
    }
    else {
        return;
    }
}

// /admin/blogs/create [GET]
module.exports.create = async (req, res) => {
    let find = {
        status: "active",
        deleted: false,
    }

    // đệ quy

    const records = await BlogCategory.find(find);
    const newRecords = createTreeHelper.create(records)
    res.render("admin/pages/blog/create", {
        pageTitle: "Tạo mới bài viết",
        category: newRecords
    })
}

// /admin/blogs/create [POST]
module.exports.createPost = async (req, res) => {
    const count = await Blog.countDocuments();
    req.body.position = parseInt(req.body.position) || (count + 1);
    req.body.createdBy = {
        accountId: res.locals.user.id
    };

    const blog = new Blog(req.body);
    // // // console.log(product);
    await blog.save();
    res.redirect(`${systemConfig.prefixAdmin}/blogs`);
}

// /admin/blogs/edit/:id [GET]
module.exports.edit = async (req, res) => {
    try {
        const blog = await Blog.findOne({ _id: req.params.id });
        // const products= {...product};
        // console.log(product.id);
        const find = {
            status: "active",
            deleted: false,
        }
        const category = await BlogCategory.find(find);
        const records = createTreeHelper.create(category);
        res.render("admin/pages/blog/edit", {
            pageTitle: "Chỉnh sửa bài viết",
            blog: blog,
            category: records
        })
    } catch (error) {
        req.flash("error", "Không thể tìm thấy bài viết");
        res.redirect(`${systemConfig.prefixAdmin}/blogs`);
    }
}

// /admin/blogs/edit/:id [PATCH]
module.exports.editPatch = async (req, res) => {
    const count = await Blog.countDocuments();
    req.body.position = parseInt(req.body.position) || count +1;
    

    try {
        const updatedBy = {
            accountId: res.locals.user.id,
            updatedAt: new Date()
        }
        await Blog.updateOne({ _id: req.params.id }, {
            ...req.body,
            $push: { updatedBy: updatedBy }
        });
        req.flash("success", "Bạn đã cập nhật bài viết thành công");
        res.redirect(req.get(`Referrer`));
    } catch (error) {
        req.flash("error", "Đã có lỗi xảy ra, vui lòng thử lại");
        res.redirect(req.get(`Referrer`));
    }
}

// /admin/blogs/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const blog = await Blog.findOne({ _id: req.params.id });
        // const products= {...product};
        const thisCategory = await BlogCategory.findOne({ _id: blog.blog_category_id });

        res.render("admin/pages/blog/detail", {
            pageTitle: "Chi tiết bài viết",
            blog: blog,
            category: thisCategory
        })
    } catch (error) {
        req.flash("error", "Không thể tìm thấy bài viết");
        res.redirect(`${systemConfig.prefixAdmin}/blogs`);
    }
}