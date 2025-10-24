const Role= require("../../models/role.model")
const systemConfig= require("../../config/system");
const Product = require("../../models/product.model");
module.exports.index = async(req, res) =>{
    let find={
        deleted: false,
    }
    const records= await Role.find(find)
    res.render("admin/pages/roles/index", {
        pageTitle: "Quản lý nhóm quyền",
        records: records
    })
}

module.exports.create= (req, res) =>{
    res.render("admin/pages/roles/create", {
        pageTitle: "Tạo nhóm quyền",
    })
}
module.exports.createPost = async(req, res)=>{
    const permission = new Role(req.body)
    await permission.save()
    // res.send("OK")
    res.redirect(`${systemConfig.prefixAdmin}/roles`)
}

module.exports.edit = async(req, res) =>{
    try {
        const id= req.params.id
        const record= await Role.findOne({_id: id})
        res.render("admin/pages/roles/edit", {
            pageTitle: "Chỉnh sửa nhóm quyền",
            record: record
        })
    } catch (error) {
        req.flash("error", "Không thể tìm thấy nhóm quyền");
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
}

module.exports.editPatch = async(req, res) =>{
    try {
        await Role.updateOne({_id: req.params.id}, req.body)
        res.redirect(req.get(`Referer`))
    } catch (error) {
        req.flash("error", "Đã có lỗi xảy ra, vui lòng thử lại");
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
}

module.exports.detail = async(req, res) =>{
    try {
        const record = await Role.findOne({_id: req.params.id})
        res.render("admin/pages/roles/detail", {
            pageTitle: "Chi tiết nhóm quyền",
            record: record
        })
    } catch (error) {
        req.flash("error", "Đã có lỗi xảy ra, vui lòng thử lại");
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
}

module.exports.permissions = async(req, res) =>{
    let find ={
        deleted: false,
    };
    const records= await Role.find(find)
    res.render("admin/pages/roles/permissions",{
        pageTitle: "Phân quyền",
        records: records
    })
}

module.exports.permissionsPatch=async(req, res) =>{
    const permission = JSON.parse(req.body.permissions)
    // console.log(permission)
    for(const item of permission){
        const id= item.id
        const permissions= item.permissions
        // console.log(permissions)
        await Role.updateOne({_id: id},{permission: permissions})
    }
    req.flash("success", "Cập nhật thành công");
    res.redirect(req.get('Referer'));
}