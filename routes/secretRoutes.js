const express = require('express');
const authController = require('./../controllers/authController');
const secretController = require('./../controllers/secretController');
// const Secret = require('./../models/secretModel');

const router = express.Router();

// router.route('/L').get(secretController.getLStories);

router
  .route('/')
  .get(authController.isLoggedIn, secretController.getAllSecrets)
  .post(
    authController.protect,
    // authController.createAnonymousRandomUser,
    secretController.createSecret
  );

// router.delete('/addProp', async (req, res, next) => {
//   await Secret.deleteMany({});

//   res.status(201).json({
//     status: 'success'
//   });
// });

router
  .route('/secretTeller/:secretTellerId')
  .get(authController.isLoggedIn, secretController.getAllUserSecrets);

router.patch(
  '/:id/update-reports',
  authController.protect,
  secretController.updateSecretReports
);

router
  .route('/:id')
  .get(authController.isLoggedIn, secretController.getSecret)
  .patch(authController.protect, secretController.patchSecret)
  .delete(authController.protect, secretController.deleteSecret);

router.patch(
  '/patchWillNotify/:id',
  authController.protect,
  secretController.patchSecretWillNotify
);

module.exports = router;
