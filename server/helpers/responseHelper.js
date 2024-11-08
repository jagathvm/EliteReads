const sendResponse = (res, statusCode, message, success, data = null) =>
  res.status(statusCode).json({
    success,
    message,
    status: statusCode,
    data,
  });

const renderResponse = (res, statusCode, path, data) =>
  res.status(statusCode).render(path, data);

export { sendResponse, renderResponse };
