const express = require('express');
const morgan = require('morgan');
const path = require('path');

// const multer = require('multer');
// const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
// const xss = require('xss-clean');
// const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const compression = require('compression');
// const sanitizeHtml = require('sanitize-html');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const sitemapRouter = require('./routes/sitemapRouter');
const userRouter = require('./routes/userRoutes');
// const autoRouter = require('./controllers/automaticController');
const postRouter = require('./routes/postRoutes');
const postCommentRouter = require('./routes/postCommentRoutes');
const postReplyRouter = require('./routes/postReplyRoutes');
const storyRouter = require('./routes/storyRoutes');
const storyCommentRouter = require('./routes/storyCommentRoutes');
const storyReplyRouter = require('./routes/storyReplyRoutes');
const secretRouter = require('./routes/secretRoutes');
const secretCommentRouter = require('./routes/secretCommentRoutes');
const newsRouter = require('./routes/newsRoutes');
const DMRouter = require('./routes/DMRoutes');
const chatRoomRouter = require('./routes/chatRoutes/chatRoomRoutes');
const chatMessageRouter = require('./routes/chatRoutes/chatMessageRoutes');
// const { s3, generateUploadURL } = require('./s3');

const app = express();

// 1) GLOBAL MIDDLEWARES
// Serving static files

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 200,
  windowMs: 1 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an 5 mins!'
});
app.use('/api', limiter);

const whitelist =
  process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : process.env.FRONTEND_URL_LOCAL;

// app.use(cors('*'));
app.use(cors({ credentials: true, origin: whitelist }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', whitelist);
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With,Content-Type,Accept,Authorization'
  );
  res.header('Access-Control-Allow-Credentials', true);
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,DELETE');
    return res.status(200).json({});
  }
  next();
});

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
// app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// app.use(upload.array());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
// app.use(xss());

// Prevent parameter pollution
// app.use(
//   hpp({
//     whitelist: [
//       'duration',
//       'ratingsQuantity',
//       'ratingsAverage',
//       'maxGroupSize',
//       'difficulty',
//       'price'
//     ]
//   })
// );

app.use(compression());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

app.use((req, res, next) => {
  function isExpoRequest() {
    const userAgent = req.headers['user-agent'];

    if (!userAgent) return false; // No User-Agent header, so not Expo

    return userAgent.startsWith('Expo/') && userAgent.length > 6;
  }

  const isExpo = isExpoRequest();
  req.isExpo = isExpo;

  // if (isExpo) {
  //   // Handle Expo requests differently
  //   console.log('Handling Expo request!');

  //   // Send specific response format or perform Expo-specific actions
  // } else {
  //   // Handle non-Expo requests normally
  //   console.log('Handling non-Expo request');
  //   // Your usual request handling logic
  // }

  next(); // Continue processing the request
});

// app.post('/api/v1/send_email', cors(), async (req, res) => {
//   const transport = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD
//     }
//   });

//   await transport.sendMail({
//     from: process.env.EMAIL_FROM,
//     to: req.body.email,
//     subject: req.body.email,
//     html: `<div>${req.body.text}</div>`
//   });
// });

// 3) ROUTES
// app.get('/api/v1/s3Url', async (req, res) => {
//   const url = await generateUploadURL();
//   res.send({ url });
// });

// app.get('/favicon.ico', (req, res) => res.status(204).end());
// app.get('/', (req, res) => res.status(204).end());
// const router = express.Router();

// router.get('/', (req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Credentials', 'true');
//   res.setHeader('Access-Control-Max-Age', '1800');
//   res.setHeader('Access-Control-Allow-Headers', 'content-type');
//   res.setHeader(
//     'Access-Control-Allow-Methods',
//     'PUT, POST, GET, DELETE, PATCH, OPTIONS'
//   );

//   res.status(200).json({
//     status: 'success',
//     data: {
//       name: 'name of your app',
//       version: '0.1.0'
//     }
//   });
// });
app.use((req, res, next) => {
  if (req.isExpo || process.env.NODE_ENV === 'development') return next();
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    next();
  } else {
    res.redirect(301, 'https://www.priders.net');
  }
});

// app.use('api/auto', autoRouter);
app.use(sitemapRouter);

app.use('/api/v1/users', userRouter);

// Posts
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/postComments', postCommentRouter);
app.use('/api/v1/postReplies', postReplyRouter);
// Stories
app.use('/api/v1/stories', storyRouter);
app.use('/api/v1/storyComments', storyCommentRouter);
app.use('/api/v1/storyReplies', storyReplyRouter);
// Secrets
app.use('/api/v1/secrets', secretRouter);
app.use('/api/v1/secretComments', secretCommentRouter);
// News

app.use('/api/v1/news', newsRouter);
// Reviews
app.use('/api/v1/DMs', DMRouter);
// Chat
app.use('/api/v1/chatRooms', chatRoomRouter);
app.use('/api/v1/chatMessages', chatMessageRouter);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Api running');

    app.use(morgan('dev'));
  });
}

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
