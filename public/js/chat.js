import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

// file upload with preview
// const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-images');

//end


// CLIENT_SEND_MESSAGE

const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
    // console.log(formSendData)
    formSendData.addEventListener("submit", (e) => {
        e.preventDefault();
        const content = e.target.elements.content.value
        if (content) {
            socket.emit("CLIENT_SEND_MESSAGE", content);
            e.target.elements.content.value = "";
            socket.emit("CLIENT_SEND_TYPING", "hidden");
        }
    })
}

//END


// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
    // console.log(data);
    const myId = document.querySelector("[chat-id]").getAttribute("chat-id");
    const innerBody = document.querySelector(".chat .inner-body")
    const BoxTyping = document.querySelector(".chat .inner-list-typing");
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
        `;
    // innerBody.appendChild(div);
    innerBody.insertBefore(div, BoxTyping);
    // insert trước cái ba chấm
    bodyChat.scrollTop = bodyChat.scrollHeight;
})
// end SERVER_RETURN_MESSAGE

// fix scroll chat auto o bottom

const bodyChat = document.querySelector(".chat .inner-body");
if (bodyChat) {
    bodyChat.scrollTop = bodyChat.scrollHeight;
    // scroll bằng đúng chiều cao
}

// emoji-picker0-elemet
//show pop up

// import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'
const buttonIcon = document.querySelector('.button-icon')
if (buttonIcon) {
    //     // console.log(buttonIcon)
    const tooltip = document.querySelector('.tooltip')
    Popper.createPopper(buttonIcon, tooltip)

    buttonIcon.onclick = () => {
        tooltip.classList.toggle('shown');
        // console.log("click");
    }
}
//end show pop up

//show Typing function
var timeOut;
const showTyping =() =>{
    socket.emit("CLIENT_SEND_TYPING", "show");

        clearTimeout(timeOut);

        timeOut = setTimeout(() => {
            socket.emit("CLIENT_SEND_TYPING", "hidden");
        }, 5000)
}
// end show

//insert icon to input

const emojiPicker = document.querySelector('emoji-picker');
if (emojiPicker) {
    const inputChat = document.querySelector(".chat .inner-form input[name='content']")
    emojiPicker.addEventListener('emoji-click', (event) => {
        showTyping();
        const icon = event.detail.unicode;
        inputChat.value = inputChat.value + icon;
        const end= inputChat.value.length;
        inputChat.setSelectionRange(end, end)
        inputChat.focus();
        //     // console.log(event.detail)
    });


    // input key up ( khi người dùng click vào ô input)
    inputChat.addEventListener("keyup", () => {
        showTyping();
        // socket.emit("CLIENT_SEND_TYPING", "hidden");
    });

    // end input
}
//end insert
//end show icon

// SERVER RETURN TYPING
const elementListTyping = document.querySelector(".chat .inner-list-typing");
if (elementListTyping) {
    socket.on("SERVER_RETURN_TYPING", (data) => {
        if (data.type == "show") {
            //             console.log(data);
            const existTyping = elementListTyping.querySelector(`[user-id="${data.userId}"]`);
            if (!existTyping) {
                const boxTyping = document.createElement("div");

                boxTyping.classList.add("box-typing")
                boxTyping.setAttribute("user-id", data.userId)
                boxTyping.innerHTML = `
                        <div class="inner-name">${data.fullName}</div>
                        <div class="inner-dots">
                            <span></span> 
                            <span></span> 
                            <span></span> 
                        </div>
                    `;

                elementListTyping.appendChild(boxTyping);
                bodyChat.scrollTop = bodyChat.scrollHeight;
            }
            else{
                return;
            }
        }
        else {
            const boxTypingRemove = elementListTyping.querySelector(`[user-id='${data.userId}']`);
            if (boxTypingRemove) {
                elementListTyping.removeChild(boxTypingRemove);
            }
        }
    });
}



// END SERVER RETURN TYPING