console.log("Load ok");

// logic cho alert 

const showAlert = document.querySelector("[show-alert]");

if (showAlert) {
    const time = parseInt(showAlert.getAttribute("data-time"));
    const closeAlert = showAlert.querySelector("[close-alert]");
    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden")
        return
    })
    setTimeout(() => {
        showAlert.classList.add("alert-hidden")
    }, time)
}


// Detect browser or tab closing
// let isReload = false;

// // Dùng API Performance để xác định reload
// window.addEventListener("load", () => {
//   const navType = performance.getEntriesByType("navigation")[0].type;
//   if (navType === "reload") {
//     isReload = true;
//   }
// });

// // Khi tab bị đóng hoặc chuyển trang
// window.addEventListener("pagehide", (e) => {
//   if (!isReload) {
//     socket.emit("CLIENT_CLOSE_TAB", "xin chào");
//   }
// });

// End Detect browser or tab closing