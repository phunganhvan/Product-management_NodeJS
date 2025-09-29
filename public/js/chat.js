// CLIENT_SEND_MESSAGE

const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
    // console.log(formSendData)
    formSendData.addEventListener("submit", (e) => {
        e.preventDefault();
        const content = e.target.elements.content.value
        if (content) {
            socket.emit("CLIEN_SEND_MESSAGE", content);
            e.target.elements.content.value = "";
        }
    })
}

//END


// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
    // console.log(data);
    const myId = document.querySelector("[chat-id]").getAttribute("chat-id");
    const innerBody = document.querySelector(".chat .inner-body")
    //js cơ bản
    const div = document.createElement("div");
    let htmlFullName = "";
    if (data.userId == myId) {
        div.classList.add("inner-outgoing");
    }
    else {
        div.classList.add("inner-incoming");
        htmlFullName = `<div class="inner-name"> ${data.fullName} </div>`
    }
    div.innerHTML = `
            ${htmlFullName}
            <div class="inner-content"> ${data.content} </div>
        `
    innerBody.appendChild(div);
    bodyChat.scrollTop= bodyChat.scrollHeight;
})
// end SERVER_RETURN_MESSAGE

// fix scroll chat auto o bottom

const bodyChat = document.querySelector(".chat .inner-body");
if(bodyChat){
    bodyChat.scrollTop= bodyChat.scrollHeight;
    // scroll bằng đúng chiều cao
}