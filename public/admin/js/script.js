// const Product = require("../../../models/product.model");

console.log("ok");

const buttonStatus = document.querySelectorAll("[button-status]");
// console.log(buttonStatus);
if (buttonStatus.length > 0) {
    let url = new URL(window.location.href);

    buttonStatus.forEach(button => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");
            // console.log(status);
            if (status) {
                url.searchParams.set("status", status);
            }
            else {
                url.searchParams.delete("status");
            }
            url.searchParams.set("page", 1);
            // console.log(url.href);
            // let newActive = button.innerHTML;
            window.location.href = url.href;


            //điều hướng trang
        })
    })
}
//End button status
const formSearch = document.querySelector("#form-search");
if (formSearch) {
    let url = new URL(document.location.href);
    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();
        const item = e.target.elements.keyword.value;
        if (item) {
            url.searchParams.set("title", item);
        }
        else {
            url.searchParams.delete("title");
            console.log("như lồn");
        }
        window.location.href = url.href;
    })
}
// Form Search

//pagination
const pagination = document.querySelectorAll("[button-pagination]");
if (pagination.length > 0) {
    let url = new URL(document.location.href);
    pagination.forEach(item => {
        item.addEventListener("click", () => {
            const pageCurrent = item.getAttribute("button-pagination");
            // console.log(pageCurrent);
            url.searchParams.set("page", pageCurrent);
            window.location.href = url.href;
        });
        // console.log(item.innerHTML);
    })
}


//check box
const checkboxMulti = document.querySelector("[checkbox-multi]");
// console.log(checkboxMulti)

if (checkboxMulti) {
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']")
    // console.log(inputCheckAll);
    const inputIds = checkboxMulti.querySelectorAll("input[name='id']")
    // console.log(inputIds)
    inputCheckAll.addEventListener("click", () => {
        // console.log(inputCheckAll.checked);
        const status = inputCheckAll.checked
        if (status) {
            inputIds.forEach(item => {
                item.checked = true;
            });
        }
        else {
            inputIds.forEach(item => {
                item.checked = false;
            });
        }
    });
    inputIds.forEach(item => {
        item.addEventListener("click", () => {
            const countChecked = checkboxMulti.querySelectorAll(
                "input[name='id']:checked"
            ).length;
            const length = inputIds.length;
            // console.log(length, countChecked);
            if (countChecked == length) {
                inputCheckAll.checked = true;
            }
            else {
                inputCheckAll.checked = false;
            }
        })
    })
}

// end checkbox
//form change multi

const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
    // console.log(formChangeMulti);
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();
        const checkboxMulti = document.querySelector("[checkbox-multi]");
        const checkedBox = checkboxMulti.querySelectorAll(
            "input[name='id']:checked"
        )

        const typeAction = e.target.elements.type.value;
        // console.log(typeAction);
        if (typeAction == "deleteMany") {
            const isConfirm = confirm("Bạn có chắc chắn muốn xóa những lựa chọn này?");
            if (!isConfirm) {
                return;
            }
        }


        if (checkedBox.length > 0) {
            let ids = [];
            let idsInput = formChangeMulti.querySelector("input[name='ids']");
            // let positionInput= formChangeMulti.querySelector("input[name='position']")
            checkedBox.forEach(item => {
                const id = item.getAttribute("value");
                if (typeAction == "changePosition") {
                    // console.log(item);
                    const position = item.closest("tr").querySelector("input[name='position']");
                    // console.log(position.value);
                    const data = `${id}-${position.value}`
                    ids.push(data);
                }
                else {
                    // console.log(id);
                    ids.push(id)
                }
                // hoặc id= item.value
                // console.log(item.getAttribute("value"));
            })
            // console.log(ids.join(", "));
            idsInput.value = ids.join(", ")
            // console.log(idsInput.value);
            formChangeMulti.submit();
        }
        else {
            alert("Vui lòng chọn ít nhất 1 bản ghi");
        }
        // console.log("OK");
    })
}

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
//preview
const upload = document.querySelector("[upload-image]");
if (upload) {
    const uploadImage = document.querySelector("[upload-image-input]");
    const uploadPreview = document.querySelector("[upload-image-preview]");
    const defaultSrcImg = uploadPreview.getAttribute("defaultValue");
    // console.log(defaultSrcImg);
    uploadImage.addEventListener("change", () => {
        const [file] = uploadImage.files
        if (file) {
            // console.log(file);
            uploadPreview.src = URL.createObjectURL(file);
        }
    });
    const closePreview = document.querySelector("[close-preview]")
    closePreview.addEventListener("click", () => {
        let value = uploadImage.value
        if (value) {
            uploadImage.value = "";
            uploadPreview.src = defaultSrcImg;
        }
        else {
            alert("Vui lòng chọn 1 ảnh");
            return;
        }
    })
}

// sắp xếp sản phẩm
const sort = document.querySelector("[sort]");
if (sort) {
    const selectSort = sort.querySelector("[sort-select]");
    const clearSort = sort.querySelector("[sort-clear]");
    let url = new URL(document.location.href);
    // console.log(url);
    selectSort.addEventListener("change", (e) => {
        
        let [sortKey, sortValue] = e.target.value.split("-");
        if (sortKey.length > 0 && sortValue.length > 0) {
            url.searchParams.set("sortKey", sortKey);
            url.searchParams.set("sortValue", sortValue);
            window.location.href = url.href;
        }
    })
    if (clearSort) {
        clearSort.addEventListener("click", () => {
            let url = new URL(document.location.href);
            url.searchParams.delete("sortKey");
            url.searchParams.delete("sortValue");
            window.location.href = url.href;
        })
    }

    //thêm selected cho option
    const sortKey= url.searchParams.get("sortKey");
    const sortValue= url.searchParams.get("sortValue");
    if(sortKey && sortValue) {
        const valuePosition= `${sortKey}-${sortValue}`;
        const option= selectSort.querySelector(`option[value='${valuePosition}']`);
        if(option){
            option.setAttribute("selected", "selected");
        }
    }
}
