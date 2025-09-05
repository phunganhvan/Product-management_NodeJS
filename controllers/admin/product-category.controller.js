const ProductCategory= require("../../models/product-category.model");
const systemConfig= require("../../config/system");
const filterStatusHelper= require("../../helpers/filterStatus")
const search= require("../../helpers/search");

const createTreeHelper= require("../../helpers/create-tree")
module.exports.index = async(req, res) =>{
    let find = {
        deleted: false,
    };
    const filterStatus = filterStatusHelper(req.query);
    let keyword;
    const objSearch = search(req.query); // object search trả về
    // console.log(objSearch);
    if (req.query.title) {
        find.title = objSearch.regex
        keyword = objSearch.keyword
    }

// trạng thái
    let status = req.query.status;
    if(status){
        find.status= status;
    }
    // đệ quy
    

    const records= await ProductCategory.find(find);
    const newRecords= createTreeHelper.create(records)

    res.render("admin/pages/product-category/index", {
        pageTitle: "Danh mục sản phẩm",
        records: newRecords,
        filter: filterStatus,
        keyword: keyword,
    });
}
module.exports.create = async(req, res) => {
    let find ={
        status: "active",
        deleted: false,
    }

    // đệ quy

    const records= await ProductCategory.find(find);
    const newRecords= createTreeHelper.create(records)

    console.log(newRecords);
    res.render("admin/pages/product-category/create", {
        pageTitle: "Tạo mới danh mục",
        records: newRecords
    });
}
module.exports.createPost = async(req, res) => {
    // await console.log(req.body)
    const count = await ProductCategory.countDocuments();
    req.body.position = parseInt(req.body.position) || (count+1)
    const record= new ProductCategory(req.body);
    await record.save()
    res.redirect(`${systemConfig.prefixAdmin}/product-category`)
    // res.send("Tạo mới danh mục thành công");
}

module.exports.changeStatus = async(req, res) =>{
    const status= req.params.status;
    const id = req.params.id;

    await ProductCategory.updateOne({ _id: id},{ status: status});
    req.flash("success", "Bạn đã cập nhật trạng thái sản phẩm thành công");
    res.redirect(req.get('Referrer'));
}

module.exports.edit = async(req, res) =>{
    try {
        const record= await ProductCategory.findOne({_id: req.params.id});
        const records= await ProductCategory.find({
            status:"active",
            deleted: false,
        });
        // res.send("OK")
        const newRecords= createTreeHelper.create(records)
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

module.exports.editPatch = async(req, res) =>{
    req.body.position= parseInt(req.body.position);
    // console.log(req.body);
    try {
        await ProductCategory.updateOne({
            _id: req.params.id
        }, req.body);
        req.flash("success", "Bạn đã cập nhật sản phẩm thành công");
        res.redirect(req.get(`Referrer`));
    } catch (error) {
        req.flash("success", "Bạn đã cập nhật sản phẩm thành công");
        res.redirect(req.get(`Referrer`));
    }
}