const express = require('express');
// const Post = require('./../models/postModel');
const authController = require('./../controllers/authController');
const postController = require('./../controllers/postController');

const router = express.Router();

// router.route('/L').get(postController.getLPosts);

router
  .route('/')
  .get(authController.isLoggedIn, postController.getAllPosts)
  .post(
    authController.isLoggedIn,
    authController.createAnonymousRandomUser,
    postController.createPost
  );

// router.delete('/addProp', async (req, res, next) => {
//   await Post.deleteMany({
//     sticky: false
//   });

//   res.status(201).json({
//     status: 'success'
//   });
// });

router
  .route('/stickyPosts')
  .get(authController.isLoggedIn, postController.getAllStickyPosts);

router
  .route('/relatedAndUnresponsedPosts/:postId/:about')
  .get(postController.getRelatedAndUnresponsedPosts);

router
  .route('/poster/:posterId')
  .get(authController.isLoggedIn, postController.getAllUserPosts);

router
  .route('/images')
  .post(postController.uploadPostImages, postController.resizeImages);

// Draft Posts
router.get('/draft', authController.protect, postController.getDraftPosts);

router
  .route('/draft/:postId')
  .get(authController.protect, postController.getDraftPost);

router
  .route('/searchQuery/:searchQuery')
  .get(postController.getAllPostsFromSearchQuery);

router.patch('/addNewProperty', postController.addNewProperty);

// patching

router.route('/:id/from-viewers').patch(postController.updatePostFromViewers);

router.route('/:id/update-viewCount').patch(postController.updatePostViewCount);

router
  .route('/:id/update-reports')
  .patch(authController.protect, postController.updatePostReports);

router
  .route('/:id/update-subscribers')
  .patch(authController.protect, postController.updatePostSubscribers);

router
  .route('/:id/update-pinnedComment')
  .patch(authController.protect, postController.updatePinnedComment);

router
  .route('/:id/update-draftToPost')
  .patch(authController.protect, postController.patchDraftToPost);

router
  .route('/update-postVotes')
  .patch(authController.protect, postController.patchPostVotes);

router
  .route('/:id')
  .get(authController.isLoggedIn, postController.getPost)
  .patch(authController.protect, postController.patchPost)
  .delete(authController.protect, postController.deletePost);

module.exports = router;
