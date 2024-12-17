export const showToast = (
  message,
  isSuccess = true,
  pos = "right",
  grav = "top"
) => {
  Toastify({
    text: message,
    duration: 3000,
    gravity: grav,
    position: pos,
    stopOnFocus: true,
    style: {
      background: isSuccess ? "green" : "red",
    },
  }).showToast();
};
