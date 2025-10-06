console.log("OK");

// tối ưu chức năng từ chối kết bạn
const refuseFriend = (button) => {
    button.addEventListener("click", () => {
        // const myId= 
        const friendId = button.getAttribute("btn-refuse-friend");
        const parentBoxUser = button.closest(".box-user");
        // console.log(parentBoxUser);
        parentBoxUser.classList.add("refuse");
        // console.log(friendId);
        socket.emit('CLIENT_REFUSE_ADD', friendId);
    })
};

// tối ưu chức năng chấp nhận kết bạn
const acceptFriend = (button) => {
    button.addEventListener("click", () => {
        // const myId= 
        const friendId = button.getAttribute("btn-accept-friend");
        const parentBoxUser = button.closest(".box-user");
        // console.log(parentBoxUser);
        parentBoxUser.classList.add("accept");
        // console.log(friendId);
        socket.emit('CLIENT_ACCEPT_ADD', friendId);
    })
}

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
        refuseFriend(button);
    })
}

// chức năng chấp nhận lời mời kết bạn
const listBtnAccept = document.querySelectorAll("[btn-accept-friend]");
if (listBtnAccept) {
    listBtnAccept.forEach(button => {
        acceptFriend(button);
    })
}


//SERVER_RETURN_LENGTH_ACP hiển thị số lượng lời mời real time
const badgeUserAccept = document.querySelector("[badge-users-accept]")
if (badgeUserAccept) {
    const user_id = badgeUserAccept.getAttribute("badge-users-accept")
    socket.on("SERVER_RETURN_LENGTH_ACP", (data) => {
        console.log(data);
        // ktra xem đúng người được gửi yêu cầu không
        if (user_id == data.userId) {
            badgeUserAccept.innerHTML = data.lengthAcpFriends
        }

    })
}


// End SERVER_RETURN_LENGTH_ACP

// "SERVER_RETURN_INFO_ACP"  // chấp nhận kết bạn và xóa yêu cầu kết bạn + hiện thị người kết bạn
socket.on("SERVER_RETURN_INFO_ACP", (data) => {
    // trang lời mời đã nhận
    const dataUsersAcp = document.querySelector("[data-users-accept]");
    if (dataUsersAcp) {
        const userId = dataUsersAcp.getAttribute("data-users-accept");
        // console.log(data);
        // ktra xem đúng người được gửi yêu cầu không
        if (userId == data.userId) {
            //vẽ user ra giao diện
            const div = document.createElement("div");
            div.classList.add('col-4');
            div.setAttribute("user-id", data.infoUserReq._id)
            div.innerHTML = `
                <div class="box-user flex">
                    <div class="inner-avatar">
                        <img src="/admin/images/avatar.png" alt=${data.infoUserReq.fullName}>
                    </div>
                    <div class="inner-info flex">
                        <div class="inner-name">${data.infoUserReq.fullName}</div>
                        <div class="inner-buttons flex">
                            <button class="btn btn-sm btn-primary mr-1" btn-accept-friend=${data.infoUserReq._id}>
                                Chấp nhận
                            </button>
                            <button class="btn btn-sm btn-danger mr-1" btn-refuse-friend=${data.infoUserReq._id}>
                                Xóa
                            </button>
                            <button 
                                class="btn btn-sm btn-secondary mr-1" 
                                btn-deleted-friend 
                                disabled
                            > Đã xóa
                            </button>
                            <button 
                                class="btn btn-sm btn-primary mr-1" 
                                btn-accepted-friend 
                                disabled
                            > Đã chấp nhận
                            </button>
                        </div>
                    </div>
                </div>
            `
            dataUsersAcp.appendChild(div);

            // Hủy lời mời kết bạn
            const btnRefuse = div.querySelector("[btn-refuse-friend]");
            refuseFriend(btnRefuse);
            //end hủy lời mời kết bạn

            //chấp nhận lời mời kết bạn
            const btnAccept = div.querySelector("[btn-accept-friend]");
            acceptFriend(btnAccept)
            //end chấp nhận lời mời kết bạn
        }

    }

    // trang danh sách người dùng
    const dataUsersNotFriend = document.querySelector("[data-users-not-friend]");
    if (dataUsersNotFriend) {
        const userId = dataUsersNotFriend.getAttribute("data-users-not-friend")
        if (userId == data.userId) {
            // tìm xem thấy người gửi kết bạn kia không để xóa
            const boxRemove = dataUsersNotFriend.querySelector(`[user-id= '${data.infoUserReq._id}']`);
            if (boxRemove) {
                dataUsersNotFriend.removeChild(boxRemove);

            }

        }
    }
});

// END

//SERVER_RETURN_CANCEL_REQ 
socket.on("SERVER_RETURN_CANCEL_REQ", (data) => {
    const myId = data.myId // id của người gửi yêu cầu
    const boxRemove = document.querySelector(`[user-id= '${myId}']`);
    if (boxRemove) {
        const user_id = badgeUserAccept.getAttribute("badge-users-accept")
        const dataUsersAcp = document.querySelector("[data-users-accept]");
        if (user_id == data.friendId) {
            dataUsersAcp.removeChild(boxRemove);
        }
    }

});
//END SERVER_RETURN_CANCEL_REQ

// server return onine offline

socket.on("SERVER_RETURN_STATUS", (data) =>{
    const dataUserFriend= document.querySelector("[data-friend]");
    if(dataUserFriend){
        const boxUser= dataUserFriend.querySelector(`[user-id='${data.userId}']`);
        if(boxUser){
            const boxStatus= boxUser.querySelector("[status]");
            boxStatus.setAttribute("status", data.status);
        }

    }
});


