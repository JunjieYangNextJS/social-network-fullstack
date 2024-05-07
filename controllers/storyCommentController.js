const StoryComment = require('./../models/storyCommentModel');
const Story = require('./../models/storyModel');

const Notification = require('./../models/notificationModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

const { cleanSanitize, sanitizeAllTags } = require('./../utils/sanitize');
const getMentionedUsers = require('./../utils/getMentionedUsers');
// const catchAsync = require('./../utils/catchAsync');

// exports.setTourUserIds = (req, res, next) => {
//   // Allow nested routes
//   if (!req.body.tour) req.body.tour = req.params.tourId;
//   if (!req.body.user) req.body.user = req.user.id;
//   next();
// };

exports.updateStoryCommentSubscribers = factory.updateSubscribers(StoryComment);

exports.getAllStoryComments = catchAsync(async (req, res, next) => {
  if (req.query.openComments === 'true') {
    delete req.query.openComments;

    const understated = await StoryComment.find({
      story: req.query.story,
      understated: true
    });

    let totalDocsInDB;

    if (req.query.commenter) {
      totalDocsInDB = await StoryComment.countDocuments({
        story: req.query.story,
        understated: false,
        commenter: req.query.commenter
      });
    } else {
      totalDocsInDB = await StoryComment.countDocuments({
        story: req.query.story,
        understated: false
      });
    }

    const features = new APIFeatures(StoryComment.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    features.query
      .populate('story', 'title')
      .populate('commenter', 'active')
      .populate('storyReplies')
      .exec()
      .then(docs => {
        if (!docs) {
          return next(new AppError('No document found with that storyId', 404));
        }

        res.status(200).json({
          status: 'success',
          data: docs,
          understated,
          totalDocsInDB
        });
      });
  } else {
    res.status(200).json({
      status: 'success',

      data: [],
      understated: [],
      totalDocsInDB: 0
    });
  }
});

exports.getStoryComment = catchAsync(async (req, res, next) => {
  const doc = await StoryComment.findById(req.params.id)
    .populate('storyReplies')
    .populate('story', 'title about -storyTeller');

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

// exports.getAllStoryComments = factory.getAll(StoryComment);
// exports.getStoryComment = factory.getOne(StoryComment, 'storyReplies');
// exports.createStoryComment = factory.createOne(StoryComment);

exports.createStoryComment = catchAsync(async (req, res, next) => {
  const sanitizedContent = cleanSanitize(req.body.content);

  const notificationContent = sanitizeAllTags(req.body.content);

  // update commentCount and get post
  const story = await Story.findByIdAndUpdate(
    req.body.story,
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

  // create postComment
  const doc = await StoryComment.create({
    story: req.body.story,
    storyTeller: story.storyTeller.id,
    commenter: req.user.id,
    content: sanitizedContent
  });

  const receivers = await getMentionedUsers(
    req.body.content,
    req.user,
    story.storyTeller.id,
    story.willNotify
  );

  // create notification for receivers
  if (receivers.length > 0) {
    await Notification.create({
      sender: req.user._id,
      receiver: receivers,
      content: notificationContent,
      route: 'storyComments',
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

exports.updateUnderstated = catchAsync(async (req, res, next) => {
  try {
    await StoryComment.updateOne(
      { _id: req.params.id, storyTeller: req.user.id },
      [{ $set: { understated: { $not: '$understated' } } }],
      {
        new: true,
        runValidators: true
      }
    );
  } catch (e) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success'
  });
});

exports.patchWillNotifyCommenter = catchAsync(async (req, res, next) => {
  try {
    await StoryComment.updateOne(
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

exports.updateStoryComment = factory.updateOne(
  StoryComment,
  'content',
  'commenter'
);
exports.deleteStoryComment = factory.deleteOne(StoryComment, 'commenter');
exports.updateStoryCommentReports = factory.updateReports(StoryComment);
