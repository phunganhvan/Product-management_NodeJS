
module.exports.index= async(req, res) =>{
    res.render("client/pages/rooms-chat/index", {
        titlePage: "Danh sách cuộc trò chuyện"
    })
}