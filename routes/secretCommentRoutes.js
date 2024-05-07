const express = require('express');
// const SecretComment = require('./../models/secretCommentModel');
const secretCommentController = require('../controllers/secretCommentController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

// router.use(authController.protect);
// router.use(authController.isLoggedIn);

router
  .route('/')
  .get(authController.isLoggedIn, secretCommentController.getAllSecretComments)
  .post(
    authController.protect,
    // authController.isLoggedIn,
    secretCommentController.createSecretComment
  );

router
  .route('/deletion')
  .patch(authController.protect, secretCommentController.deleteSecretComment);

// router.delete('/addProp', async (req, res, next) => {
//   await SecretComment.deleteMany({});

//   res.status(201).json({
//     status: 'success'
//   });
// });
// router.route('/addReply/:id').patch(
//   authController.protect,
//   // authController.restrictTo('user', 'admin'),
//   secretCommentController.addSecretReply
// );
// router.route('/deleteReply/:id').patch(
//   authController.protect,
//   // authController.restrictTo('user', 'admin'),
//   secretCommentController.deleteSecretReply
// );
router.route('/editReply').patch(
  authController.protect,
  // authController.restrictTo('user', 'admin'),
  secretCommentController.editSecretReply
);
// router.route('/editComment/:id').patch(
//   authController.protect,
//   // authController.restrictTo('user', 'admin'),
//   secretCommentController.editSecretComment
// );
// router.route('/deleteComment/:id').delete(
//   authController.protect,
//   // authController.restrictTo('user', 'admin'),
//   secretCommentController.deleteSecretComment
// );

router.patch(
  '/patchWillNotify/:id',
  authController.protect,
  secretCommentController.patchSecretCommentWillNotify
);

router.patch(
  '/patchHiddenBy/:id',
  authController.protect,
  secretCommentController.patchSecretCommentHiddenBy
);

router
  .route('/:id')
  .get(authController.protect, secretCommentController.getSecretComment);
// .patch(
//   authController.restrictTo('user', 'admin'),
//   secretCommentController.updateSecretComment
// )
// .delete(
//   authController.restrictTo('user', 'admin'),
//   secretCommentController.deleteSecretComment
// );

module.exports = router;
