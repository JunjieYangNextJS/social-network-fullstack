const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');
const { ObjectId } = require('mongodb');
const { generateUsername } = require('unique-username-generator');
const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Email = require('./../utils/email');
const cleanBadWord = require('./../utils/cleanBadWord');
const filterObj = require('./../utils/filterObj');

const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'postmessage'
);

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    // expires: new Date(
    //   Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    // ),
    httpOnly: true,
    credentials: 'include',

    secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  if (req.body.rememberMe) {
    cookieOptions.expires = new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    );
  } else {
    cookieOptions.maxAge = process.env.JWT_COOKIE_EXPIRES_IN * 24 * 1000;
  }

  res.cookie('jwt', token, cookieOptions);

  // res.cookie('userId', user._id, cookieOptions);
  // res.cookie('username', user.username, cookieOptions);
  // res.cookie('email', user.email, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

const validateHuman = async reCAPTCHAToken => {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${reCAPTCHAToken}`,
    { method: 'POST' }
  );

  const data = await response.json();

  return data.success;
};

const validateUsername = username => {
  const notAllowed = ['secret-teller'];
  if (username !== cleanBadWord(username)) return false;
  if (username.toLowerCase().startsWith('prider')) return false;
  if (notAllowed.includes(username.toLowerCase())) return false;

  return true;
};

exports.signup = catchAsync(async (req, res, next) => {
  const validUsername = validateUsername(req.body.username);

  if (!validUsername) {
    return next(new AppError('This username is not allowed', 403));
  }

  if (!req.isExpo) {
    const human = await validateHuman(req.body.reCAPTCHAToken);

    if (!human) {
      return next(new AppError('Human verify failed', 401));
    }
  }

  let newUser;

  try {
    newUser = await User.create({
      username: req.body.username,
      profileName: req.body.profileName,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      birthMonth: req.body.birthMonth,
      birthDay: req.body.birthDay,
      birthYear: req.body.birthYear,
      createdThrough: req.body.createdThrough || 'web',
      modelName: req.body.modelName || 'PC'
    });
  } catch (e) {
    return next(new AppError('Your username or email is taken', 400));
  }

  // if (process.env.NODE_ENV === 'production')
  //   await new Email(newUser, process.env.FRONTEND_URL).sendWelcome();

  createSendToken(newUser, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  // 1) Check if email and password exist
  if (!username || !password) {
    return next(new AppError('Please provide username and password!', 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ username })
    .select('+password')
    .populate(
      'friendList',
      'photo role username profileName sexuality gender photo role username profileName sexuality gender friendList whoCanMessageMe allowFriending allowFollowing followers incomingFriendRequests'
    )
    .populate('chatRooms ', '-reports');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect username or password', 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, req, res);
});
exports.googleLogin = catchAsync(async (req, res, next) => {
  const { tokens } = await oAuth2Client.getToken(req.body.code); // exchange code for tokens
  const { email, name, at_hash: password } = jwt.decode(tokens.id_token);

  const user = await User.findOne({ email })
    .select('+password')
    .populate(
      'friendList',
      'photo role username profileName sexuality gender photo role username profileName sexuality gender friendList whoCanMessageMe allowFriending allowFollowing followers incomingFriendRequests'
    )
    .populate('chatRooms ', '-reports');

  if (user) {
    createSendToken(user, 201, req, res);
  } else {
    const newUser = await User.create({
      username: name,
      profileName: name,
      email,
      password,
      passwordConfirm: password,
      createdBy: 'google',
      createdThrough: 'web',
      modelName: 'PC'
    });
    if (process.env.NODE_ENV === 'production')
      await new Email(
        newUser,
        process.env.FRONTEND_URL,
        password
      ).sendWelcomeFromGoogleLogin();

    if (!newUser) {
      return next(
        new AppError('Creating new user failed, please try again', 400)
      );
    }

    createSendToken(newUser, 201, req, res);
  }
});

exports.guestLogin = catchAsync(async (req, res, next) => {
  // const { tokens } = await oAuth2Client.getToken(req.body.code); // exchange code for tokens
  // const { email, name, at_hash: password } = jwt.decode(tokens.id_token);

  const name = generateUsername('', 0, 10);

  const email = `${name}@gmail.com`;

  const password = uuidv4();

  const newUser = await User.create({
    username: name,
    profileName: name,
    email,
    password,
    passwordConfirm: password,
    createdBy: 'guest',
    createdThrough: req.body.createdThrough || 'web',
    modelName: req.body.modelName || 'PC'
  });
  // if (process.env.NODE_ENV === 'production')
  // await new Email(
  //   newUser,
  //   process.env.FRONTEND_URL,
  //   password
  // ).sendWelcomeFromGoogleLogin();

  if (!newUser) {
    return next(
      new AppError('Creating new user failed, please try again', 400)
    );
  }

  createSendToken(newUser, 201, req, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there

  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt && req.cookies.jwt !== 'loggedout') {
    token = req.cookies.jwt;
  }

  // console.log(req.cookies);

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;

  next();
});

// Only for rendering pages, no erros!
exports.isLoggedIn = async (req, res, next) => {
  // 1) Getting token and check of it's there

  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt && req.cookies.jwt !== 'loggedout') {
    token = req.cookies.jwt;
  }

  if (token) {
    try {
      // 2) Verification token
      const decoded = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET
      );

      // 3) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 4) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // There is a logged In User

      req.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed username
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with this email.', 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const frontendUrl =
    process.env.NODE_ENV === 'production'
      ? process.env.FRONTEND_URL
      : process.env.FRONTEND_URL_LOCAL;

  try {
    const resetURL = `${frontendUrl}/reset-password/${resetToken}`;
    // const resetURL = `${req.protocol}://${req.get(
    //   'host'
    // )}/api/v1/users/resetPassword/${resetToken}`;

    // await sendEmail({
    //   email: user.email,
    //   subject: 'Your password reset token (valid for 10 min)',
    //   message
    // });
    if (process.env.NODE_ENV === 'production')
      await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token

  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save({ validateBeforeSave: false });

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(user, 200, req, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is invalid.', 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  if (req.body.password !== req.body.passwordConfirm)
    return next(new AppError('Your new passwords do not match.', 401));

  await user.save({ validateBeforeSave: false });

  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  createSendToken(user, 200, req, res);
});

exports.convertGuestToUser = catchAsync(async (req, res, next) => {
  // 1) Get user from req
  const { user } = req;

  if (user.createdBy !== 'guest')
    return next(new AppError('This route is for guests only', 401));

  if (req.body.password !== req.body.passwordConfirm)
    return next(new AppError('Your new passwords do not match.', 401));

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.username = req.body.username;
  user.email = req.body.email;
  user.birthMonth = req.body.birthMonth;
  user.birthDay = req.body.birthDay;
  user.birthYear = req.body.birthYear;
  user.createdBy = 'signup';

  try {
    await user.save({ validateBeforeSave: true });
  } catch (e) {
    return next(new AppError('Your username or email is taken', 400));
  }

  if (process.env.NODE_ENV === 'production' && user)
    await new Email(user, '').sendUserChangedEmail();

  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  createSendToken(user, 200, req, res);
});

exports.updateBirthday = catchAsync(async (req, res, next) => {
  const doc = await User.findByIdAndUpdate(
    req.user.id,
    {
      birthMonth: req.body.birthMonth,
      birthDay: req.body.birthDay,
      birthYear: req.body.birthYear
    },
    {
      new: true,
      runValidators: true
    }
  )
    .populate('chatRooms', '-reports')
    .populate(
      'friendList',
      'photo role username profileName sexuality gender photo role username profileName sexuality gender friendList whoCanMessageMe allowFriending allowFollowing followers incomingFriendRequests'
    );

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: doc
  });
});

exports.updateEmailOrUsername = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  if (req.body.username) {
    const validUsername = validateUsername(req.body.username);

    if (!validUsername)
      return next(new AppError('This new username is not allowed', 403));
  }

  if (req.body.emailCurrent && req.body.emailCurrent === req.body.email)
    return next(new AppError('This new email is not allowed', 403));

  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  const filteredBody = filterObj(req.body, 'email', 'username', 'emailCurrent');

  // 3) If so, update password
  let doc;

  if (filteredBody.emailCurrent) {
    doc = await User.findOneAndUpdate(
      { _id: req.user.id, email: filteredBody.emailCurrent },
      { email: filteredBody.email },
      {
        new: true,
        runValidators: true
      }
    )
      .populate('chatRooms')
      .populate(
        'friendList',
        'photo role username profileName sexuality gender'
      );
    if (process.env.NODE_ENV === 'production' && doc)
      await new Email(doc, '').sendUserChangedEmail();
  } else {
    doc = await User.findByIdAndUpdate(
      req.user.id,
      { username: filteredBody.username },
      {
        new: true,
        runValidators: true
      }
    )
      .populate('chatRooms')
      .populate(
        'friendList',
        'photo role username profileName sexuality gender'
      );
  }

  if (!doc) {
    return next(new AppError('No document found with that ID', 400));
  }

  res.status(200).json({
    status: 'success',
    data: doc
  });
});

exports.deleteMyAccount = catchAsync(async (req, res, next) => {
  // 1) Find user
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.password, user.password))) {
    return next(new AppError('Your password is wrong.', 401));
  }

  const uuid = uuidv4();

  // 3) If so, update info
  user.role = 'bot';
  user.profileName = '[Deleted User]';
  user.active = false;
  user.password = uuid;
  user.email = uuid;

  try {
    await user.save({ validateBeforeSave: false });
  } catch (e) {
    return next(
      new AppError('Account deletion failed, please try again later', 400)
    );
  }

  res.status(200).json({
    status: 'success'
  });
});

exports.deleteMyGuestAccount = catchAsync(async (req, res, next) => {
  // 1) Find user
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if account is guest account
  if (user.createdBy !== 'guest') {
    return next(new AppError('This is not a guest account.', 401));
  }

  const uuid = uuidv4();

  // 3) If so, update info
  user.role = 'bot';
  user.profileName = '[Deleted User]';
  user.active = false;
  user.password = uuid;
  user.email = uuid;

  try {
    await user.save({ validateBeforeSave: false });
  } catch (e) {
    return next(
      new AppError('Account deletion failed, please try again later', 400)
    );
  }

  res.status(200).json({
    status: 'success'
  });
});

exports.createAnonymousRandomUser = catchAsync(async (req, res, next) => {
  if (!req.user) {
    const randomId = new ObjectId();

    const user = await User.create({
      _id: randomId,
      role: 'bot',
      username: `user-${randomId}`,
      profileName: `user-${randomId}`,
      password: `password-${randomId}`,
      passwordConfirm: `password-${randomId}`,
      email: `email-${randomId}@gmail.com`,
      createdThrough: 'web',
      modelName: 'PC'
    });

    req.user = user;
  }

  next();
});
