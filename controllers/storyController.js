const mongoose = require('mongoose');
const Story = require('./../models/storyModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');
const genericErrorMessage = require('./../utils/genericErrorMessage');
const APIFeatures = require('../utils/apiFeatures');
const filterObj = require('./../utils/filterObj');
const { cleanSanitize, sanitizeAllTags } = require('./../utils/sanitize');

// exports.weeklyTopStories = (req, res, next) => {
//   req.query.limit = '5';
//   req.query.sort = '-ratingsAverage,price';
//   req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
//   next();
// };

exports.getStory = catchAsync(async (req, res, next) => {
  const doc = await Story.findById(req.params.id);

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

exports.getRelatedAndUnresponsedStories = catchAsync(async (req, res, next) => {
  const r = await Story.aggregate([
    {
      $match: {
        $and: [
          { about: req.params.about },
          { exposedTo: 'public' },
          { createdAt: { $lte: new Date() } },
          { _id: { $ne: mongoose.Types.ObjectId(req.params.storyId) } }
        ]
      }
    },

    { $sample: { size: 3 } }
  ]);

  const u = await Story.aggregate([
    {
      $match: {
        $and: [
          { commentCount: 0 },
          { exposedTo: 'public' },
          { createdAt: { $lte: new Date() } },
          { _id: { $ne: mongoose.Types.ObjectId(req.params.storyId) } }
        ]
      }
    },

    { $sample: { size: 3 } }
  ]);

  const related = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const story of r) {
    if (!related.includes(story)) related.push(story);
  }

  const unresponsed = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const story of u) {
    if (!unresponsed.includes(story)) unresponsed.push(story);
  }

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    data: {
      data: { related, unresponsed }
    }
  });
});

exports.patchStory = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(
    req.body,
    'content',
    'title',
    'about',
    'createdAt',
    'editedAt',
    'lastCommentedAt',
    'draft',
    'exposedTo',
    'willNotify',
    'images'
  );

  try {
    if (req.body.title && req.body.content) {
      await Story.updateOne(
        { _id: req.params.id, storyTeller: req.user.id },
        {
          ...filteredBody,
          title: sanitizeAllTags(req.body.title),
          content: cleanSanitize(req.body.content)
        },
        {
          new: true,
          runValidators: true
        }
      );
    } else {
      await Story.updateOne(
        { _id: req.params.id, storyTeller: req.user.id },
        {
          ...filteredBody
        },
        {
          new: true,
          runValidators: true
        }
      );
    }
  } catch (e) {
    return next(new AppError(genericErrorMessage, 400));
  }

  res.status(200).json({
    status: 'success'
  });
});

exports.getAllStories = factory.getAll(Story);
exports.createStory = factory.createOne(Story, 'storyTeller');

exports.deleteStory = factory.deleteOne(Story, 'storyTeller');

exports.updateStoryReports = factory.updateReports(Story);
exports.updateStorySubscribers = factory.updateSubscribers(Story);

exports.getAllUserStories = factory.getAllUserCreations(
  Story,
  'storyTeller',
  'storyTellerId',
  'stories',
  'storiesExposedTo'
);

exports.updateStoryFromViewers = catchAsync(async (req, res, next) => {
  const doc = await Story.findByIdAndUpdate(req.params.id, req.body, {
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

exports.updateOpenComments = catchAsync(async (req, res, next) => {
  try {
    await Story.updateOne(
      { _id: req.params.id, storyTeller: req.user.id },
      [{ $set: { openComments: { $not: '$openComments' } } }],
      {
        new: true,
        runValidators: true
      }
    );
  } catch (e) {
    return next(new AppError(genericErrorMessage, 400));
  }

  res.status(200).json({
    status: 'success'
  });
});

exports.getAllStoriesFromSearchQuery = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Story.find({
      $or: [
        {
          content: { $regex: `.*${req.params.searchQuery}.*`, $options: 'i' }
        },
        {
          title: { $regex: `.*${req.params.searchQuery}.*`, $options: 'i' }
        }
      ],

      exposedTo: 'public',
      draft: false,
      banned: undefined,
      createdAt: { $lte: new Date().toISOString() }
    }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  // const doc = await features.query.explain();
  const doc = await features.query;

  const totalDocsInDB = await Story.countDocuments({
    $or: [
      {
        content: { $regex: `.*${req.params.searchQuery}.*`, $options: 'i' }
      },
      {
        title: { $regex: `.*${req.params.searchQuery}.*`, $options: 'i' }
      }
    ],

    exposedTo: 'public',
    draft: false,
    banned: undefined,
    createdAt: { $lte: new Date().toISOString() }
  });

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: doc.length,
    data: {
      data: doc
    },
    totalDocsInDB
  });
});

exports.updatePinnedComment = factory.updatePinnedComment(Story, 'storyTeller');

exports.getDraftStory = catchAsync(async (req, res, next) => {
  const doc = await Story.findById(req.params.storyId);

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  if (doc.storyTeller.id !== req.user.id) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: doc
    }
  });
});

exports.getDraftStories = catchAsync(async (req, res, next) => {
  const docs = await Story.find({
    storyTeller: req.user.id,
    draft: true
  }).select('title createdAt about content -storyTeller');

  res.status(200).json({
    status: 'success',
    data: {
      data: docs
    }
  });
});
