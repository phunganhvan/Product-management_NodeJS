console.log("OK");

// chức năng gửi yêu cầu

const list_btn_add_friend = document.querySelectorAll("[btn-add-friend]");
if (list_btn_add_friend) {
    list_btn_add_friend.forEach(button => {
        button.addEventListener("click", () => {
            // const myId= 
            const friendId = button.getAttribute("btn-add-friend");
            const parentBoxUser = button.closest(".box-user");
            // console.log(parentBoxUser);
            parentBoxUser.classList.add("add");
            // console.log(friendId);
            socket.emit('CLIENT_ADD_FRIEND', friendId);
        })
    })
}

// chức năng hủy yêu cầu

const list_btn_cancel_friend = document.querySelectorAll("[btn-cancel-friend]");
if (list_btn_cancel_friend) {
    list_btn_cancel_friend.forEach(button => {
        button.addEventListener("click", () => {
            // const myId= 
            const friendId = button.getAttribute("btn-cancel-friend");
            const parentBoxUser = button.closest(".box-user");
            // console.log(parentBoxUser);
            parentBoxUser.classList.remove("add");
            // console.log(friendId);
            socket.emit('CLIENT_CANCEL_ADD', friendId);
        })
    })
}

// chức năng xóa lời mời kết bạn

const listBtnDelete = document.querySelectorAll("[btn-refuse-friend]");
if (listBtnDelete) {
    listBtnDelete.forEach(button => {
        button.addEventListener("click", () => {
            // const myId= 
            const friendId = button.getAttribute("btn-refuse-friend");
            const parentBoxUser = button.closest(".box-user");
            // console.log(parentBoxUser);
            parentBoxUser.classList.add("refuse");
            // console.log(friendId);
            socket.emit('CLIENT_REFUSE_ADD', friendId);
        })
    })
}

// chức năng chấp nhận lời mời kết bạn
const listBtnAccept = document.querySelectorAll("[btn-accept-friend]");
if (listBtnAccept) {
    listBtnAccept.forEach(button => {
        button.addEventListener("click", () => {
            // const myId= 
            const friendId = button.getAttribute("btn-accept-friend");
            const parentBoxUser = button.closest(".box-user");
            // console.log(parentBoxUser);
            parentBoxUser.classList.add("accept");
            // console.log(friendId);
            socket.emit('CLIENT_ACCEPT_ADD', friendId);
        })
    })
}


//SERVER_RETURN_LENGTH_ACP
const badgeUserAccept = document.querySelector("[badge-users-accept]")
if (badgeUserAccept) {
    const user_id= badgeUserAccept.getAttribute("badge-users-accept")
    socket.on("SERVER_RETURN_LENGTH_ACP", (data) => {
        console.log(data);
        // ktra xem đúng người được gửi yêu cầu không
        if(user_id== data.userId){
            badgeUserAccept.innerHTML= data.lengthAcpFriends
        }
        
    })
}



// End SERVER_RETURN_LENGTH_ACP