module.exports = (query) =>{
    let filterStatus = [
        {
            name: "Tất cả",
            status: "",
            class: ""
        },
        {
            name: "Hoạt động",
            status: "active",
            class: ""
        },
        {
            name: "Dừng hoạt động",
            status: "inactive",
            class: ""
        },
        {
            name: "Đã bị xóa",
            status: "deleted",
            class: ""
        }
    ];
    if (query.status) {
        // find.status =query.status;
        // filterStatus.map(item => {
        //     if (item.status === find.status) {
        //         item.class = "active";
        //     }
        //     else {
        //         item.class = "inactive";
        //     }
        //     return item;
        // })
        const index= filterStatus.findIndex(item => item.status ==query.status);
        filterStatus[index].class ="active";
    }
    else{
        const index= filterStatus.findIndex(item => item.status =="");
        filterStatus[index].class ="active";
    }
    return filterStatus;
 
}