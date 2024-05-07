const multer = require('multer');
const sharp = require('sharp');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Post = require('./../models/postModel');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');
const genericErrorMessage = require('./../utils/genericErrorMessage');

const filterObj = require('./../utils/filterObj');
const { cleanSanitize, sanitizeAllTags } = require('./../utils/sanitize');

exports.getAllPosts = factory.getAll(Post);

exports.getAllStickyPosts = catchAsync(async (req, res, next) => {
  const data = await Post.find({
    sticky: true
  });

  // SEND RESPONSE
  res.status(200).json({ data });
});

exports.getAllUserPosts = factory.getAllUserCreations(
  Post,
  'poster',
  'posterId',
  'posts',
  'postsExposedTo'
);

exports.createPost = factory.createOne(Post, 'poster');
exports.deletePost = factory.deleteOne(Post, 'poster');
exports.updatePostViewCount = factory.updateViewCount(Post);

exports.updatePostReports = factory.updateReports(Post);
exports.updatePinnedComment = factory.updatePinnedComment(Post, 'poster');
exports.updatePostSubscribers = factory.updateSubscribers(Post);

exports.getPost = catchAsync(async (req, res, next) => {
  const query = await Post.findById(req.params.id);

  if (!query) {
    return next(new AppError('No document found with that ID', 404));
  }

  if (query.banned)
    return next(new AppError(`This post is banned for ${query.banned}`, 403));

  if (query.draft && req.user.id !== query.poster.id)
    return next(
      new AppError(
        `This post is in draft mode and not yet ready for viewing`,
        403
      )
    );

  if (query.createdAt.getTime() > Date.now() && req.user.id !== query.poster.id)
    return next(
      new AppError('This post is scheduled and not yet ready for viewing', 403)
    );

  if (query.exposedTo !== 'public' && !req.user)
    return next(
      new AppError(
        'This post is unavailable for non-logged-in visitors to view'
      )
    );

  if (
    query.exposedTo === 'private' &&
    req.user &&
    req.user.id !== query.poster.id
  )
    return next(
      new AppError(
        'This post is private and not accessible by anyone other than the creator',
        403
      )
    );

  if (
    query.exposedTo === 'friendsOnly' &&
    req.user &&
    req.user.id !== query.poster.id &&
    !query.poster.friendList.includes(req.user.id)
  )
    return next(
      new AppError(
        'This post can only be viewed by the creator and their friends',
        403
      )
    );

  if (
    query.exposedTo === 'friendsAndFollowersOnly' &&
    req.user &&
    req.user.id !== query.poster.id &&
    !query.poster.friendList.includes(req.user.id) &&
    !query.poster.followers.includes(req.user.id)
  )
    return next(
      new AppError(
        'This post can only be viewed by the creator and their friends and followers',
        403
      )
    );

  const doc = await query;

  res.status(200).json({
    status: 'success',
    data: {
      data: doc
    }
  });
});

// uploading images
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 1048576 }
});

exports.uploadPostImages = upload.single('image');
// exports.uploadPostImages = upload.array('images', 10);

exports.resizeImages = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  const filename = `post-${uuidv4()}.jpeg`;
  await sharp(req.file.buffer)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`../social-network/src/images/posts/${filename}`);

  res.status(201).json({
    status: 'success',
    data: {
      data: `./../../images/posts/${filename}`
    }
  });
});

exports.resizePostImages = catchAsync(async (req, res, next) => {
  if (!req.files.images) return next();
  req.doc.images = [];

  await Promise.all(
    req.files.images.map(async (file, index) => {
      const filename = `post-${req.doc.id}-${Date.now()}-${index + 1}.jpeg`;
      await sharp(file.buffer)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`../social-network/src/images/posts/${filename}`);

      req.doc.images.push(filename);
    })
  );

  await req.doc.save();

  res.status(201).json({
    status: 'success',
    data: {
      data: req.doc
    }
  });
});

// exports.updatePostReports = catchAsync(async (req, res, next) => {
//   await Post.findByIdAndUpdate(
//     req.params.id,
//     {
//       $pull: { reports: { reporterId: req.body.reporterId } }
//     },

//     {
//       new: true,
//       runValidators: true
//     }
//   );
//   const doc = await Post.findByIdAndUpdate(
//     req.params.id,
//     {
//       $addToSet: {
//         reports: {
//           reporterId: req.body.reporterId,
//           reportedFor: req.body.reportedFor
//         }
//       }
//     },

//     {
//       new: true,
//       runValidators: true
//     }
//   );

//   if (!doc) {
//     return next(new AppError('No document found with that ID', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       data: doc
//     }
//   });
// });

exports.patchPost = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(
    req.body,
    'content',
    'title',
    'about',
    'createdAt',
    'editedAt',
    'lastCommentedAt',
    'exposedTo',
    'willNotify'
  );

  let updated;

  try {
    if (req.body.title && req.body.content) {
      updated = await Post.findOneAndUpdate(
        { _id: req.params.id, poster: req.user.id },
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
      updated = await Post.findOneAndUpdate(
        { _id: req.params.id, poster: req.user.id },
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
    status: 'success',
    data: updated
  });
});

exports.patchDraftToPost = catchAsync(async (req, res, next) => {
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
    'poll',
    'pollEndsAt'
  );

  let updated;

  try {
    if (req.body.title && req.body.content) {
      updated = await Post.findOneAndUpdate(
        { _id: req.params.id, poster: req.user.id },
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
      updated = await Post.findOneAndUpdate(
        { _id: req.params.id, poster: req.user.id },
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
    status: 'success',
    data: updated
  });
});

exports.updatePostFromViewers = catchAsync(async (req, res, next) => {
  try {
    await Post.updateOne({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true
    });
  } catch (e) {
    return next(new AppError(genericErrorMessage, 400));
  }

  res.status(200).json({
    status: 'success'
  });
});

exports.getAllPostsFromSearchQuery = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Post.find({
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

  const totalDocsInDB = await Post.countDocuments({
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

  // console.log(totalDocsInDB, 'db');

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

exports.getRelatedAndUnresponsedPosts = catchAsync(async (req, res, next) => {
  const r = await Post.aggregate([
    {
      $match: {
        $and: [
          { about: req.params.about },
          { exposedTo: 'public' },
          { createdAt: { $lte: new Date() } },
          { draft: false },
          { _id: { $ne: mongoose.Types.ObjectId(req.params.postId) } }
        ]
      }
    },

    { $sample: { size: 3 } }
  ]);

  const u = await Post.aggregate([
    {
      $match: {
        $and: [
          { commentCount: 0 },
          { exposedTo: 'public' },
          { createdAt: { $lte: new Date() } },
          { draft: false },
          { _id: { $ne: mongoose.Types.ObjectId(req.params.postId) } }
        ]
      }
    },

    { $sample: { size: 3 } }
  ]);

  // let related = [];

  // for (let post of r) {
  //   if (!related.includes(post)) related.push(post);
  // }

  const related = r.filter((el, i) => r.findIndex(a => a._id === el._id) === i);

  const unresponsed = u.filter(
    (el, i) => u.findIndex(a => a._id === el._id) === i
  );

  // let unresponsed = [];

  // for (let post of u) {
  //   if (!unresponsed.includes(post)) unresponsed.push(post);
  // }

  // const doc = await features.query.explain();

  // console.log(totalDocsInDB, 'db');

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    data: {
      data: { related, unresponsed }
    }
  });
});

exports.addNewProperty = catchAsync(async (req, res, next) => {
  try {
    await Post.updateMany(
      {},
      { $set: { draft: false } },
      { upsert: false, multi: true }
    );
  } catch (e) {
    return next(new AppError(genericErrorMessage, 400));
  }

  res.status(200).json({
    status: 'success'
  });
});

exports.getDraftPost = catchAsync(async (req, res, next) => {
  const doc = await Post.findById(req.params.postId);

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  if (doc.poster.id !== req.user.id) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: doc
    }
  });
});

exports.getDraftPosts = catchAsync(async (req, res, next) => {
  const docs = await Post.find({ poster: req.user.id, draft: true }).select(
    'title createdAt about content -poster'
  );

  // if (!docs) {
  //   return next(new AppError('No document found with that ID', 404));
  // }

  // console.log(doc, 'doc');

  res.status(200).json({
    status: 'success',
    data: {
      data: docs
    }
  });
});

exports.patchPostVotes = catchAsync(async (req, res, next) => {
  if (req.body.addId) {
    const a1 = Post.updateOne(
      {
        _id: req.body.post,
        'poll._id': req.body.addId,
        pollEndsAt: { $gte: new Date().toISOString() }
      },
      { $inc: { 'poll.$.votes': 1 } }
    );
    // .populate('poster');

    const a2 = User.updateOne(
      { _id: req.user.id },
      {
        $addToSet: { myVotes: req.body.addId }
      }
    );

    await Promise.all([a1, a2]);
  }

  if (req.body.removeId) {
    const r1 = Post.updateOne(
      {
        _id: req.body.post,
        'poll._id': req.body.removeId,
        pollEndsAt: { $gte: new Date().toISOString() }
      },
      { $inc: { 'poll.$.votes': -1 } }
    );
    // .populate('poster');

    const r2 = User.updateOne(
      { _id: req.user.id },
      {
        $pull: { myVotes: req.body.removeId }
      }
    );

    await Promise.all([r1, r2]);
  }

  const doc = await Post.findById(req.body.post).populate('poster');

  res.status(200).json({
    status: 'success',
    data: doc
  });
});
