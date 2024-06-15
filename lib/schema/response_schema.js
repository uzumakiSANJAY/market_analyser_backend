exports.RESPONSE = ({
  res,
  resource = null,
  message = "Success",
  statusCode = 200,
  status = true,
}) => {
  res.status(statusCode).json({
    statusCode,
    status,
    message: message,
    resource,
  });
};

exports.RESPONSE_ERROR = ({
  res,
  message = "Oops, Something went wrong",
  statusCode = 500,
  status = false,
}) => {
  res.status(statusCode).json({
    statusCode,
    status,
    errors: message,
  });
};

exports.UNAUTHENTICATED = ({
  res,
  message = "Authentication Failed",
  statusCode = 401,
  status = false,
}) => {
  res.status(statusCode).json({
    statusCode,
    status,
    errors: message,
  });
};

exports.UNAUTHORIZED = ({
  res,
  message = "Access Forbidden!",
  statusCode = 403,
  status = false,
}) => {
  res.status(statusCode).json({
    statusCode,
    status,
    errors: message,
  });
};

exports.BAD = ({
  res,
  message = "Bad Request",
  statusCode = 400,
  status = false,
}) => {
  res.status(statusCode).json({
    statusCode,
    status,
    errors: message,
  });
};

exports.NOT_FOUND = ({
  res,
  message = "Page not found",
  statusCode = 404,
  status = false,
}) => {
  res.status(statusCode).json({
    statusCode,
    status,
    errors: message,
  });
};
