const errorMessage = "An Unexpected Error Occurred. Please try again later.";

const showToast = (message, isSuccess = true, pos = "right") => {
  Toastify({
    text: message,
    duration: 3000,
    gravity: "top",
    position: pos,
    style: {
      background: isSuccess ? "green" : "red",
    },
  }).showToast();
};

export { showToast, errorMessage };
