const ChatMessage = require('./../../models/chatModel/chatMessageModel');
const ChatRoom = require('./../../models/chatModel/chatRoomModel');
const catchAsync = require('./../../utils/catchAsync');

const AppError = require('./../../utils/appError');
const APIFeatures = require('./../../utils/apiFeatures');

exports.createChatMessage = catchAsync(async (req, res, next) => {
  const createM = ChatMessage.create(req.body);

  const updateTheirs = ChatRoom.updateOne(
    {
      _id: req.body.chatRoom,
      'users.user': req.body.receiverId
    },
    {
      $inc: {
        'users.$.totalUnread': 1,
        totalMessages: 1
      },
      $set: {
        'users.$.left': false,
        lastMessage: req.body.content,
        lastModified: Date.now()
      }
    },
    {
      new: true,
      runValidators: true
    }
  );

  const updateMine = ChatRoom.updateOne(
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

  await Promise.all([createM, updateTheirs, updateMine]);

  res.status(201).json({
    status: 'success'
  });
});

exports.getChatMessages = catchAsync(async (req, res, next) => {
  if (!req.user.chatRooms.includes(req.params.chatRoomId))
    return next(new AppError('No chatRoom found with that ID', 404));

  const features = new APIFeatures(
    ChatMessage.find({ chatRoom: req.params.chatRoomId }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const doc = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: doc.length,
    data: {
      data: doc.reverse()
    }
  });
});

exports.getPreviousChatMessages = catchAsync(async (req, res, next) => {
  if (!req.user.chatRooms.includes(req.params.chatRoomId))
    return next(new AppError('No chatRoom found with that ID', 404));

  const totalDocsInDB = await ChatMessage.countDocuments({
    chatRoom: req.params.chatRoomId
  });

  const features = new APIFeatures(
    ChatMessage.find({ chatRoom: req.params.chatRoomId }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const doc = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',

    totalDocsInDB,

    data: doc.reverse()
  });
});
