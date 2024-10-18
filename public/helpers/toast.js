const errorMessage =
  'An Unexpected Error Occurred. Please try again later.';

const showToast = (message, isSuccess = true) => {
  Toastify({
    text: message,
    duration: 3000,
    gravity: 'top',
    position: 'right',
    style: {
      background: isSuccess ? 'green' : 'red',
    },
  }).showToast();
};

export { showToast, errorMessage };
