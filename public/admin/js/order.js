//Change-Status
const buttonChangeStatus = document.querySelectorAll("[button-change-status]");
if(buttonChangeStatus.length >0){
    const formChangeStatus = document.querySelector("#form-change-status");
    // console.log(formChangeStatus);
    const path = formChangeStatus.getAttribute("data-path");
    // console.log(path);
    buttonChangeStatus.forEach(button =>{
        button.addEventListener("click", () =>{
            // const url= new URL(document.location.href);
            // console.log(url);
            const statusCurrent= button.getAttribute("data-status");
            const idCurrent = button.getAttribute("data-id");
            // console.log(statusCurrent, idCurrent);
            let statusChange
            if(statusCurrent =="active"){
                statusChange= "inactive";
            }
            else if(statusCurrent=="initial"){
                statusChange="active";
            }
            else if(statusCurrent=="inactive"){
                statusChange="active";
            }
            const action = path+ `/${statusChange}` + `/${idCurrent}?_method=PATCH`;
            console.log(action);
            // formChangeStatus.path= url.href;
            formChangeStatus.action= action;
            formChangeStatus.submit();
        });
    })
    // console.log(buttonChangeStatus);
}

//delete
const btnDelete= document.querySelectorAll("[button-delete]");
if(btnDelete.length>0){
    // console.log(btnDelete);
    const formDelete= document.querySelector("#form-delete");
    const path= formDelete.getAttribute("data-path");
    btnDelete.forEach( item =>{
        item.addEventListener("click", () =>{
            // Product.delete(item.id);
            // console.log(item);
            const isConfirm= confirm("Bạn có chắc chắn muốn xóa đơn hàng này không");
            //ham built in true hoặc false
            if(isConfirm){
                const id= item.getAttribute("data_id");
                const action = `${path}/${id}?_method=DELETE`;
                // console.log(action)
                formDelete.action= action;
                formDelete.submit();
            }
        })
    })
}       
// restore
const btnRestore = document.querySelectorAll("[button-restore]");
if(btnRestore.length>0){
    const formRestore= document.querySelector("#form-restore");
    const path= formRestore.getAttribute("data-path");
    // console.log(btnRestore);
    btnRestore.forEach(button =>{
        button.addEventListener("click", ()=>{
            const isConfirm= confirm("Bạn có muốn khôi phục đơn hàng này không");
            if(isConfirm){
                const id= button.getAttribute("data_id");
                const action= `${path}/${id}?_method=PATCH`
                formRestore.action= action;
                formRestore.submit();
                console.log(id);
            }
        })
    })
}

//product category