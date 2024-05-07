const { cleanSanitize, sanitizeAllTags } = require('../utils/sanitize');

const PostComment = require('./../models/postCommentModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

const Post = require('./../models/postModel');
const Notification = require('../models/notificationModel');
const getMentionedUsers = require('./../utils/getMentionedUsers');
// const catchAsync = require('./../utils/catchAsync');

// exports.setTourUserIds = (req, res, next) => {
//   // Allow nested routes
//   if (!req.body.tour) req.body.tour = req.params.tourId;
//   if (!req.body.user) req.body.user = req.user.id;
//   next();
// };

exports.getAllPostComments = catchAsync(async (req, res, next) => {
  const totalDocsInDB = await PostComment.countDocuments({
    post: req.query.post
  });

  const features = new APIFeatures(PostComment.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  features.query
    .populate('post', 'title')
    .populate('commenter', 'active')
    .populate('postReplies')
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

// exports.getAllPostComments = factory.getAll(PostComment);
// exports.getPostComment = factory.getOne(PostComment, 'postReplies', 'post');

exports.getPostComment = catchAsync(async (req, res, next) => {
  const doc = await PostComment.findById(req.params.id)
    .populate('postReplies')
    .populate('post', 'title about -poster');

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

exports.createPostComment = catchAsync(async (req, res, next) => {
  const sanitizedContent = cleanSanitize(req.body.content);

  const notificationContent = sanitizeAllTags(req.body.content);

  // update commentCount and get post
  const post = await Post.findByIdAndUpdate(
    req.body.post,
    {
      $inc: { commentCount: 1 },
      $set: { lastCommentedAt: Date.now() }
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!post) return next(new AppError('Post is not found', 404));

  // create postComment
  const doc = await PostComment.create({
    post: req.body.post,
    poster: post.poster.id,
    commenter: req.user.id,
    content: sanitizedContent
  });

  const receivers = await getMentionedUsers(
    req.body.content,
    req.user,
    post.poster.id,
    post.willNotify,
    undefined,
    post.subscribers
  );

  // create notification for receivers
  if (receivers.length > 0) {
    await Notification.create({
      sender: req.user._id,
      receiver: receivers,
      content: notificationContent,
      route: 'postComments',
      // postComment: doc._id,
      commentId: doc._id,
      someoneLiked: false
    });
  }

  res.status(201).json({
    status: 'success',
    data: {
      data: doc
    }
  });
});

exports.patchWillNotifyCommenter = catchAsync(async (req, res, next) => {
  try {
    await PostComment.updateOne(
      { _id: req.params.id, commenter: req.user._id },
      { willNotifyCommenter: req.body.willNotifyCommenter }
    );
  } catch {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success'
  });
});

// exports.createPostComment = factory.createOne(PostComment);
exports.updatePostComment = factory.updateOne(
  PostComment,
  'content',
  'commenter'
);
exports.updatePostCommentSubscribers = factory.updateSubscribers(PostComment);
exports.deletePostComment = factory.deleteOne(PostComment, 'commenter');
exports.reportPostComment = factory.updateReports(PostComment);

exports.getMyPostComments = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    PostComment.find({
      commenter: req.user.id
    }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const doc = await features.query.populate('commenter');

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
