// const sanitizeHtml = require('sanitize-html');
const DM = require('./../models/DMModel');
const User = require('./../models/userModel');
const Secret = require('./../models/secretModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const cleanBadWord = require('./../utils/cleanBadWord');
const genericErrorMessage = require('./../utils/genericErrorMessage');

// exports.getAllNews = factory.getAll(News);

// exports.getAllNews = catchAsync(async (req, res, next) => {
//   // To allow for nested GET reviews on tour (hack)
//   // let filter = {};
//   // if (req.params.tourId) filter = { tour: req.params.tourId };

//   const features = new APIFeatures(News.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();
//   const docs = await features.query;

//   // const doc = await features.query;

//   let totalDocsInDB;

//   if (req.query.about) {
//     totalDocsInDB = await News.countDocuments({
//       createdAt: {
//         $gte: req.query.createdAt.gte,
//         $lte: req.query.createdAt.lte
//       },
//       about: req.query.about
//     });
//   } else {
//     totalDocsInDB = await News.countDocuments({
//       createdAt: {
//         $gte: req.query.createdAt.gte,
//         $lte: req.query.createdAt.lte
//       }
//     });
//   }

//   // const totalDocsInDB = await News.countDocuments();

//   // SEND RESPONSE
//   res.status(200).json({
//     status: 'success',
//     results: docs.length,
//     data: {
//       data: docs
//     },
//     totalDocsInDB
//   });
// });

// exports.getAllDMs = catchAsync(async (req, res, next) => {
//   // To allow for nested GET reviews on tour (hack)
//   // let filter = {};
//   // if (req.params.tourId) filter = { tour: req.params.tourId };

//   const features = new APIFeatures(DM.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();
//   const docs = await features.query;

//   // SEND RESPONSE
//   res.status(200).json({
//     status: 'success',
//     data: {
//       data: docs
//     }
//   });
// });
exports.getAllDMs = catchAsync(async (req, res, next) => {
  // To allow for nested GET reviews on tour (hack)
  // let filter = {};
  // if (req.params.tourId) filter = { tour: req.params.tourId };

  const features = new APIFeatures(DM.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const docs = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    data: {
      data: docs
    }
  });
});

exports.createDM = catchAsync(async (req, res, next) => {
  if (req.body.content !== cleanBadWord(req.body.content)) {
    return next(new AppError('Bad words are prohibited.', 403));
  }

  let receiver;

  if (req.body.receiverUsername) {
    receiver = await User.findOne({
      username: req.body.receiverUsername
    }).select('_id');
  }

  if (req.body.secretId) {
    receiver = await Secret.findById(req.body.secretId).select('secretTeller');
  }

  if (
    req.body.receiver !== 'priders' &&
    (req.body.type === 'Review' || req.body.type === 'Suggestion')
  )
    return next(
      new AppError('Reviews and suggestions can only be sent to priders.', 404)
    );

  if (!receiver) return next(new AppError('This user is not found.', 404));

  let unreadObj;

  try {
    unreadObj = await DM.create({
      sender: req.body.sender,
      type: req.body.type,
      anonymous: req.body.anonymous,
      content: cleanBadWord(req.body.content),
      receiver
    });

    await User.updateOne(
      { _id: receiver._id },
      {
        $push: { 'notifications.$.DM': unreadObj._id }
      }
    );

    res.status(201).json({
      status: 'success'
    });
  } catch (e) {
    return next(new AppError(genericErrorMessage, 400));
  }
});
// exports.updateNews = factory.updateOne(News);
// exports.deleteNews = factory.deleteOne(News, 'NewsTeller');
// exports.updateNewsViewCount = factory.updateViewCount(News);
