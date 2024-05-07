const express = require('express');
// const StoryComment = require('./../models/storyCommentModel');
const storyCommentController = require('../controllers/storyCommentController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

// router.use(authController.protect);
// router.use(authController.isLoggedIn);

router
  .route('/')
  .get(authController.isLoggedIn, storyCommentController.getAllStoryComments)
  .post(
    authController.isLoggedIn,
    authController.createAnonymousRandomUser,
    storyCommentController.createStoryComment
  );

// router.delete('/addProp', async (req, res, next) => {
//   await StoryComment.deleteMany({});

//   res.status(201).json({
//     status: 'success'
//   });
// });

router
  .route('/deletion/:id')
  .patch(authController.protect, storyCommentController.deleteStoryComment);

router
  .route('/:id')
  .get(storyCommentController.getStoryComment)
  .patch(
    authController.protect,
    // authController.restrictTo('user', 'admin'),
    storyCommentController.updateStoryComment
  );

router
  .route('/:id/update-reports')
  .patch(
    authController.protect,
    storyCommentController.updateStoryCommentReports
  );

router
  .route('/:id/update-subscribers')
  .patch(
    authController.protect,
    storyCommentController.updateStoryCommentSubscribers
  );

router
  .route('/:id/update-understated')
  .patch(authController.protect, storyCommentController.updateUnderstated);

router
  .route('/patchWillNotifyCommenter/:id')
  .patch(
    authController.protect,
    storyCommentController.patchWillNotifyCommenter
  );

module.exports = router;
