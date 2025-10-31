module.exports.formatVND = (amount) => {
    amount= parseInt(amount);
    return amount.toLocaleString('vi-VN') + ' VNĐ';
}