// [GET] / 
module.exports.index =(req, res) => {
    res.render('client/pages/Home/index', {
        titlePage: "Trang chủ",
    });
}