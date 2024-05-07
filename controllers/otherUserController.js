const mongoose = require('mongoose');
const User = require('./../models/userModel');
const Post = require('./../models/postModel');
const PostComment = require('./../models/postCommentModel');
const PostReply = require('./../models/postReplyModel');
const Story = require('./../models/storyModel');
const StoryComment = require('./../models/storyCommentModel');
const StoryReply = require('./../models/storyReplyModel');
const Notification = require('./../models/notificationModel');

const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const { genericErrorMessage } = require('./../utils/genericErrorMessage');
const Email = require('../utils/email');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// About other users's info

exports.getOtherUser = catchAsync(async (req, res, next) => {
  const doc = await User.findOne({ username: req.params.username }).select(
    'bio followers following allowFollowing allowFriending gender location photo profileImage profileName role sexuality username incomingFriendRequests friendList createdAt blockedUsers exposedTo myPosts friendStatus whoCanMessageMe'
  );

  if (!doc) {
    return next(new AppError('No user found with that ID', 404));
  }

  if (doc.role === 'bot') {
    return next(new AppError('This page is not available for viewing', 403));
  }

  if (req.user) {
    if (doc.id === req.user.id) {
      return next(
        new AppError(
          "It's you! Head to your profile to edit or view details.",
          401
        )
      );
    }

    if (doc.blockedUsers.includes(req.user.id)) {
      return next(
        new AppError(
          `Ouch, it appears you can't see this content because you've been blocked by the owner`,
          403
        )
      );
    }

    if (doc.friendList.includes(req.user.id)) doc.friendStatus = 'Friended';
    if (doc.incomingFriendRequests.some(id => id.userId === req.user.id))
      doc.friendStatus = 'Pending';
    if (doc.followers.includes(req.user.id)) doc.followingStatus = 'Following';
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: doc
    }
  });
});

exports.updateOtherUser = catchAsync(async (req, res, next) => {
  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(
    req.body,
    'incomingFriendRequests',
    'friendList'
  );

  // 3) Update other user document
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    {
      new: true,
      runValidators: true
    }
  ).select(
    'whoCanMessageMe bio followers following gender location photo profileImage profileName role sexuality username incomingFriendRequests friendList createdAt blockedUsers'
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

exports.addOtherUserChatRoom = catchAsync(async (req, res, next) => {
  // 3) Update user document
  // console.log(req.params);
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { chatRooms: req.body.chatRoom } },
    {
      new: true,
      runValidators: true
    }
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

exports.receiveFriendRequest = catchAsync(async (req, res, next) => {
  if (req.user.id === req.params.id) {
    return next(new AppError('You cannot add yourself', 401));
  }
  // 3) Update other user document
  const success = await User.updateOne(
    {
      _id: req.params.id,
      allowFriending: true,
      blockedUsers: { $ne: mongoose.Types.ObjectId(req.user.id) }
    },
    { $addToSet: { incomingFriendRequests: req.body } },
    {
      new: true,
      runValidators: true
    }
  );

  if (success) {
    await Notification.create({
      sender: req.user._id,
      isFriendRequest: true,
      receiver: {
        receiver: req.params.id,
        read: false,
        checked: false,
        receiverIsMentioned: false
      }
    });
  }

  res.status(200).json({
    status: 'success'
  });
});

// exports.removeFriendRequest = catchAsync(async (req, res, next) => {
//   // 3) Update user document
//   const updatedUser = await User.findByIdAndUpdate(
//     req.user.id,
//     { $pull: { incomingFriendRequests: { userId: req.body.userId } } },
//     {
//       new: true,
//       runValidators: true
//     }
//   ).select(
//     'bio followers following gender location photo profileImage profileName role sexuality username incomingFriendRequests friendList createdAt blockedUsers'
//   );

//   if (!updatedUser) {
//     return next(new AppError('No document found with that ID', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       user: updatedUser
//     }
//   });
// });

exports.removeFriend = catchAsync(async (req, res, next) => {
  // update both users

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { $pull: { friendList: req.params.id } },
    {
      new: true,
      runValidators: true
    }
  );

  const updatedOtherUser = await User.findByIdAndUpdate(
    req.params.id,
    { $pull: { friendList: req.user.id } },
    {
      new: true,
      runValidators: true
    }
  );

  // 3) Update both user document

  if (!updatedUser || !updatedOtherUser) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.removeFriendRequest = catchAsync(async (req, res, next) => {
  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      $pull: {
        incomingFriendRequests: { userId: req.body.otherUserId }
      }
    },
    {
      new: true,
      runValidators: true
    }
  );

  await Notification.findByIdAndDelete(req.body.notificationId);

  if (!updatedUser) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success'
  });
});

exports.acceptFriendRequest = catchAsync(async (req, res, next) => {
  // update both users

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      $addToSet: { friendList: req.params.id },
      $pull: {
        incomingFriendRequests: { userId: req.params.id }
      }
    },

    {
      new: true,
      runValidators: true
    }
  );

  await Notification.findByIdAndDelete(req.body.notificationId);

  const updatedOtherUser = await User.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { friendList: req.user.id } },
    {
      new: true,
      runValidators: true
    }
  );

  // 3) Update both user document

  if (!updatedUser || !updatedOtherUser) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success'
  });
});

exports.followOtherUser = catchAsync(async (req, res, next) => {
  if (req.user.id === req.params.otherUserId) {
    return next(new AppError('You cannot follow yourself', 401));
  }

  const success = await User.findOneAndUpdate(
    {
      _id: req.params.otherUserId,
      allowFollowing: true,
      blockedUsers: { $ne: mongoose.Types.ObjectId(req.user.id) }
    },
    {
      $addToSet: {
        followers: req.user.id
      }
    },
    {
      new: true,
      runValidators: true
    }
  ).select(
    'bio followers following allowFollowing allowFriending gender location photo profileImage profileName role sexuality username incomingFriendRequests friendList createdAt blockedUsers exposedTo myPosts friendStatus whoCanMessageMe chatRooms'
  );

  // update both users
  if (success) {
    await User.updateOne(
      { _id: req.user.id },
      {
        $addToSet: {
          following: req.params.otherUserId
        }
      },
      {
        new: true,
        runValidators: true
      }
    );

    await Notification.create({
      sender: req.user._id,
      isFollow: true,
      receiver: {
        receiver: req.params.otherUserId,
        read: false,
        checked: false,
        receiverIsMentioned: false
      }
    });
  }

  res.status(200).json({
    status: 'success',
    data: success
  });
});

exports.unfollowOtherUser = catchAsync(async (req, res, next) => {
  // update both users

  await User.updateOne(
    { _id: req.user.id },
    {
      $pull: {
        following: req.params.otherUserId
      }
    },
    {
      new: true,
      runValidators: true
    }
  );

  const data = await User.findByIdAndUpdate(
    req.params.otherUserId,
    {
      $pull: {
        followers: req.user.id
      }
    },
    {
      new: true,
      runValidators: true
    }
  ).select(
    'bio followers following allowFollowing allowFriending gender location photo profileImage profileName role sexuality username incomingFriendRequests friendList createdAt blockedUsers exposedTo myPosts friendStatus whoCanMessageMe chatRooms'
  );

  await Notification.deleteOne({
    sender: req.user._id,
    isFollow: true,
    'receiver.receiver': req.params.otherUserId
  });

  res.status(200).json({
    status: 'success',
    data
  });
});

exports.patchUserSilencedTill = catchAsync(async (req, res, next) => {
  // update both users

  try {
    await User.updateOne(
      { _id: req.body.userId },
      {
        $set: {
          silencedTill: req.body.silencedTill
        }
      },
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

exports.patchUserSilencedTill = catchAsync(async (req, res, next) => {
  // update both users

  try {
    await User.updateOne(
      { _id: req.body.userId },
      {
        $set: {
          silencedTill: req.body.silencedTill
        }
      },
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

// handle chatRooms
exports.addChatRoom = factory.patchArrayMethod(User, '$push', 'chatRooms');
exports.removeChatRoom = factory.patchArrayMethod(User, '$pull', 'chatRooms');

exports.getHoverOtherUser = catchAsync(async (req, res, next) => {
  const countDocs = async (Model, property) => {
    const dataOne = Model.countDocuments({
      [property]: mongoose.Types.ObjectId(req.params.userId)
    });
    return dataOne;
  };

  const dataOne = await countDocs(Post, 'poster');
  const dataTwo = await countDocs(Story, 'storyTeller');
  const postStoryCount = dataOne + dataTwo;

  const dataThree = await countDocs(PostReply, 'replier');
  const dataFour = await countDocs(PostComment, 'commenter');
  const dataFive = await countDocs(StoryComment, 'commenter');
  const dataSix = await countDocs(StoryReply, 'replier');
  const commentReplyCount = dataThree + dataFour + dataFive + dataSix;

  const user = await User.findById(req.params.userId).select(
    'followers following allowFollowing'
  );

  const followingCount = user.following.length;

  // const followingCount = await User.aggregate([
  //   {
  //     $match: { _id: mongoose.Types.ObjectId(req.params.userId) }
  //   },
  //   {
  //     $project: {
  //       followingCount: {
  //         $cond: {
  //           if: { $isArray: '$following' },
  //           then: { $size: '$following' },
  //           else: 'NA'
  //         }
  //       }
  //     }
  //   }
  // ]);

  res.status(200).json({
    status: 'success',
    data: {
      postStoryCount,
      commentReplyCount,
      followers: user.followers,
      followingCount,
      allowFollowing: user.allowFollowing
    }
  });
});

exports.getPopularPeople = catchAsync(async (req, res, next) => {
  if (req.user) {
    // popular
    const P = await User.aggregate([
      {
        $match: {
          $and: [
            { blockedUsers: { $ne: mongoose.Types.ObjectId(req.user.id) } },
            { followers: { $ne: mongoose.Types.ObjectId(req.user.id) } },
            { allowFollowing: true },
            { active: true },
            { _id: { $ne: mongoose.Types.ObjectId(req.user.id) } }
          ]
        }
      },
      {
        $addFields: {
          followers_count: { $size: { $ifNull: ['$followers', []] } }
        }
      },
      {
        $sort: { followers_count: -1 }
      },

      { $limit: 5 },
      {
        $project: {
          _id: 1,
          username: 1,
          profileName: 1,
          followers: 1,
          following: 1,
          photo: 1,
          allowFollowing: 1,
          role: 1
        }
      }
    ]);

    const popular = P.sort(() => 0.5 - Math.random()).slice(0, 3);

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      data: popular
    });
  } else {
    // popular
    const P = await User.aggregate([
      {
        $match: {
          $and: [{ allowFollowing: true }, { active: true }]
        }
      },
      {
        $addFields: {
          followers_count: { $size: { $ifNull: ['$followers', []] } }
        }
      },

      {
        $sort: { followers_count: -1 }
      },

      { $limit: 5 },
      {
        $project: {
          _id: 1,
          username: 1,
          profileName: 1,
          followers: 1,
          following: 1,
          photo: 1,
          allowFollowing: 1,
          role: 1
        }
      }
    ]);

    const popular = P.sort(() => 0.5 - Math.random()).slice(0, 3);

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      data: popular
    });
  }
});
exports.getLikeMindedPeople = catchAsync(async (req, res, next) => {
  // likeMinded
  const LM = await User.aggregate([
    {
      $match: {
        $and: [
          {
            $or: [
              {
                sexuality: req.user.sexuality
              },
              {
                gender: req.user.gender
              }
            ]
          },
          { blockedUsers: { $ne: mongoose.Types.ObjectId(req.user.id) } },
          { followers: { $ne: mongoose.Types.ObjectId(req.user.id) } },
          { allowFollowing: true },
          { active: true },
          { _id: { $ne: mongoose.Types.ObjectId(req.user.id) } }
        ]
      }
    },

    { $sample: { size: 3 } },
    {
      $project: {
        _id: 1,
        username: 1,
        profileName: 1,
        followers: 1,
        following: 1,
        photo: 1,
        allowFollowing: 1,
        role: 1
      }
    }
  ]);

  const likeMinded = LM.filter(
    (el, i) => LM.findIndex(a => a._id === el._id) === i
  );

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    data: likeMinded
  });
});

exports.getOtherUserFollowers = catchAsync(async (req, res, next) => {
  const doc = await User.findOne({ username: req.params.username })
    .populate({
      path: 'followers',
      select: 'photo username profileName bio gender sexuality role'
    })
    .select('followers');

  res.status(200).json({
    status: 'success',
    data: doc.followers
  });
});

exports.getOtherUserFollowing = catchAsync(async (req, res, next) => {
  const doc = await User.findOne({ username: req.params.username })
    .populate({
      path: 'following',
      select: 'photo username profileName bio gender sexuality role'
    })
    .select('following');

  res.status(200).json({
    status: 'success',
    data: doc.following
  });
});

exports.getOtherUserLikeMinded = catchAsync(async (req, res, next) => {
  let LM;

  if (req.user) {
    LM = await User.aggregate([
      {
        $match: {
          $and: [
            {
              $or: [
                {
                  sexuality: req.params.sexuality
                },
                {
                  gender: req.params.gender
                }
              ]
            },
            { blockedUsers: { $ne: mongoose.Types.ObjectId(req.user.id) } },
            { followers: { $ne: mongoose.Types.ObjectId(req.user.id) } },
            { allowFollowing: true },
            { active: true },
            { _id: { $ne: mongoose.Types.ObjectId(req.user.id) } }
          ]
        }
      },

      { $sample: { size: 3 } },
      {
        $project: {
          _id: 1,
          username: 1,
          profileName: 1,
          followers: 1,
          following: 1,
          photo: 1,
          allowFollowing: 1,
          role: 1
        }
      }
    ]);
  } else {
    LM = await User.aggregate([
      {
        $match: {
          $and: [
            {
              $or: [
                {
                  sexuality: req.params.sexuality
                },
                {
                  gender: req.params.gender
                }
              ]
            },

            { allowFollowing: true },
            { active: true }
          ]
        }
      },

      { $sample: { size: 5 } },
      {
        $project: {
          _id: 1,
          username: 1,
          profileName: 1,
          followers: 1,
          following: 1,
          photo: 1,
          allowFollowing: 1,
          role: 1
        }
      }
    ]);
  }

  const otherUserLikeMinded = LM.filter(
    (el, i) => LM.findIndex(a => a._id === el._id) === i
  );

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    data: otherUserLikeMinded
  });
});

exports.getMyFollowingPeoplePosts = factory.getMyFollowingPeopleCreations(
  Post,
  'poster'
);
exports.getMyFollowingPeopleStories = factory.getMyFollowingPeopleCreations(
  Story,
  'storyTeller'
);

exports.patchUsersProfileImage = catchAsync(async (req, res, next) => {
  await User.updateMany(
    {},
    {
      profileImage:
        'https://s3.us-west-1.amazonaws.com/priders.net-images-bucket/bfc086cd-a2c4-41af-90b5-ec4b548af0c8.jpeg'
    }
  );

  res.status(200).json({
    status: 'success'
  });
});

exports.happyBirthday = catchAsync(async (req, res, next) => {
  const users = await User.find({
    birthDay: new Date().getDate(),
    birthMonth: new Date().getMonth() + 1
  });

  const promises = [];

  users.forEach(user => promises.push(new Email(user, '').sendHappyBirthday()));

  await Promise.all(promises);
  // for await (const user of users) {
  //   await new Email(user, '').sendHappyBirthday();
  // }

  res.status(200).json({
    status: 'success'
  });
});
