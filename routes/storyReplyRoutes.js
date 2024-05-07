const express = require('express');
// const StoryReply = require('./../models/storyReplyModel');
const storyReplyController = require('../controllers/storyReplyController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

// router.use(authController.protect);
// router.use(authController.isLoggedIn);

router
  .route('/')
  .get(storyReplyController.getAllStoryReplies)
  .post(
    authController.isLoggedIn,
    authController.createAnonymousRandomUser,
    storyReplyController.createStoryReply
  );

// router.delete('/addProp', async (req, res, next) => {
//   await StoryReply.deleteMany({});

//   res.status(201).json({
//     status: 'success'
//   });
// });

router
  .route('/:id')

  .delete(
    authController.protect,
    authController.isLoggedIn,
    storyReplyController.deleteStoryReply
  );

// router
//   .route('/:id')
//   .get(storyCommentController.getStoryComment)
//   .patch(
//     authController.restrictTo('user', 'admin'),
//     storyCommentController.updateStoryComment
//   )
//   .delete(
//     authController.restrictTo('user', 'admin'),
//     storyCommentController.deleteStoryComment
//   );

router.use(authController.protect);
router
  .route('/:id/update-reports')
  .patch(storyReplyController.updateStoryReplyReports);

module.exports = router;
