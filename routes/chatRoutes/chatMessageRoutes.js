const express = require('express');
// const ChatMessage = require('./../../models/chatModel/chatMessageModel');
const authController = require('./../../controllers/authController');
const chatMessageController = require('./../../controllers/chatController/chatMessageController');

const router = express.Router();

router
  .route('/')
  // .get(authController.protect, chatMessageController.getAllChatMessages)
  .post(authController.protect, chatMessageController.createChatMessage);

// router.delete('/delete', async (req, res, next) => {
//   const doc = await ChatMessage.deleteMany({
//     createdAt: { $lte: Date.now() - 604800 }
//   });

//   res.status(201).json({
//     status: 'success',
//     data: doc
//   });
// });

router
  .route('/previous/:chatRoomId')
  .get(authController.protect, chatMessageController.getPreviousChatMessages);

router
  .route('/:chatRoomId')
  .get(authController.protect, chatMessageController.getChatMessages);

module.exports = router;
