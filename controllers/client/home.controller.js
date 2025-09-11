// [GET] / 
module.exports.index =async(req, res) => {
    
    // console.log(newProductsCatagory)
    res.render('client/pages/Home/index', {
        titlePage: "Trang chủ",
    });
}