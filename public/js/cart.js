// cập nhật lại số lượng

const inputsQuantity= document.querySelectorAll("input[name='quantity']");
if(inputsQuantity.length>0) {
    inputsQuantity.forEach(item =>{
        item.addEventListener("change", (e) =>{
            // console.log("thay đổi");
            // console.log(item.getAttribute("item-id"));
            // item.value - giá trị số lượng
            const newQuantity= item.value;
            const productId= item.getAttribute("product-id");
            window.location.href =`/cart/update-quantity/${productId}/${newQuantity}`;
        })
    })
}