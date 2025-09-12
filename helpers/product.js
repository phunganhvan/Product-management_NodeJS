module.exports.priceNew = (products) =>{
    const newProducts = products.map(item => {
        item.priceNew = (item.price * (100 - item.discountPercentage) / 100).toFixed();
        return item;
    });
    return newProducts;
}

module.exports.priceNewProduct = (products) =>{
    products.priceNew = (products.price * (100 - products.discountPercentage) / 100).toFixed();
    return products;
}