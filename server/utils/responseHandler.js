const sendResponse = (res, statusCode, message, success, data = null) => {
  return res.status(statusCode).json({
    success,
    message,
    status: statusCode,
    data,
  });
};

const renderResponse = (res, statusCode, path, data) => {
  return res.status(statusCode).render(path, data);
};

export { sendResponse, renderResponse };
