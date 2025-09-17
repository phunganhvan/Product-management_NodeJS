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