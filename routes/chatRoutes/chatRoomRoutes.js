const express = require('express');
const authController = require('../../controllers/authController');
const chatRoomController = require('../../controllers/chatController/chatRoomController');

const router = express.Router();

router
  .route('/')
  .post(authController.protect, chatRoomController.createChatRoom);
// .delete(authController.protect, chatRoomController.deleteAllChatRooms);

router
  .route('/eraseUnreadCount')
  .patch(authController.protect, chatRoomController.eraseUnreadCount);

router
  .route('/:chatRoomId/increment')
  .patch(
    authController.protect,
    chatRoomController.incrementChatRoomTotalMessagesAndUnread
  );

router
  .route('/from-me-boolean')
  .patch(authController.protect, chatRoomController.patchChatRoomFromMeBoolean);

router
  .route('/removeChatRoom')
  .patch(authController.protect, chatRoomController.removeChatRoom);

router.route('/:chatRoomId').get(chatRoomController.getChatRoom);

module.exports = router;
