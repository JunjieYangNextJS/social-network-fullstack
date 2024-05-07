const mongoose = require('mongoose');
const ChatRoom = require('./../../models/chatModel/chatRoomModel');
const User = require('./../../models/userModel');
const catchAsync = require('./../../utils/catchAsync');

const AppError = require('./../../utils/appError');

exports.getChatRoom = catchAsync(async (req, res, next) => {
  const doc = await ChatRoom.findById(req.params.otherUserId);

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

exports.createChatRoom = catchAsync(async (req, res, next) => {
  // let doc = await ChatRoom.create(req.body);
  if (req.body.users.length !== 2) {
    return next(new AppError('This chat room only allows two people', 403));
  }

  const otherUserId = req.body.users.find(el => el.user !== req.user.id);
  const userId = req.body.users.find(el => el.user === req.user.id);

  if (!otherUserId) return next(new AppError('Invalid other user', 403));

  const hasChat = await ChatRoom.findOne({
    $and: [
      {
        users: {
          $elemMatch: { user: mongoose.Types.ObjectId(otherUserId.user) }
        }
      },
      { users: { $elemMatch: { user: mongoose.Types.ObjectId(req.user.id) } } }
    ]
  }).populate({
    path: 'users.user',
    select: 'username photo profileName whoCanMessageMe'
  });

  if (hasChat && !req.user.chatRooms.includes(hasChat._id)) {
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: {
        chatRooms: hasChat._id
      }
    });

    res.status(201).json({
      status: 'success',
      data: {
        data: hasChat
      }
    });

    return;
  }

  if (!userId) {
    return next(new AppError('This chat room must include yourself', 403));
  }

  const otherUser = await User.findOne({
    _id: otherUserId.user,
    whoCanMessageMe: { $ne: 'none' },
    blockedUsers: { $ne: mongoose.Types.ObjectId(req.user.id) }
  }).select('whoCanMessageMe');

  if (!otherUser) {
    return next(new AppError('This person does not allow chatting', 403));
  }

  if (
    otherUser.whoCanMessageMe === 'friendsOnly' &&
    !otherUser.friendList.includes(req.user.id)
  ) {
    return next(new AppError('This person only allows friends chatting', 403));
  }

  const chatRoom = new ChatRoom(req.body);
  const doc = await chatRoom.save().then(t =>
    t
      .populate({
        path: 'users.user',
        select: 'username photo profileName whoCanMessageMe'
      })
      .execPopulate()
  );

  const u1 = User.findByIdAndUpdate(req.user.id, {
    $addToSet: {
      chatRooms: doc._id
    }
  });

  const u2 = User.findByIdAndUpdate(otherUserId.user, {
    $addToSet: {
      chatRooms: doc._id
    }
  });

  await Promise.all([u1, u2]);

  res.status(201).json({
    status: 'success',
    data: {
      data: doc
    }
  });
});

exports.patchChatRoomFromMeBoolean = catchAsync(async (req, res, next) => {
  const updated = await ChatRoom.findOneAndUpdate(
    { _id: req.body.chatRoomId, 'users.user': req.user.id },

    {
      $set: {
        [`users.$.${req.body.method}`]: req.body.boolean
      }
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    status: 'success',
    data: updated
  });
});

exports.removeChatRoom = catchAsync(async (req, res, next) => {
  const updated = await User.findOneAndUpdate(
    req.user.id,

    {
      $pull: {
        chatRooms: req.body.chatRoomId
      }
    },
    {
      new: true,
      runValidators: true
    }
  )
    .populate('chatRooms ', '-reports')
    .populate(
      'friendList',
      'photo role username profileName sexuality gender photo role username profileName sexuality gender friendList whoCanMessageMe allowFriending allowFollowing followers incomingFriendRequests'
    );

  res.status(200).json({
    status: 'success',
    data: updated
  });
});

exports.incrementChatRoomTotalMessagesAndUnread = catchAsync(
  async (req, res, next) => {
    const increment = {
      $inc: {
        'users.$.totalUnread': 1,
        totalMessages: 1
      },
      $set: { 'users.$.left': false }
    };
    const query = {
      _id: req.params.chatRoomId,
      'users._id': req.body.otherUserId
    };

    await ChatRoom.updateOne(query, increment, {
      new: true,
      runValidators: true
    });

    // SEND RESPONSE
    res.status(200).json({
      status: 'success'
    });
  }
);

exports.eraseUnreadCount = catchAsync(async (req, res, next) => {
  const updated = await ChatRoom.findOneAndUpdate(
    {
      _id: req.body.chatRoom,
      'users.user': req.user.id
    },
    {
      $set: { 'users.$.totalUnread': 0 }
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(201).json({
    status: 'success',
    data: updated
  });
});
