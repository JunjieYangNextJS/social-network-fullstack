const fs = require('fs');
const util = require('util');
const multer = require('multer');
const sharp = require('sharp');
const { v4: uuid } = require('uuid');
const User = require('./../models/userModel');
const Secret = require('./../models/secretModel');

const PostComment = require('./../models/postCommentModel');
const PostReply = require('./../models/postReplyModel');
const StoryComment = require('./../models/storyCommentModel');
const StoryReply = require('./../models/storyReplyModel');

const Notification = require('./../models/notificationModel');
const catchAsync = require('./../utils/catchAsync');
const APIFeatures = require('./../utils/apiFeatures');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const filterObj = require('./../utils/filterObj');
const { uploadThroughMemory, generateUploadURL } = require('./../s3');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     // user-87289sakdja-333223232.jpeg
//     // user-user._id-timestamp.jpeg
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('This is not an image.', 400), false);
  }
};

// const upload = multer({
//   dest: 'uploads/',
//   fileFilter: multerFilter,
//   limits: { fileSize: 10485760 }
// });

const unlinkFile = util.promisify(fs.unlink);

const uploadCreationImage = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 10485760 }
});

exports.imageUploadMiddleware = uploadCreationImage.single('image');

// for post and story
exports.postStoryImageUpload = catchAsync(async (req, res, next) => {
  console.log(req.body.image);
  // const updated = await User.findByIdAndUpdate(
  //   req.user.id,
  //   {
  //     $inc: { imagesUploadedInHalfDay: 1 }
  //   },
  //   {
  //     new: true,
  //     runValidators: true
  //   }
  // ).select('imagesUploadedInHalfDay');

  // if (updated.imagesUploadedInHalfDay > 50) {
  //   await unlinkFile(`uploads/${req.files.photo[0].filename}`);
  //   return next(
  //     new AppError('You cannot upload more than 50 images in 12 hours', 401)
  //   );
  // }

  req.file.filename = `${uuid()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(700, 500, { withoutEnlargement: true, fit: 'inside' })
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`uploads/${req.file.filename}`);

  // req.headers['content-type'] = 'image/jpeg';

  const result = await uploadThroughMemory(
    `uploads/${req.file.filename}`,
    req.file.filename
  );

  await unlinkFile(`uploads/${req.file.filename}`);

  // const result = await uploadFile(req.file);

  // await unlinkFile(req.file.path);

  res.status(200).json({
    status: 'success',
    data: result.Location
  });
});
exports.expoPostStoryImageUpload = catchAsync(async (req, res, next) => {
  if (!req.isExpo)
    return next(new AppError('This route is for native apps only', 401));

  const url = await generateUploadURL();

  if (!url) next(new AppError('Some problem occurred, please try again', 401));

  res.send({ url });

  // res.status(200).json({
  //   status: 'success'
  // });
});

// for comments
exports.commentImageUpload = catchAsync(async (req, res, next) => {
  const updated = await User.findByIdAndUpdate(
    req.user.id,
    {
      $inc: { imagesUploadedInHalfDay: 1 }
    },
    {
      new: true,
      runValidators: true
    }
  ).select('imagesUploadedInHalfDay');

  if (updated.imagesUploadedInHalfDay > 50) {
    await unlinkFile(`uploads/${req.files.photo[0].filename}`);
    return next(
      new AppError('You cannot upload more than 50 images in 12 hours', 401)
    );
  }

  req.file.filename = `${uuid()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(700, 300, { withoutEnlargement: true, fit: 'inside' })
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`uploads/${req.file.filename}`);

  // req.headers['content-type'] = 'image/jpeg';

  const result = await uploadThroughMemory(
    `uploads/${req.file.filename}`,
    req.file.filename
  );

  await unlinkFile(`uploads/${req.file.filename}`);

  // const result = await uploadFile(req.file);

  // await unlinkFile(req.file.path);

  res.status(200).json({
    status: 'success',
    data: result.Location
  });
});

// for replies
exports.replyImageUpload = catchAsync(async (req, res, next) => {
  const updated = await User.findByIdAndUpdate(
    req.user.id,
    {
      $inc: { imagesUploadedInHalfDay: 1 }
    },
    {
      new: true,
      runValidators: true
    }
  ).select('imagesUploadedInHalfDay');

  if (updated.imagesUploadedInHalfDay > 50) {
    await unlinkFile(`uploads/${req.files.photo[0].filename}`);
    return next(
      new AppError('You cannot upload more than 50 images in 12 hours', 401)
    );
  }

  req.file.filename = `${uuid()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(700, 250, { withoutEnlargement: true, fit: 'inside' })
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`uploads/${req.file.filename}`);

  // req.headers['content-type'] = 'image/jpeg';

  const result = await uploadThroughMemory(
    `uploads/${req.file.filename}`,
    req.file.filename
  );

  await unlinkFile(`uploads/${req.file.filename}`);

  // const result = await uploadFile(req.file);

  // await unlinkFile(req.file.path);

  res.status(200).json({
    status: 'success',
    data: result.Location
  });
});

// for profileImage and photo
const changePhotoAndProfileImage = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 10485760 }
});

exports.uploadUserPhoto = changePhotoAndProfileImage.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'profileImage', maxCount: 1 }
]);

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  const updated = await User.findByIdAndUpdate(
    req.user.id,
    {
      $inc: { imagesUploadedInHalfDay: 1 }
    },
    {
      new: true,
      runValidators: true
    }
  ).select('imagesUploadedInHalfDay');

  if (updated.imagesUploadedInHalfDay > 50) {
    await unlinkFile(`uploads/${req.files.photo[0].filename}`);
    return next(
      new AppError('You cannot upload more than 50 images in 12 hours', 401)
    );
  }
  // req.headers['content-type'] = 'image/jpeg';

  if (req.files.photo) {
    req.files.photo[0].filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    await sharp(req.files.photo[0].buffer)
      .rotate()
      .resize(500, 500, { withoutEnlargement: true, fit: 'inside' })
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`uploads/${req.files.photo[0].filename}`);

    // req.headers['content-type'] = 'image/jpeg';

    const result = await uploadThroughMemory(
      `uploads/${req.files.photo[0].filename}`,
      req.files.photo[0].filename
    );

    await unlinkFile(`uploads/${req.files.photo[0].filename}`);
    req.files.photo[0].url = result.Location;
  }

  // res.status(200).json({
  //   status: 'success',
  //   data: result.Location
  // });

  if (req.files.profileImage) {
    req.files.profileImage[0].filename = `userProfileImage-${
      req.user.id
    }-${Date.now()}.jpeg`;

    await sharp(req.files.profileImage[0].buffer)
      .rotate()
      .resize(1000, 500, { withoutEnlargement: true, fit: 'inside' })
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`uploads/${req.files.profileImage[0].filename}`);

    const result = await uploadThroughMemory(
      `uploads/${req.files.profileImage[0].filename}`,
      req.files.profileImage[0].filename
    );

    await unlinkFile(`uploads/${req.files.profileImage[0].filename}`);
    req.files.profileImage[0].url = result.Location;
  }

  next();
});
// exports.resizeUserPhoto = (req, res, next) => {
//   // eslint-disable-next-line dot-notation
//   if (req.files['photo']) {
//     req.files.photo[0].filename = `user-${req.user.id}.jpeg`;
//     const filePhoto = { ...req.files.photo[0] };

//     if (
//       fs.existsSync(`../social-network/src/images/users/${filePhoto.filename}`)
//     )
//       fs.unlinkSync(`../social-network/src/images/users/${filePhoto.filename}`);

//     sharp(filePhoto.buffer)
//       .resize(500, 500)
//       .toFormat('jpeg')
//       .jpeg({ quality: 90 })
//       .toFile(`../social-network/src/images/users/${filePhoto.filename}`);
//   }

//   // eslint-disable-next-line dot-notation
//   if (req.files['profileImage']) {
//     req.files.profileImage[0].filename = `userProfileImage-${req.user.id}.jpeg`;
//     const fileProfileImage = { ...req.files.profileImage[0] };

//     if (
//       fs.existsSync(
//         `../social-network/src/images/userProfileImages/${
//           fileProfileImage.filename
//         }`
//       )
//     )
//       fs.unlinkSync(
//         `../social-network/src/images/userProfileImages/${
//           fileProfileImage.filename
//         }`
//       );

//     sharp(fileProfileImage.buffer)
//       .resize(500, 500)
//       .toFormat('jpeg')
//       .jpeg({ quality: 90 })
//       .toFile(
//         `../social-network/src/images/userProfileImages/${
//           fileProfileImage.filename
//         }`
//       );
//   }

//   next();
// };

// exports.checkIfBlocked = catchAsync(async (req, res, next) => {
//   await User.findByIdAndUpdate(req.user.id, { active: false });

//   res.status(204).json({
//     status: 'success',
//     data: null
//   });
// });

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead'
  });
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data

  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(
    req.body,
    'email',
    'profileName',
    'location',
    'gender',
    'sexuality',
    'bio',
    'photo',
    'profileImage',
    'hiddenPosts',
    'friendList',
    'twitter',
    'incomingFriendRequests',
    'bookmarkedPosts',
    'likedPosts',
    'bookmarkedStories',
    'likedStories',
    'blockedUsers',
    'postsExposedTo',
    'storiesExposedTo',
    'secretsExposedTo',
    'whoCanMessageMe',
    'allowFollowing',
    'allowFriending'
    // 'allowChatting'
  );

  if (req.files && req.files.photo) filteredBody.photo = req.files.photo[0].url;
  if (req.files && req.files.profileImage)
    filteredBody.profileImage = req.files.profileImage[0].url;

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });
  // .populate('friendList ', 'photo role username profileName')
  // .populate(
  //   'chatRooms bookmarkedPosts likedPosts  bookmarkedStories likedStories bookmarkedSecrets likedSecrets  myPosts myComments myReplies  ',
  //   '-reports'
  // );

  if (!updatedUser) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success'
    // data: {
    //   user: updatedUser
    // }
  });
});

exports.updateMeWithoutPhoto = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data

  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(
    req.body,
    'email',
    'profileName',
    'location',
    'gender',
    'sexuality',
    'bio',
    'photo',
    'profileImage',
    'hiddenPosts',
    'friendList',
    'twitter',
    'incomingFriendRequests',
    'bookmarkedPosts',
    'likedPosts',
    'bookmarkedStories',
    'likedStories',
    'blockedUsers',
    'postsExposedTo',
    'storiesExposedTo',
    'secretsExposedTo',
    'whoCanMessageMe',
    'allowFollowing',
    'allowFriending',
    'allowChatting'
  );

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  if (!updatedUser) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success'
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead'
  });
};

// virtual populate, parent referencing
// exports.getUser = factory.getOne(User, { path: 'myPosts' });
exports.getMe = catchAsync(async (req, res, next) => {
  const doc = await User.findById(req.user.id)
    .populate('chatRooms')
    .populate(
      'friendList',
      'photo role username profileName sexuality gender friendList whoCanMessageMe allowFriending allowFollowing followers incomingFriendRequests'
    );

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

exports.getUser = catchAsync(async (req, res, next) => {
  const doc = await User.findById(req.user.id)
    .populate(
      'friendList',
      'photo role username profileName sexuality gender friendList whoCanMessageMe allowFriending allowFollowing followers incomingFriendRequests'
    )
    .populate('chatRooms ', '-reports');

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

exports.getWillNotifyNotifications = catchAsync(async (req, res, next) => {
  if (req.isExpo) {
    const unreadCount = await Notification.countDocuments({
      receiver: {
        $elemMatch: {
          receiver: { $eq: req.user._id },
          read: { $eq: false },
          checked: { $eq: false }
        }
      }
    });

    res.status(200).json({
      status: 'success',
      data: {
        unreadCount
      }
    });
  } else {
    const docs = await Notification.find({
      receiver: {
        $elemMatch: {
          receiver: { $eq: req.user._id }
          // read: { $eq: false },
          // checked: { $eq: false }
        }
      }

      // read: false
    })
      .sort({ createdAt: -1 })
      // .limit(30)
      .populate('sender', 'profileName photo username role');

    const unreadCount = await Notification.countDocuments({
      receiver: {
        $elemMatch: {
          receiver: { $eq: req.user._id },
          read: { $eq: false },
          checked: { $eq: false }
        }
      }
    });

    if (!docs) {
      return next(new AppError('No document found with that ID', 404));
    }

    // const doc = await PostCQuery;

    res.status(200).json({
      status: 'success',
      data: {
        docs,
        unreadCount
      }
    });
  }
});

exports.patchReadWillNotifyNotifications = catchAsync(
  async (req, res, next) => {
    const docs = await Notification.updateMany(
      {
        _id: { $in: req.body.ids },
        'receiver.receiver': req.user._id
      },
      { $set: { 'receiver.$.read': true } },
      { multi: true, new: true, runValidators: true }
    );

    if (!docs) {
      return next(new AppError('No document found with that ID', 404));
    }

    // const doc = await PostCQuery;

    res.status(200).json({
      status: 'success',
      data: {
        data: docs
      }
    });
  }
);

exports.getMyNotifications = catchAsync(async (req, res, next) => {
  const totalDocsInDB = await Notification.countDocuments({
    'receiver.receiver': req.user._id
  });

  const features = new APIFeatures(
    Notification.find({
      'receiver.receiver': req.user._id
    }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  features.query
    .populate('sender', 'profileName photo username role')
    .exec()
    .then(doc => {
      if (!doc) {
        return next(new AppError('No document found with that ID', 404));
      }

      res.status(200).json({
        status: 'success',
        docs: doc,
        totalDocsInDB
      });
    });

  // res.status(200).json({
  //   status: 'success'
  // });
});

exports.patchNotification = catchAsync(async (req, res, next) => {
  await Notification.updateOne(
    {
      _id: req.params.id,
      'receiver.receiver': req.user._id
    },
    { $set: { 'receiver.$.read': true, 'receiver.$.checked': true } }
  );

  // const doc = await PostCQuery;

  res.status(200).json({
    status: 'success'
  });
});

exports.updateMeFromOthers = catchAsync(async (req, res, next) => {
  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(
    req.body,
    'friendList',
    'incomingFriendRequests'
  );

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  })
    .populate(
      'friendList ',
      'photo role username profileName sexuality gender photo role username profileName sexuality gender friendList whoCanMessageMe allowFriending allowFollowing followers'
    )
    .populate(
      'chatRooms bookmarkedPosts likedPosts  bookmarkedStories likedStories  bookmarkedSecrets likedSecrets myPosts myComments myReplies  ',
      '-reports'
    );

  if (!updatedUser) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

// handleLikedPost
// exports.addLikedPost = factory.patchArrayMethod(
//   User,
//   '$addToSet',
//   'likedPosts',
//   'user'
// );
// exports.addLikedPost = factory.patchLikesMethod('likedPosts', Post);
// exports.removeLikedPost = factory.patchArrayMethod(
//   User,
//   '$pull',
//   'likedPosts',
//   'user'
// );
exports.patchLikedItems = factory.patchLikedMethod();
exports.patchBookmarkedItems = factory.patchBookmarkedMethod();

// handleBookmarkedPost
exports.addBookmarkedPost = factory.patchArrayMethod(
  User,
  '$addToSet',
  'bookmarkedPosts',
  'user'
);
exports.removeBookmarkedPost = factory.patchArrayMethod(
  User,
  '$pull',
  'bookmarkedPosts',
  'user'
);

// handle likedStories
exports.addLikedStory = factory.patchArrayMethod(
  User,
  '$addToSet',
  'likedStories',
  'user'
);
exports.removeLikedStory = factory.patchArrayMethod(
  User,
  '$pull',
  'likedStories',
  'user'
);

// handle bookmarkedStories
exports.addBookmarkedStory = factory.patchArrayMethod(
  User,
  '$addToSet',
  'bookmarkedStories',
  'user'
);
exports.removeBookmarkedStory = factory.patchArrayMethod(
  User,
  '$pull',
  'bookmarkedStories',
  'user'
);

// handle hiddenStories
exports.getHiddenStories = factory.getMyItems('hiddenStories', '-reports');

exports.addHiddenStory = factory.patchArrayMethod(
  User,
  '$addToSet',
  'hiddenStories',
  'user'
);
exports.removeHiddenStory = factory.patchArrayMethod(
  User,
  '$pull',
  'hiddenStories',
  'user'
);

// handleLikedSecret
exports.addLikedSecret = factory.patchArrayMethod(
  User,
  '$addToSet',
  'likedSecrets',
  'user'
);
exports.removeLikedSecret = factory.patchArrayMethod(
  User,
  '$pull',
  'likedSecrets',
  'user'
);

// handleBookmarkedSecret
exports.addBookmarkedSecret = factory.patchArrayMethod(
  User,
  '$addToSet',
  'bookmarkedSecrets',
  'user'
);
exports.removeBookmarkedSecret = factory.patchArrayMethod(
  User,
  '$pull',
  'bookmarkedSecrets',
  'user'
);

// handle hiddenSecrets
exports.getHiddenSecrets = factory.getMyItems('hiddenSecrets', '-reports');

exports.addHiddenSecret = factory.patchArrayMethod(
  User,
  '$addToSet',
  'hiddenSecrets',
  'user'
);
exports.removeHiddenSecret = factory.patchArrayMethod(
  User,
  '$pull',
  'hiddenSecrets',
  'user'
);

// handle hiddenPosts
exports.getHiddenPosts = factory.getMyItems('hiddenPosts', '-reports');

exports.addHiddenPost = factory.patchArrayMethod(
  User,
  '$addToSet',
  'hiddenPosts',
  'user'
);
exports.removeHiddenPost = factory.patchArrayMethod(
  User,
  '$pull',
  'hiddenPosts',
  'user'
);

// handle blockedUsers
exports.getBlockedUsers = factory.getMyItems(
  'blockedUsers',
  'photo role username profileName'
);

exports.addBlockedUser = factory.patchArrayMethod(
  User,
  '$addToSet',
  'blockedUsers',
  'user'
);
exports.removeBlockedUser = factory.patchArrayMethod(
  User,
  '$pull',
  'blockedUsers',
  'user'
);

// get my creations and comments
// exports.getMyPosts = factory.getMyItems('myPosts', '-reports');

exports.getMyPosts = catchAsync(async (req, res, next) => {
  const doc = await User.findById(req.user.id)
    .select('myPosts')
    .populate('myPosts', '-reports');

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  const data = doc.myPosts.reverse().filter(post => post.draft === false);

  res.status(200).json({
    status: 'success',
    data: {
      data
    }
  });
});

exports.getMyStories = factory.getMyItems('myStories', '-reports');
exports.getMySecrets = factory.getMyItemsInf(Secret, 'secretTeller');
exports.getMyPostComments = factory.getMyReplies(PostComment, 'commenter');
exports.getMyStoryComments = factory.getMyReplies(StoryComment, 'commenter');
// exports.getMySecretComments = factory.getMyItems(
//   'mySecretComments',
//   '-reports'
// );
exports.getMyPostReplies = factory.getMyReplies(PostReply, 'replier');
exports.getMyStoryReplies = factory.getMyReplies(StoryReply, 'replier');

exports.getMyComments = factory.getMyCommentsAndReplies();

exports.getLikedPosts = factory.getMyItems('likedPosts', '-reports');
exports.getLikedPostComments = factory.getMyComments(
  'likedPostComments',
  '-reports'
);
exports.getLikedPostReplies = factory.getMyLikedReplies(PostReply);
exports.getLikedStories = factory.getMyItems('likedStories', '-reports');
exports.getLikedStoryComments = factory.getMyComments(
  'likedStoryComments',
  '-reports'
);
exports.getLikedStoryReplies = factory.getMyLikedReplies(StoryReply);

exports.getLikedSecrets = factory.getMyItems('likedSecrets', '-reports');

exports.getBookmarkedPosts = factory.getMyItems('bookmarkedPosts', '-reports');
exports.getBookmarkedPostComments = factory.getMyComments(
  'bookmarkedPostComments',
  '-reports'
);
exports.getBookmarkedStories = factory.getMyItems(
  'bookmarkedStories',
  '-reports'
);
exports.getBookmarkedStoryComments = factory.getMyComments(
  'bookmarkedStoryComments',
  '-reports'
);
exports.getBookmarkedSecrets = factory.getMyItems(
  'bookmarkedSecrets',
  '-reports'
);

exports.updateUserReports = factory.updateReports(User);

// exports.patchWillNotifyNotifications = factory.updateWillNotify(Post, 'poster');

exports.getMyFollowingPeople = catchAsync(async (req, res, next) => {
  const doc = await User.findById(req.user.id)
    .populate({
      path: 'following',
      select: 'photo username profileName bio gender sexuality role'
    })
    .select('followers');

  res.status(200).json({
    status: 'success',
    data: doc.following
  });
});

exports.getAllUsersFromSearchQuery = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    User.find({
      $or: [
        {
          username: { $regex: `.*${req.params.searchQuery}.*`, $options: 'i' }
        },
        {
          profileName: {
            $regex: `.*${req.params.searchQuery}.*`,
            $options: 'i'
          }
        }
      ],
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

  // console.log(totalDocsInDB, 'db');

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',

    data: {
      data: doc
    }
  });
});
