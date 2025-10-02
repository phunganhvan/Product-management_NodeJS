console.log("OK");

// chức năng gửi yêu cầu

const list_btn_add_friend= document.querySelectorAll("[btn-add-friend]");
if(list_btn_add_friend){
    list_btn_add_friend.forEach( button =>{
        button.addEventListener("click", () => {
            // const myId= 
            const friendId= button.getAttribute("btn-add-friend");
            const parentBoxUser= button.closest(".box-user");
            // console.log(parentBoxUser);
            parentBoxUser.classList.add("add");
            // console.log(friendId);
            socket.emit('CLIENT_ADD_FRIEND',friendId);
        })
    })
}

// chức năng hủy yêu cầu

const list_btn_cancel_friend= document.querySelectorAll("[btn-cancel-friend]");
if(list_btn_cancel_friend){
    list_btn_cancel_friend.forEach( button =>{
        button.addEventListener("click", () => {
            // const myId= 
            const friendId= button.getAttribute("btn-cancel-friend");
            const parentBoxUser= button.closest(".box-user");
            // console.log(parentBoxUser);
            parentBoxUser.classList.remove("add");
            // console.log(friendId);
            socket.emit('CLIENT_CANCEL_ADD',friendId);
        })
    })
}

// chức năng xóa lời mời kết bạn

const listBtnDeleteRequest= document.querySelectorAll("[btn-refuse-friend]");
if(listBtnDeleteRequest){
    listBtnDeleteRequest.forEach( button =>{
        button.addEventListener("click", () => {
            // const myId= 
            const friendId= button.getAttribute("btn-refuse-friend");
            const parentBoxUser= button.closest(".box-user");
            // console.log(parentBoxUser);
            parentBoxUser.classList.add("refuse");
            // console.log(friendId);
            socket.emit('CLIENT_REFUSE_ADD',friendId);
        })
    })
}