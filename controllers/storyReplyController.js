const StoryReply = require('./../models/storyReplyModel');
const Story = require('./../models/storyModel');
const StoryComment = require('./../models/storyCommentModel');
const Notification = require('./../models/notificationModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

const { cleanSanitize, sanitizeAllTags } = require('./../utils/sanitize');
const getMentionedUsers = require('./../utils/getMentionedUsers');

// const genericErrorMessage = require('./../utils/genericErrorMessage');
// const catchAsync = require('./../utils/catchAsync');

// exports.setTourUserIds = (req, res, next) => {
//   // Allow nested routes
//   if (!req.body.tour) req.body.tour = req.params.tourId;
//   if (!req.body.user) req.body.user = req.user.id;
//   next();
// };

exports.getAllStoryReplies = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(StoryReply.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  features.query
    .populate('story', 'title')
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
        }
      });
    });
});

exports.createStoryReply = catchAsync(async (req, res, next) => {
  const sanitizedContent = cleanSanitize(req.body.content);
  const sanitizedAllTagsContent = sanitizeAllTags(req.body.content);

  // find comment
  const comment = await StoryComment.findByIdAndUpdate(
    req.body.storyComment,
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

  // update commentCount and get story
  const story = await Story.findByIdAndUpdate(
    comment.story,
    {
      $inc: { commentCount: 1 },
      $set: { lastCommentedAt: Date.now() }
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!story) return next(new AppError('Story is not found', 404));

  // create storyReply

  const doc = await StoryReply.create({
    replier: req.user.id,
    commenter: comment.commenter.id,
    storyComment: req.body.storyComment,
    story: comment.story,
    storyTeller: story.storyTeller.id,
    content: sanitizedContent
  });

  // create notification for receivers

  const receivers = await getMentionedUsers(
    req.body.content,
    req.user,
    story.storyTeller.id,
    story.willNotify,
    comment
  );

  if (receivers.length > 0) {
    await Notification.create({
      sender: req.user._id,
      receiver: receivers,
      content: sanitizedAllTagsContent,
      route: 'storyComments',
      commentId: req.body.storyComment,
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

// exports.getAllStoryReplys = factory.getAll(StoryReply);
exports.getStoryReply = factory.getOne(StoryReply);

exports.updateStoryReply = factory.updateOne(StoryReply, 'content', 'replier');
exports.deleteStoryReply = factory.deleteOne(StoryReply, 'replier');
exports.updateStoryReplyReports = factory.updateReports(StoryReply);
