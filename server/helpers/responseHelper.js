export const sendResponse = (
  res,
  statusCode,
  message = null,
  success,
  data = null
) =>
  res.status(statusCode).json({
    success,
    message,
    status: statusCode,
    data,
  });

export const renderResponse = (res, statusCode, path, data) =>
  res.status(statusCode).render(path, data);
