module.exports = (query) =>{
    let paymentStatus = [
        {
            name: "Tất cả",
            status: "",
            class: ""
        },
        {
            name: "Đã đặt",
            status:"initial",
            class:""
        },
        {
            name: "Đang giao hàng",
            status: "active",
            class: ""
        },
        {
            name: "Đã hủy",
            status: "inactive",
            class: ""
        },
        {
            name: "Đã giao thành công",
            status: "completed",
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
        // paymentStatus.map(item => {
        //     if (item.status === find.status) {
        //         item.class = "active";
        //     }
        //     else {
        //         item.class = "inactive";
        //     }
        //     return item;
        // })
        const index= paymentStatus.findIndex(item => item.status ==query.status);
        paymentStatus[index].class ="active";
    }
    else{
        const index= paymentStatus.findIndex(item => item.status =="");
        paymentStatus[index].class ="active";
    }
    return paymentStatus;
 
}