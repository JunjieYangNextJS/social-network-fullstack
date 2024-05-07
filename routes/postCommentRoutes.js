const express = require('express');
const postCommentController = require('../controllers/postCommentController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

// router.use(authController.protect);
// router.use(authController.isLoggedIn);

router
  .route('/')
  .get(authController.isLoggedIn, postCommentController.getAllPostComments)
  .post(
    authController.isLoggedIn,
    authController.createAnonymousRandomUser,
    postCommentController.createPostComment
  );

router
  .route('/getMyPostComments')
  .get(authController.protect, postCommentController.getMyPostComments);

router
  .route('/deletion/:id')
  .patch(authController.protect, postCommentController.deletePostComment);

router
  .route('/patchWillNotifyCommenter/:id')
  .patch(
    authController.protect,
    postCommentController.patchWillNotifyCommenter
  );

router
  .route('/:id')
  .get(postCommentController.getPostComment)
  .patch(
    authController.protect,
    // authController.restrictTo('user', 'admin'),
    postCommentController.updatePostComment
  );

router
  .route('/:id/update-reports')
  .patch(authController.protect, postCommentController.reportPostComment);

router
  .route('/:id/update-subscribers')
  .patch(
    authController.protect,
    postCommentController.updatePostCommentSubscribers
  );
// router
//   .route('/:id')
//   .get(postCommentController.getPostComment)
//   .patch(
//     authController.restrictTo('user', 'admin'),
//     postCommentController.updatePostComment
//   )
//   .delete(
//     authController.restrictTo('user', 'admin'),
//     postCommentController.deletePostComment
//   );

module.exports = router;
