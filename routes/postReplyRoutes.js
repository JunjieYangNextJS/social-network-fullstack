const express = require('express');
const postReplyController = require('../controllers/postReplyController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

// router.use(authController.protect);
// router.use(authController.isLoggedIn);

// router.delete('/addProp', async (req, res, next) => {
//   await PostComment.deleteMany({});

//   res.status(201).json({
//     status: 'success'
//   });
// });

router
  .route('/')
  .get(postReplyController.getAllPostReplies)
  .post(
    authController.isLoggedIn,
    authController.createAnonymousRandomUser,
    postReplyController.createPostReply
  );

router
  .route('/updateLikes/:id')
  .patch(authController.protect, postReplyController.patchPostReplyLikes);

// router.route('/deleteAll').patch(postReplyController.deleteAllNotifications);

router
  .route('/:id')
  .patch(authController.protect, postReplyController.updatePostReply)
  .delete(authController.protect, postReplyController.deletePostReply);

router
  .route('/:id/update-reports')
  .patch(authController.protect, postReplyController.updatePostReplyReports);

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
