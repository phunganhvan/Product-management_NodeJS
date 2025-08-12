module.exports = (query) =>{
    let keyword= "";
    if(query.title){
        keyword= query.title;
        const regex= new RegExp(`${keyword}`,"i");
        return {
            keyword: keyword,
            regex: regex
        }
    }
}