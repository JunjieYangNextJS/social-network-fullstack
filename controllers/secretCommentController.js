const SecretComment = require('./../models/secretCommentModel');
const Secret = require('./../models/secretModel');
const Notification = require('./../models/notificationModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

const { cleanSanitize } = require('./../utils/sanitize');

// const catchAsync = require('./../utils/catchAsync');

// exports.setTourUserIds = (req, res, next) => {
//   // Allow nested routes
//   if (!req.body.tour) req.body.tour = req.params.tourId;
//   if (!req.body.user) req.body.user = req.user.id;
//   next();
// };

exports.getAllSecretComments = catchAsync(async (req, res, next) => {
  const totalDocsInDB = await SecretComment.countDocuments({
    secret: req.query.secret
  });

  const features = new APIFeatures(SecretComment.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  features.query
    .populate('post', 'title')
    .populate('commenter')

    .exec()
    .then(doc => {
      if (!doc) {
        return next(new AppError('No document found with that ID', 404));
      }

      res.status(200).json({
        status: 'success',
        data: {
          data: doc
        },
        totalDocsInDB
      });
    });
});

// exports.getAllSecretComments = factory.getAll(SecretComment);
exports.getSecretComment = catchAsync(async (req, res, next) => {
  // const docComment = await SecretComment.find({})

  const comments = await SecretComment.find({
    _id: req.params.id,
    $or: [{ secretTeller: req.user.id }, { commenter: req.user.id }]
  }).populate('secret');

  res.status(200).json({
    secret: comments[0].secret,
    comments
  });
  // }
});
// exports.createSecretComment = factory.createOne(SecretComment);

exports.createSecretComment = catchAsync(async (req, res, next) => {
  const sanitizedContent = cleanSanitize(req.body.content);

  const targetSecret = await Secret.findById(req.body.secret).select(
    'secretTeller willNotify'
  );

  if (!targetSecret)
    return next(new AppError('No secret found with that ID', 404));

  // find the comment
  let foundComment;

  if (targetSecret.secretTeller.toString() === req.user.id) {
    foundComment = await SecretComment.findOne({
      commenter: req.body.commenter,
      secret: targetSecret._id
    });
  } else {
    foundComment = await SecretComment.findOne({
      commenter: req.user._id,
      secret: targetSecret._id
    });
  }

  if (foundComment.hiddenBy === targetSecret.secretTeller)
    return next(new AppError('The poster has blocked your replies', 401));

  let comment;

  if (foundComment) {
    // if connect between 2 people already exits, add the new message to existing array.
    comment = await SecretComment.findByIdAndUpdate(
      foundComment._id,
      {
        $push: {
          replies: { replier: req.user._id, content: sanitizedContent }
        }
      },
      {
        new: true,
        runValidators: true
      }
    );

    // if (!comment)
    //   return next(new AppError('No document found with that ID', 404));

    // create notification for receivers

    if (
      targetSecret.secretTeller.toString() === req.user.id &&
      comment.willNotify
    ) {
      await Notification.create({
        sender: process.env.ANONYMOUS_USER_ID,
        receiver: {
          receiver: comment.commenter,
          read: false,
          checked: false
        },
        content: sanitizedContent,
        route: 'secretCommentsFromTeller',
        secretId: targetSecret._id
      });
    }

    if (
      comment.commenter.toString() === req.user.id &&
      targetSecret.willNotify &&
      comment.hiddenBy !== targetSecret.secretTeller.toString()
    ) {
      await Notification.create({
        sender: process.env.ANONYMOUS_USER_ID,
        receiver: {
          receiver: targetSecret.secretTeller,
          read: false,
          checked: false
        },
        content: sanitizedContent,
        route: 'secretCommentsFromCommenter',
        commentId: comment._id
      });
    }
  } else {
    if (targetSecret.secretTeller.toString() === req.user.id)
      return next(new AppError('You cannot comment on your own secret', 401));

    comment = await SecretComment.create({
      commenter: req.user._id,
      secret: targetSecret._id,
      secretTeller: targetSecret.secretTeller,
      replies: [{ replier: req.user._id, content: sanitizedContent }]
    });

    if (
      targetSecret.secretTeller.toString() !== req.user.id &&
      targetSecret.willNotify
    ) {
      await Notification.create({
        sender: process.env.ANONYMOUS_USER_ID,
        receiver: {
          receiver: targetSecret.secretTeller,
          read: false,
          checked: false
        },
        content: sanitizedContent,
        route: 'secretCommentsFromCommenter',
        secretId: comment._id
      });
    }
  }

  res.status(201).json({
    status: 'success',
    data: comment
  });
});

// exports.addSecretReply = catchAsync(async (req, res, next) => {
//   const sanitizedContent = cleanSanitize(req.body.content);

//   const targetComment = await SecretComment.findOneAndUpdate(
//     {
//       _id: req.params.id,
//       $or: [{ secretTeller: req.user.id }, { commenter: req.user.id }]
//     },
//     {
//       $push: {
//         replies: {
//           $each: [{ commenter: req.user._id, content: sanitizedContent }],
//           $position: 0
//         }
//       }
//     }
//   );

//   if (!targetComment)
//     return next(new AppError('No comment found with that ID', 404));

//   res.status(201).json({
//     status: 'success',
//     data: targetComment
//   });
// });

// exports.deleteSecretReply = catchAsync(async (req, res, next) => {
//   console.log('sus1');

//   try {
//     await SecretComment.findOneAndUpdate(
//       {
//         _id: req.params.id
//       },
//       {
//         $pull: {
//           replies: { _id: req.body.id, commenter: req.user._id }
//         }
//       }
//     );
//   } catch {
//     return next(new AppError('No comment found with that ID', 404));
//   }

//   res.status(201).json({
//     status: 'success'
//   });
// });

exports.editSecretReply = catchAsync(async (req, res, next) => {
  const targetComment = await SecretComment.findOneAndUpdate(
    {
      _id: req.body.commentId,
      $or: [{ secretTeller: req.user.id }, { commenter: req.user.id }],
      'replies._id': req.body.replyId
    },
    {
      $set: {
        'replies.$.content': req.body.content,
        'replies.$.editedAt': Date.now()
      }
    }
  );

  if (!targetComment)
    return next(new AppError('No comment found with that ID', 404));

  res.status(201).json({
    status: 'success'
  });
});

// exports.editSecretComment = catchAsync(async (req, res, next) => {
//   const targetComment = await SecretComment.findOneAndUpdate(
//     {
//       _id: req.params.id,
//       commenter: req.user.id
//     },
//     {
//       $set: {
//         content: req.body.content,
//         editedAt: Date.now()
//       }
//     }
//   );

//   if (!targetComment)
//     return next(new AppError('No comment found with that ID', 404));

//   res.status(201).json({
//     status: 'success'
//   });
// });

exports.deleteSecretComment = catchAsync(async (req, res, next) => {
  const doc = await SecretComment.findOne({
    _id: req.body.secretCommentId
  });

  if (!doc) return next(new AppError('No comment found with that ID', 404));

  if (doc.replies.length > 1) {
    await SecretComment.updateOne(
      {
        _id: req.body.secretCommentId
      },
      {
        $pull: {
          replies: { _id: req.body.secretReplyId, replier: req.user._id }
        }
      }
    );

    // await SecretComment.updateOne(
    //   { _id: req.body.secretCommentId },
    //   { content: '[ This content has been deleted. ]' }
    // );
  } else {
    await SecretComment.deleteOne({
      _id: req.body.secretCommentId,
      commenter: req.user.id
    });
  }

  res.status(201).json({
    status: 'success'
  });
});
// exports.createSecretComment = catchAsync(async (req, res, next) => {
//   const sanitizedContent = cleanBadWord(sanitize(req.body.content));

//   // update commentCount and get post
//   const targetSecret = await Secret.findById(req.body.secret).select(
//     'secretTeller'
//   );

//   if (!targetSecret)
//     return next(new AppError('No secret found with that ID', 404));

//   // create postComment
//   const doc = await SecretComment.create({
//     secret: req.body.secret,
//     commenter: req.user._id,
//     content: sanitizedContent,
//     secretTeller: targetSecret.secretTeller
//   });

//   // create notification for receivers

//   await Notification.create({
//     sender: req.user._id,
//     receiver: targetSecret.secretTeller,
//     content: sanitizedContent,
//     route: 'secretComments',
//     secretComment: doc._id
//   });

//   res.status(201).json({
//     status: 'success',
//     data: {
//       data: doc
//     }
//   });
// });

// exports.updateSecretComment = factory.updateOne(
//   SecretComment,
//   'content',
//   'commenter'
// );
// exports.deleteSecretComment = factory.deleteOne(SecretComment, 'commenter');
// exports.reportSecretComment = factory.updateReports(SecretComment);
exports.patchSecretCommentWillNotify = catchAsync(async (req, res, next) => {
  const doc = await SecretComment.findOneAndUpdate(
    { _id: req.params.id, commenter: req.user.id },
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

exports.patchSecretCommentHiddenBy = catchAsync(async (req, res, next) => {
  const doc = await SecretComment.findOneAndUpdate(
    { _id: req.params.id, secretTeller: req.user.id },
    {
      hiddenBy: req.body.hiddenBy
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!doc)
    return next(new AppError('You are not authorized to edit this', 401));

  const comments = await SecretComment.find({
    secret: doc.secret,
    hiddenBy: { $ne: req.user.id }
  });

  res.status(201).json({
    status: 'success',
    data: comments
  });
});
