document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');

  if (!form) return; // Nếu không có form thì không làm gì

  form.addEventListener('submit', (e) => {
    const newPw = document.querySelector('#newPassword')?.value.trim() || '';
    const confirmPw = document.querySelector('#confirmPassword')?.value.trim() || '';
    const currPw = document.querySelector('#currentPassword')?.value.trim() || '';

    // Nếu người dùng có nhập mật khẩu mới hoặc xác nhận mật khẩu
    if (newPw || confirmPw) {
      if (!currPw) {
        e.preventDefault();
        alert('Vui lòng nhập mật khẩu hiện tại trước khi đổi mật khẩu.');
        return;
      }

      if (newPw !== confirmPw) {
        e.preventDefault();
        alert('Mật khẩu mới và xác nhận mật khẩu không khớp.');
        return;
      }

      if (newPw.length < 6) {
        e.preventDefault();
        alert('Mật khẩu mới phải có ít nhất 6 ký tự.');
        return;
      }
    }
  });
});
