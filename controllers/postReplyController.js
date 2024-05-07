const PostReply = require('./../models/postReplyModel');
const Post = require('./../models/postModel');
const PostComment = require('./../models/postCommentModel');
const Notification = require('./../models/notificationModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');
// const genericErrorMessage = require('./../utils/genericErrorMessage')
const { cleanSanitize, sanitizeAllTags } = require('./../utils/sanitize');
const getMentionedUsers = require('./../utils/getMentionedUsers');
// const catchAsync = require('./../utils/catchAsync');

// exports.setTourUserIds = (req, res, next) => {
//   // Allow nested routes
//   if (!req.body.tour) req.body.tour = req.params.tourId;
//   if (!req.body.user) req.body.user = req.user.id;
//   next();
// };

exports.getAllPostReplies = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(PostReply.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  features.query
    .populate('post', 'title')
    .populate('commenter', 'active')
    .exec()
    .then(doc => {
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
});

exports.createPostReply = catchAsync(async (req, res, next) => {
  const sanitizedContent = cleanSanitize(req.body.content);

  const sanitizedAllTagsContent = sanitizeAllTags(req.body.content);

  // find comment
  const comment = await PostComment.findByIdAndUpdate(
    req.body.postComment,
    {
      $inc: { replyCount: 1 },
      $set: { lastRepliedAt: Date.now() }
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!comment) return next(new AppError('Comment is not found', 404));

  // update commentCount and get post
  const post = await Post.findByIdAndUpdate(
    comment.post,
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

  // create postReply

  const doc = await PostReply.create({
    replier: req.user.id,
    commenter: comment.commenter.id,
    postComment: req.body.postComment,
    post: comment.post,
    poster: post.poster.id,
    content: sanitizedContent
  });

  // create notification for receivers

  const receivers = await getMentionedUsers(
    req.body.content,
    req.user,
    post.poster.id,
    post.willNotify,
    comment
  );

  if (receivers.length > 0) {
    await Notification.create({
      sender: req.user._id,
      receiver: receivers,
      content: sanitizedAllTagsContent,
      route: 'postComments',
      commentId: req.body.postComment,
      replyId: doc._id
    });
  }

  res.status(201).json({
    status: 'success',
    data: {
      data: doc
    }
  });
});

// exports.deleteAllNotifications = catchAsync(async (req, res, next) => {
//   // await Notification.deleteMany();

//   await User.updateMany({}, { $set: { allowChatting: true } });

//   res.status(201).json({
//     status: 'success'
//   });
// });

exports.patchPostReplyLikes = catchAsync(async (req, res, next) => {
  // update commentCount and get post
  // console.log('got here');

  const reply = await PostReply.findByIdAndUpdate(req.params.id, {
    [req.body.method]: { likes: req.user._id }
  });

  if (
    reply.likes.length <= 20 &&
    reply.replier.id !== req.user.id &&
    req.body.method === '$addToSet'
  ) {
    const dupNotification = await Notification.countDocuments({
      sender: req.user._id,
      replyId: reply.id,
      someoneLiked: true
    });

    if (dupNotification === 0) {
      await Notification.create({
        sender: req.user._id,
        receiver: [
          {
            receiver: reply.replier._id,
            read: false,
            checked: false,
            receiverIsMentioned: false
          }
        ],
        route: 'postComments',
        replyId: reply.id,
        content: sanitizeAllTags(reply.content),
        commentId: reply.postComment,
        someoneLiked: true
      });
    }
  }

  if (req.body.method === '$pull' && reply.replier.id !== req.user.id) {
    await Notification.deleteOne({
      sender: req.user._id,
      replyId: reply.id,
      someoneLiked: true
    });
  }

  // create postReply

  res.status(201).json({
    status: 'success',
    data: reply
  });
});

// exports.getAllPostReplys = factory.getAll(PostReply);
exports.getPostReply = factory.getOne(PostReply);
exports.updatePostReplyReports = factory.updateReports(PostReply);
// exports.createPostReply = factory.createOne(PostReply);
exports.updatePostReply = factory.updateOne(PostReply, 'content', 'replier');
exports.deletePostReply = factory.deleteOne(PostReply, 'replier');
