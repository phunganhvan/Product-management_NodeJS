module.exports = (query) =>{
    let orderStatus = [
        {
            name: "Tất cả",
            status: "",
            class: ""
        },
        {
            name: "Chờ duyệt",
            status:"initial",
            class:""
        },
        {
            name: "Hoạt động",
            status: "active",
            class: ""
        },
        {
            name: "Ngừng hoạt động",
            status: "inactive",
            class: ""
        },
        {
            name: "Đã hoàn thành",
            status: "done",
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
        // orderStatus.map(item => {
        //     if (item.status === find.status) {
        //         item.class = "active";
        //     }
        //     else {
        //         item.class = "inactive";
        //     }
        //     return item;
        // })
        const index= orderStatus.findIndex(item => item.status ==query.status);
        orderStatus[index].class ="active";
    }
    else{
        const index= orderStatus.findIndex(item => item.status =="");
        orderStatus[index].class ="active";
    }
    return orderStatus;
 
}