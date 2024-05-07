const AppError = require('./../utils/appError');

// const sendErrorDev = (err, res) => {
//   res.status(err.statusCode).json({
//     status: err.status,
//     error: err,
//     message: err.message,
//     stack: err.stack
//   });
// };

const sendErrorProd = (err, res) => {
  if (err.statusCode < 500) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message
    });
  }
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: 'Your request was unsuccessful, please try again or later'
  });
};

// const sendErrorProd = (err, res) => {
//   // Operational, trusted error: send message to client
//   if (err.isOperational) {
//     res.status(err.statusCode).json({
//       status: err.status,
//       message: err.message
//     });

//     // Programming or other unknown error: don't leak error details
//   } else {
//     // 1) Log error
//     console.error('ERROR', err);

//     // 2) Send generic message
//     res.status(500).json({
//       status: 'err',
//       message: 'Something went very wrong!'
//     });
//   }
// };

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const message = `${Object.keys(err.keyValue)} is already in use.`;
  return new AppError(message, 400);
};
// const handleDuplicateFieldsDB = err => {
//   const message = `Duplicate field value: ${
//     err&&err.keyValue[Object.keys(err.keyValue)[0]]
//   }. Please use another value!`;
//   return new AppError(message, 400);
// };
// const handleDuplicateFieldsDB = err => {
//   const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
//   console.log(value);

//   const message = `Duplicate field value: ${value}. Please use another value!`;
//   return new AppError(message, 400);
// };

const handleValidationErrorDb = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = { ...err };

  // if (err instanceof mongoose.Error.CastError)
  if (err.name === 'CastError') error = handleCastErrorDB(error);
  if (err.code === 11000) error = handleDuplicateFieldsDB(error);
  // if (err instanceof mongoose.Error.ValidationError)
  if (err.name === 'ValidationError') error = handleValidationErrorDb(error);
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

  error.message = err.message;
  // error.message = err.message;
  sendErrorProd(error, res);

  // else if (process.env.NODE_ENV === 'production') {
  //   let error = { ...err };

  //   if (err instanceof mongoose.Error.CastError)
  //     error = handleCastErrorDB(error);
  //   if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  //   if (err instanceof mongoose.Error.ValidationError)
  //     error = handleValidationErrorDb(error);
  //   if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
  //   if (error.name === 'TokenExpiredError')
  //     error = handleJWTExpiredError(error);

  //   sendErrorProd(error, res);
  // }

  res.status();
};
