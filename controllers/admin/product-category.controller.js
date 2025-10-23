
const systemConfig = require("../../config/system");
const filterStatusHelper = require("../../helpers/filterStatus")
const search = require("../../helpers/search");

const createTreeHelper = require("../../helpers/create-tree");
const ProductCategory = require("../../models/product-category.model");
const Product = require("../../models/product.model");
const Account = require("../../models/account.model")
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    };
    const filterStatus = filterStatusHelper(req.query);

    // tìm kiếm sản phẩm
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
        find.status= "deleted"
    }
    // đệ quy


    const records = await ProductCategory.find(find);
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
    console.log(find.status);
    let newRecords
    if(find.status!= undefined){
        newRecords= records;
    }else{
        newRecords = createTreeHelper.create(records);
    }
    
    
    res.render("admin/pages/product-category/index", {
        pageTitle: "Danh mục sản phẩm",
        records: newRecords,
        filter: filterStatus,
        keyword: keyword,
        find: find,
        isDelete: find.deleted
    });
}
module.exports.create = async (req, res) => {
    let find = {
        status: "active",
        deleted: false,
    }

    // đệ quy

    const records = await ProductCategory.find(find);
    const newRecords = createTreeHelper.create(records)

    console.log(newRecords);
    res.render("admin/pages/product-category/create", {
        pageTitle: "Tạo mới danh mục",
        records: newRecords
    });
}
module.exports.createPost = async (req, res) => {
    // await console.log(req.body)

    const permission = res.locals.role.permission
    if (permission.includes("products-category_create")) {
        const count = await ProductCategory.countDocuments();
        req.body.position = parseInt(req.body.position) || (count + 1)
        req.body.createdBy = {
            accountId: res.locals.user.id
        };
        const record = new ProductCategory(req.body);
        await record.save()
        req.flash("success", "Bạn đã tạo mới danh mục thành công");
        res.redirect(`${systemConfig.prefixAdmin}/product-category`)
    } else {
        return;
    }


    const count = await ProductCategory.countDocuments();
    req.body.position = parseInt(req.body.position) || (count + 1)
    req.body.createdBy = {
        accountId: res.locals.user.id
    };
    const record = new ProductCategory(req.body);
    await record.save()
    req.flash("success", "Bạn đã tạo mới danh mục thành công");
    res.redirect(`${systemConfig.prefixAdmin}/product-category`)
    // res.send("Tạo mới danh mục thành công");
}

module.exports.changeStatus = async (req, res) => {
    const permission = res.locals.role.permission
    if (permission.includes("products-category_edit")) {
        const status = req.params.status;
        const id = req.params.id;
        const updatedBy = {
            accountId: res.locals.user.id,
            updatedAt: new Date()
        }
        await ProductCategory.updateOne({ _id: id }, { status: status, $push: { updatedBy: updatedBy } });
        req.flash("success", "Bạn đã cập nhật trạng thái sản phẩm thành công");
        res.redirect(req.get('Referrer'));
    }
    else{
        return;
    }
}

module.exports.edit = async (req, res) => {
    try {
        const record = await ProductCategory.findOne({ _id: req.params.id });
        const records = await ProductCategory.find({
            status: "active",
            deleted: false,
        });
        // res.send("OK")
        const newRecords = createTreeHelper.create(records)
        res.render("admin/pages/product-category/edit", {
            pageTitle: "Chỉnh sửa danh mục",
            record: record,
            records: newRecords
        })
    } catch (error) {
        req.flash("error", "Không thể tìm thấy sản phẩm");
        res.redirect(`${systemConfig.prefixAdmin}/product-category`);
    }
}

module.exports.editPatch = async (req, res) => {
    const permission = res.locals.role.permission
    if (permission.includes("products-category_edit")) {
        req.body.position = parseInt(req.body.position);
        // console.log(req.body);
        try {
            const updatedBy = {
                accountId: res.locals.user.id,
                updatedAt: new Date()
            }
            await ProductCategory.updateOne({ _id: req.params.id }, {
                ...req.body,
                $push: { updatedBy: updatedBy }
            });
            req.flash("success", "Bạn đã cập nhật danh mục thành công");
            res.redirect(req.get(`Referrer`));
        } catch (error) {
            req.flash("error", "Đã có lỗi xảy ra, vui lòng thử lại");
            res.redirect(req.get(`Referrer`));
        }
    }
    else {
        return;
    }

}

module.exports.changeMulti = async (req, res) => {
    const permission = res.locals.role.permission
    if (permission.includes("products-category_edit")) {
        // console.log(req.body);
        const type = req.body.type;
        const ids = req.body.ids.split(", ");
        const updatedBy = {
            accountId: res.locals.user.id,
            updatedAt: new Date()
        }
        switch (type) {
            case "active":

                await ProductCategory.updateMany(
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
                await ProductCategory.updateMany(
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
                await ProductCategory.updateMany(
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
                await ProductCategory.updateMany(
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

module.exports.deleteProductCategory = async (req, res) => {
    const permission = res.locals.role.permission
    if (permission.includes("products-category_delete")) {
        const id = req.params.id;
        console.log(id);
        await ProductCategory.updateOne(
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
        req.flash("success", "Bạn đã xóa danh mục thành công");
        res.redirect(req.get('Referrer'));
    }
    else {
        return;
    }
}
module.exports.restore = async (req, res) => {
    const permission = res.locals.role.permission
    if (permission.includes("products-category_edit")) {
        const id = req.params.id
        const updatedBy = {
            accountId: res.locals.user.id,
            updatedAt: new Date()
        }
        await ProductCategory.updateOne(
            { _id: id },
            {
                deleted: false,
                $push: { updatedBy: updatedBy }
            }
        )
        req.flash("success", "Bạn đã khôi phục sản phẩm thành công");
        res.redirect(req.get('Referrer'));
    }
    else {
        return;
    }

}
module.exports.restoreOne = async (req, res) => {
    const permission = res.locals.role.permission
    if (permission.includes("products-category_edit")) {
        const id = req.params.id
        const updatedBy = {
            accountId: res.locals.user.id,
            updatedAt: new Date()
        }
        await ProductCategory.updateOne(
            { _id: id },
            {
                deleted: false,
                $push: { updatedBy: updatedBy }
            }
        )
        req.flash("success", "Bạn đã khôi phục sản phẩm thành công");
        res.redirect(req.get('Referrer'));
    }
    else {
        return;
    }
}


module.exports.detail = async(req, res) =>{
    try {
        const productCategory = await ProductCategory.findOne({
            _id: req.params.id
        });
        const parent = await ProductCategory.findOne({
            _id: productCategory.parent_id
        });
        res.render("admin/pages/product-category/detail", {
            pageTitle: productCategory.title,
            record: productCategory,
            parentName: parent.title
        })
    } catch (error) {
        req.flash("error", "Không thể tìm thấy danh mục sản phẩm");
        res.redirect(`${systemConfig.prefixAdmin}/product-category`);
    }
}