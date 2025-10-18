const Account= require("../../models/account.model")
const Role= require("../../models/role.model")
const systemConfig= require("../../config/system");
const generateHelper = require("../../helpers/generate")
const md5= require('md5')
module.exports.index =async(req, res) =>{
    let find={
        status: "active",
        deleted: false,
    }
    const records = await Account.find(find).select("-password-token");

    const permissionTitle=[];
    for(const record of records){
        const role= await Role.findOne({
            _id: record.role_id,
            deleted: false
        })
        record.role= role

    }
    res.render("admin/pages/accounts/index",{
        pageTitle: "Danh sách tài khoản",
        records: records,
    })
    // res.send("OK")
}

module.exports.create = async(req, res) =>{
     let find={
        deleted: false,
    }
    const role= await Role.find(find);
    res.render("admin/pages/accounts/create",{
        pageTitle: "Tạo mới tài khoản",
        roles: role
    })
}

module.exports.createPost = async(req, res) =>{
    const emailExist= await Account.findOne({
        email: req.body.email,
        deleted: false
    });
    if(emailExist){
        req.flash("error", "Email đã được sử dụng, vui lòng điền email khác");
        res.redirect(req.get('Referer'));
    }
    else{
        req.body.password= md5(req.body.password);
        req.body.token= generateHelper.generateRandomString(30);
        const records= new Account(req.body)
        await records.save()
        req.flash("success", "Tạo tài khoản thành công");
        res.redirect(`${systemConfig.prefixAdmin}/accounts`)
    }
}

module.exports.edit = async(req, res) =>{
    const roles= await Role.find({
        deleted: false,
    })
    const idUser= req.params.id
    const record= await Account.findOne({_id: idUser}).select("-password-token")
    res.render("admin/pages/accounts/edit", {
        pageTitle: "Chỉnh sửa tài khoản",
        record: record,
        roles: roles
    })
}

module.exports.editPatch= async(req, res) =>{
    const id= req.params.id;
    const emailExist= await Account.findOne({
        _id: {$ne: id},
        email: req.body.email,
        deleted: false
    });
    if(emailExist){
        req.flash("error", "Email đã được sử dụng, vui lòng điền email khác");
    }
    else{
        if(req.body.password){
            req.body.password= md5(req.body.password)
        }
        else{
            delete req.body.password;
        }
        await Account.updateOne({
            _id: req.params.id
        }, req.body)
        req.flash("success", "Cập nhật tài khoản thành công")
    }
    res.redirect(req.get('Referer'));
}