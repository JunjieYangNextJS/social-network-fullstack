const express = require('express');
const authController = require('../controllers/authController');
const DMController = require('../controllers/DMController');

const router = express.Router();

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'dev'),
    DMController.getAllDMs
  )
  .post(
    authController.protect,
    authController.restrictTo('user'),
    DMController.createDM
  );

// router
//   .route('/searchQuery/:searchQuery')
//   .get(DMController.getAllNewsFromSearchQuery);

// router
//   .route('/:id/update-viewCount')
//   .patch(DMController.updateNewsViewCount);

module.exports = router;
