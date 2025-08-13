// [GET] /admin/product
const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const search = require("../../helpers/search");
const pag = require("../../helpers/pagination");
const systemConfig= require("../../config/system");

module.exports.index = async (req, res) => {
    // console.log(req.query.status);
    //đoạn bộ lọc
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
        .sort({ position: "desc"})
        .limit(objectPagination.limitItem)
        .skip(objectPagination.skip);
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
module.exports.changeStatus = async(req, res) =>{
    // console.log(req.params);
    const status= req.params.status;
    const id = req.params.id;

    await Product.updateOne({ _id: id},{ status: status});
    // sản phẩm cần update và update cái gì

    // res.send(`${status} - ${id}`);
    // res.redirect("/admin/product");
    req.flash("success", "Bạn đã cập nhật trạng thái sản phẩm thành công");
    res.redirect(req.get('Referrer'));
    //thay thế cho back
}
///product/change-multi [PATCH]
module.exports.changeMulti = async(req, res) =>{
    console.log( req.body);
    // res.send("OK");
    const type= req.body.type;
    // console.log(type);
    const ids= req.body.ids.split(", ");
    // console.log(ids);
    switch (type) {
        case "active":
            await Product.updateMany(
                {
                    _id: { $in: ids}
                },
                {
                    $set: { status: type}
                }
            )
            req.flash("success", `Bạn đã cập nhật trạng thái ${ids.length} sản phẩm thành công`);
            break;
        case "inactive":
            await Product.updateMany(
                {
                    _id: { $in: ids}
                },
                {
                    $set: { status: type}
                }
            )
            req.flash("success", `Bạn đã cập nhật trạng thái ${ids.length} sản phẩm thành công`);
            break;
        case "deleteMany":
            await Product.updateMany(
                {
                    _id: { $in: ids}
                },
                {
                    deleted: true,
                    deletedAt: new Date(),
                    updatedAt: new Date()
                }
            )
            req.flash("success", `Bạn đã xóa thành công ${ids.length} sản phẩm`);
            break;
        case "restore":
            await Product.updateMany(
                {
                   _id: { $in: ids} 
                },
                {
                    deleted: false,
                    updatedAt: new Date()
                }
            )
            req.flash("success", `Bạn đã khôi phục ${ids.length} sản phẩm thành công`);
            break;
        case "changePosition":
            // console.log(ids);
            for(const item of ids){
                let [id, position] = item.split("-");
                // destructuring - biết chắc cấu trúc
                position = parseInt(position);
                await Product.updateOne(
                    {_id: id},
                    {
                        $set: {position: position}
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

//product/delete [DELETE]
module.exports.deleteProduct = async(req, res) =>{
    // console.log(req);
    const id= req.params.id;
    console.log(id);
    await Product.updateOne(
        {_id: id},
        {   deleted: true,
            deletedAt: new Date()
        }
    )
    // await Product.deleteOne({_id: id});
    //Xóa hẳn
    // res.send("HELLO XÓA THÀNH CÔNG");
    req.flash("success", "Bạn đã xóa sản phẩm thành công");
    res.redirect(req.get('Referrer'));
}

// /product/restore [PATCH]
module.exports.restore = async(req, res) =>{
    // console.log(req.params);
    const id= req.params.id
    await Product.updateOne(
        {_id: id},
        {
            deleted: false
        }
    )
    req.flash("success", "Bạn đã khôi phục sản phẩm thành công");
    res.redirect(req.get('Referrer'));
}

// /admin/product/create => pt get để hiển thị giao diện
module.exports.create = async(req, res) =>{
    res.render("admin/pages/product/create", {
        pageTitle: "Thêm mới sản phẩm"
    })
}
// để sửa pt patch
module.exports.createPost = async(req, res) =>{
    console.log(req.body);
    req.body.price= parseInt(req.body.price);
    req.body.discountPercentage= parseInt(req.body.discountPercentage);
    req.body.stock= parseInt(req.body.stock);
    const count = await Product.countDocuments();
    req.body.position = parseInt(req.body.position) || (count+1);
    // console.log(req.body);
    // if(req.file){
    //     req.body.thumbnail=`/uploads/${req.file.filename}`;
    // }
    const product= new Product(req.body);
    // // // console.log(product);
    await product.save();
    res.redirect(`${systemConfig.prefixAdmin}/product`);
    // res.send("OK");
}


// /admin/product/edit/:id => pt get để hiển thị giao diện edit
module.exports.edit = async(req, res) =>{
    try {
        const product= await Product.findOne({_id: req.params.id});
        // const products= {...product};
        console.log(product.id);
        res.render("admin/pages/product/edit", {
            pageTitle: "Chỉnh sửa sản phẩm",
            product: product
        })
    } catch (error) {
        req.flash("error", "Không thể tìm thấy sản phẩm");
        res.redirect(`${systemConfig.prefixAdmin}/product`);
    }
}

//admin/product/edit/:id //pthuc patch để chỉnh sửa
module.exports.editPatch = async(req, res) =>{
    req.body.price= parseInt(req.body.price);
    req.body.discountPercentage= parseInt(req.body.discountPercentage);
    req.body.stock= parseInt(req.body.stock);
    const count = await Product.countDocuments();
    req.body.position = parseInt(req.body.position)
    // console.log(req.body);
    if(req.file){
        req.body.thumbnail=`/uploads/${req.file.filename}`;
    }

    try {
        await Product.updateOne({_id: req.params.id}, req.body);
        req.flash("success", "Bạn đã cập nhật sản phẩm thành công");
        res.redirect(req.get(`Referrer`));
    } catch (error) {
        req.flash("error", "Đã có lỗi xảy ra, vui lòng thử lại");
        res.redirect(req.get(`Referrer`));
    }
}

//admin/prodcut/detail/:id [GET]
module.exports.detail = async (req, res) =>{
    try {
        const product= await Product.findOne({_id: req.params.id});
        // const products= {...product};
        console.log(product.id);
        res.render("admin/pages/product/detail", {
            pageTitle: product.title,
            product: product
        })
    } catch (error) {
        req.flash("error", "Không thể tìm thấy sản phẩm");
        res.redirect(`${systemConfig.prefixAdmin}/product`);
    }
}