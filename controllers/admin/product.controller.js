// [GET] /admin/product
const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const createTreeHelper = require("../../helpers/create-tree");
const filterStatusHelper = require("../../helpers/filterStatus");
const search = require("../../helpers/search");
const pag = require("../../helpers/pagination");
const systemConfig = require("../../config/system");
const Account = require("../../models/account.model")


module.exports.index = async (req, res) => {
    // console.log(req.query.status);
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
    //change status
    //đây là code tìm kiếm
    let keyword;
    const objSearch = search(req.query); // object search trả về
    // console.log(objSearch);
    if (req.query.title) {
        find.title = objSearch.regex;
        keyword = objSearch.keyword
    }
    //Pagination
    const countProducts = await Product.countDocuments(find);
    // số sản phẩm trả ra giao diện

    const objectPagination = pag(req.query, countProducts);
    //End Pagination
    // console.log(find);
    // let url= new URL(window.location.href);
    // if()

    const products = await Product.find(find)
        .sort({ [sortKey]: sortValue })
        .limit(objectPagination.limitItem)
        .skip(objectPagination.skip);

    for (const product of products) {
        // Lấy ra thông tin người tạo
        const user = await Account.findOne({
            _id: product.createdBy.accountId
        });
        if (user) {
            product.accountFullname = user.fullName;
        }

        // lấy ra người cập nhật

        let length = product.updatedBy.length
        // console.log(product.updatedBy[length -1])
        const updatedBy = product.updatedBy[length - 1]
        if (updatedBy) {
            const userUpdated = await Account.findOne({
                _id: updatedBy.accountId
            })
            if (userUpdated) {
                updatedBy.accountFullname = userUpdated.fullName
            }
        }
        // console.log(product)
    }

    res.render("admin/pages/product/index", {
        pageTitle: "Trang sản phẩm",
        products: products,
        filter: filterStatus,
        keyword: keyword,
        pagination: objectPagination,
        find: find,
        isDelete: find.deleted
    })
};


//[PATCH] product/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    // console.log(req.params);
    const permission = res.locals.role.permission;
    if (permission.includes("products_edit")) {
        const status = req.params.status;
        const id = req.params.id;
        const updatedBy = {
            accountId: res.locals.user.id,
            updatedAt: new Date()
        }
        await Product.updateOne({ _id: id }, { status: status, $push: { updatedBy: updatedBy } });
        // sản phẩm cần update và update cái gì

        // res.send(`${status} - ${id}`);
        // res.redirect("/admin/product");
        req.flash("success", "Bạn đã cập nhật trạng thái sản phẩm thành công");
        res.redirect(req.get('Referrer'));
    }
    else {
        return;
    }
    //thay thế cho back
}
///product/change-multi [PATCH]
module.exports.changeMulti = async (req, res) => {
    // console.log(req.body);
    // res.send("OK");
    const permission = res.locals.role.permission
    if (permission.includes("products_edit")) {
        const type = req.body.type;
        const ids = req.body.ids.split(", ");
        const updatedBy = {
            accountId: res.locals.user.id,
            updatedAt: new Date()
        }
        // console.log(ids);
        switch (type) {
            case "active":

                await Product.updateMany(
                    {
                        _id: { $in: ids }
                    },
                    {
                        $set: { status: type },
                        $push: { updatedBy: updatedBy }
                    }
                )
                req.flash("success", `Bạn đã cập nhật trạng thái ${ids.length} sản phẩm thành công`);
                break;
            case "inactive":
                await Product.updateMany(
                    {
                        _id: { $in: ids }
                    },
                    {
                        $set: { status: type },
                        $push: { updatedBy: updatedBy }
                    }
                )
                req.flash("success", `Bạn đã cập nhật trạng thái ${ids.length} sản phẩm thành công`);
                break;
            case "deleteMany":
                await Product.updateMany(
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
                req.flash("success", `Bạn đã xóa thành công ${ids.length} sản phẩm`);
                break;
            case "restore":
                await Product.updateMany(
                    {
                        _id: { $in: ids }
                    },
                    {
                        deleted: false,
                        $push: { updatedBy: updatedBy }
                    }
                )
                req.flash("success", `Bạn đã khôi phục ${ids.length} sản phẩm thành công`);
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

//product/delete [DELETE]
module.exports.deleteProduct = async (req, res) => {
    // console.log(req);
    const permission = res.locals.role.permission;
    if (permission.includes("products_delete")) {
        const id = req.params.id;
        // console.log(id);
        await Product.updateOne(
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
        req.flash("success", "Bạn đã xóa sản phẩm thành công");
        res.redirect(req.get('Referrer'));
    }
    else {
        return;
    }
}

// /product/restore [PATCH]
module.exports.restore = async (req, res) => {
    // console.log(req.params);
    const id = req.params.id
    const updatedBy = {
        accountId: res.locals.user.id,
        updatedAt: new Date()
    }
    await Product.updateOne(
        { _id: id },
        {
            deleted: false,
            $push: { updatedBy: updatedBy }
        }
    )
    req.flash("success", "Bạn đã khôi phục sản phẩm thành công");
    res.redirect(req.get('Referrer'));
}
module.exports.restoreOne = async (req, res) => {
    const id = req.params.id
    const updatedBy = {
        accountId: res.locals.user.id,
        updatedAt: new Date()
    }
    await Product.updateOne(
        { _id: id },
        {
            deleted: false,
            $push: { updatedBy: updatedBy }
        }
    )
    req.flash("success", "Bạn đã khôi phục sản phẩm thành công");
    res.redirect(req.get('Referrer'));
}

// /admin/product/create => pt get để hiển thị giao diện
module.exports.create = async (req, res) => {


    let find = {
        status: "active",
        deleted: false,
    }

    // đệ quy

    const records = await ProductCategory.find(find);
    const newRecords = createTreeHelper.create(records)
    res.render("admin/pages/product/create", {
        pageTitle: "Thêm mới sản phẩm",
        category: newRecords
    })
}
// để sửa pt patch
module.exports.createPost = async (req, res) => {
    // console.log(req.body);
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    const count = await Product.countDocuments();
    req.body.position = parseInt(req.body.position) || (count + 1);
    // console.log(req.body);
    // if(req.file){
    //     req.body.thumbnail=`/uploads/${req.file.filename}`;
    // }

    req.body.createdBy = {
        accountId: res.locals.user.id
    };

    const product = new Product(req.body);
    // // // console.log(product);
    await product.save();
    res.redirect(`${systemConfig.prefixAdmin}/product`);
    // res.send("OK");
}


// /admin/product/edit/:id => pt get để hiển thị giao diện edit
module.exports.edit = async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id });
        // const products= {...product};
        // console.log(product.id);
        const find = {
            status: "active",
            deleted: false,
        }
        const category = await ProductCategory.find(find);
        const records = createTreeHelper.create(category);
        res.render("admin/pages/product/edit", {
            pageTitle: "Chỉnh sửa sản phẩm",
            product: product,
            category: records
        })
    } catch (error) {
        req.flash("error", "Không thể tìm thấy sản phẩm");
        res.redirect(`${systemConfig.prefixAdmin}/product`);
    }
}

//admin/product/edit/:id //pthuc patch để chỉnh sửa
module.exports.editPatch = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    const count = await Product.countDocuments();
    req.body.position = parseInt(req.body.position)
    // console.log(req.body);
    // if (req.file) {
    //     req.body.thumbnail = `/uploads/${req.file.filename}`;
    // }

    try {
        const updatedBy = {
            accountId: res.locals.user.id,
            updatedAt: new Date()
        }
       
        await Product.updateOne({ _id: req.params.id }, {
            ...req.body,
            $push: { updatedBy: updatedBy }
        });
        req.flash("success", "Bạn đã cập nhật sản phẩm thành công");
        res.redirect(req.get(`Referrer`));
    } catch (error) {
        req.flash("error", "Đã có lỗi xảy ra, vui lòng thử lại");
        res.redirect(req.get(`Referrer`));
    }
}

//admin/prodcut/detail/:id [GET]
module.exports.detail = async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id });
        // const products= {...product};
        const thisCategory = await ProductCategory.findOne({ _id: product.product_category_id });

        // console.log(product.id);
        res.render("admin/pages/product/detail", {
            pageTitle: product.title,
            product: product,
            category: thisCategory
        })
    } catch (error) {
        req.flash("error", "Không thể tìm thấy sản phẩm");
        res.redirect(`${systemConfig.prefixAdmin}/product`);
    }
}