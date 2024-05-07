const Secret = require('./../models/secretModel');
const SecretComment = require('./../models/secretCommentModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

const { cleanSanitize } = require('./../utils/sanitize');

// exports.weeklyTopSecrets = (req, res, next) => {
//   req.query.limit = '5';
//   req.query.sort = '-ratingsAverage,price';
//   req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
//   next();
// };

exports.getSecret = catchAsync(async (req, res, next) => {
  // const docComment = await SecretComment.find({})

  const doc = await Secret.findById(req.params.id);

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  let comments;

  if (doc.secretTeller.toString() === req.user.id) {
    comments = await SecretComment.find({
      secret: doc._id,
      hiddenBy: { $ne: req.user.id }
    });
  } else {
    comments = await SecretComment.find({
      secret: doc._id,
      commenter: req.user._id
    });
  }

  // console.log(comments, 'comments');
  // if (doc.secretTeller === req.user._id) {
  //   comments = await SecretComment.find({ secret: doc._id });

  //   const group = Object.values(
  //     comments.reduce((acc, item) => {
  //       // Append the item to the array for each country
  //       acc[item.commenter] = [...(acc[item.commenter] || []), item];
  //       return acc;
  //     }, {})
  //   );

  //   res.status(200).json({
  //     group,
  //     secret: doc,
  //     comments: null
  //   });
  // } else {
  //   comments = await SecretComment.find({
  //     secret: doc._id,
  //     commenter: req.user._id || doc.secretTeller
  //   });

  res.status(200).json({
    secret: doc,
    comments
  });
  // }
});

exports.getAllSecrets = catchAsync(async (req, res, next) => {
  if (req.user) {
    const features = new APIFeatures(
      Secret.find({
        exposedTo: 'public',
        expiredAt: { $gte: new Date().toISOString() },
        secretTeller: { $nin: req.user.blockedUsers },
        _id: { $nin: req.user.hiddenSecrets },
        sexuality: {
          $elemMatch: { $in: [req.user.sexuality.toLowerCase(), 'everyone'] }
        },
        gender: {
          $elemMatch: { $in: [req.user.gender.toLowerCase(), 'everyone'] }
        }
        // sexuality: { $in: [req.user.sexuality, 'everyone'] },
        // gender: { $in: [req.user.gender, 'everyone'] }
      }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;

    // const doc = await features.query;

    const totalDocsInDB = await Secret.countDocuments({
      exposedTo: 'public',
      expiredAt: { $gte: new Date().toISOString() },
      secretTeller: { $nin: req.user.blockedUsers },
      _id: { $nin: req.user.hiddenSecrets },
      sexuality: {
        $elemMatch: { $in: [req.user.sexuality.toLowerCase(), 'everyone'] }
      },
      gender: {
        $elemMatch: { $in: [req.user.gender.toLowerCase(), 'everyone'] }
      }
    });

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      data: doc,
      totalDocsInDB
    });
  } else {
    const features = new APIFeatures(
      Secret.find({
        exposedTo: 'public',
        expiredAt: { $gte: new Date().toISOString() },
        sexuality: { $elemMatch: { $eq: 'everyone' } },
        gender: { $elemMatch: { $eq: 'everyone' } }
      }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;

    // const doc = await features.query;

    const totalDocsInDB = await Secret.countDocuments({
      exposedTo: 'public',
      expiredAt: { $gte: new Date().toISOString() },
      sexuality: { $elemMatch: { $eq: 'everyone' } },
      gender: { $elemMatch: { $eq: 'everyone' } }
    });

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',

      data: doc,
      totalDocsInDB
    });
  }
});

// exports.createSecret = factory.createOne(Secret);

exports.createSecret = catchAsync(async (req, res, next) => {
  if (req.body.content.length > 10000)
    return next(new AppError('Your content is too long', 400));

  if (!Number.isInteger(req.body.expiredAt)) {
    return next(new AppError('Please enter a validate expiration time', 400));
  }

  let doc;

  // const sanitizedTitle = cleanBadWord(sanitize(req.body.title));
  const sanitizedContent = cleanSanitize(req.body.content);

  try {
    doc = await Secret.create({
      expiredAt: req.body.expiredAt,
      secretTeller: req.user.id,
      tempUsername: req.body.tempUsername,
      content: sanitizedContent,
      willNotify: req.body.willNotify,
      exposedTo: req.body.exposedTo,
      gender: req.body.gender.length === 0 ? ['everyone'] : req.body.gender,
      sexuality:
        req.body.sexuality.length === 0 ? ['everyone'] : req.body.sexuality
    });

    // cleanse and create

    // update post's commentCount per postComment created
  } catch (e) {
    return next(new AppError('Oops, something is wrong', 400));
  }

  res.status(201).json({
    status: 'success',
    data: {
      data: doc
    }
  });
});

exports.patchSecret = catchAsync(async (req, res, next) => {
  if (req.body.content.length > 2000)
    return next(new AppError('Your content is too long', 400));

  if (!Number.isInteger(req.body.expiredAt)) {
    return next(new AppError('Please enter a validate expiration time', 400));
  }

  // const sanitizedTitle = cleanBadWord(sanitize(req.body.title));
  const sanitizedContent = cleanSanitize(req.body.content);

  const doc = await Secret.findOneAndUpdate(
    { _id: req.params.id, secretTeller: req.user.id },
    {
      expiredAt: req.body.expiredAt * 1000 * 60 * 60 * 24 + Date.now(),
      editedAt: Date.now(),
      // anonymous: req.body.anonymous,
      // title: sanitizedTitle,
      content: sanitizedContent
    },
    {
      new: true,
      runValidators: true
    }
  );

  // cleanse and create

  // update post's commentCount per postComment created

  if (!doc)
    return next(new AppError('You are not authorized to edit this', 401));

  res.status(201).json({
    status: 'success',
    data: doc
  });
});

exports.patchSecretWillNotify = catchAsync(async (req, res, next) => {
  const doc = await Secret.findOneAndUpdate(
    { _id: req.params.id, secretTeller: req.user.id },
    {
      willNotify: req.body.willNotify
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!doc)
    return next(new AppError('You are not authorized to edit this', 401));

  res.status(201).json({
    status: 'success',
    data: doc
  });
});

// exports.createSecret = catchAsync(async (req, res, next) => {
//   if (req.body.content.length > 2000)
//     return next(new AppError('Your content is too long', 400));

//   if (!Number.isInteger(req.body.expiredAt)) {
//     return next(new AppError('Please enter a validate expiration time', 400));
//   }

//   // if (req.body.expiredAt - 550000 <= Date.now()) {
//   //   return next(
//   //     new AppError('Secrets should not expire in less than 10 minutes', 400)
//   //   );
//   // }

//   let doc;

//   const sanitizedContent = cleanBadWord(sanitize(req.body.content));

//   try {
//     doc = await Secret.create({
//       expiredAt: req.body.expiredAt,
//       secretTeller: mongoose.Types.ObjectId(req.user.id),
//       // anonymous: req.body.anonymous,
//       content: sanitizedContent
//     });

//     // cleanse and create

//     // update post's commentCount per postComment created
//   } catch (e) {
//     return next(new AppError('Oops, something is wrong', 400));
//   }

//   res.status(201).json({
//     status: 'success',
//     data: {
//       data: doc
//     }
//   });
// });

// exports.updateSecret = factory.updateOne(Secret, 'content', 'secretTeller');
exports.deleteSecret = factory.deleteOne(Secret, 'secretTeller');
exports.updateSecretReports = factory.updateReports(Secret);

exports.getAllUserSecrets = factory.getAllUserCreations(
  Secret,
  'secretTeller',
  'secretTellerId',
  'secrets',
  'secretsExposedTo'
);

exports.updateSecretFromViewers = catchAsync(async (req, res, next) => {
  const doc = await Secret.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: doc
    }
  });
});
