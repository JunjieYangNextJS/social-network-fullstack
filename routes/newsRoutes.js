const express = require('express');

const authController = require('./../controllers/authController');
const newsController = require('./../controllers/newsController');

const router = express.Router();

router
  .route('/')
  .get(newsController.getAllNews)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    newsController.imageUploadMiddleware,
    newsController.createNews
  );

router.route('/whatIsNew').get(newsController.getWhatIsNew);

router
  .route('/searchQuery/:searchQuery')
  .get(newsController.getAllNewsFromSearchQuery);

// router
//   .route('/searchQuery/:searchQuery')
//   .get(newsController.getAllNewsFromSearchQuery);

router.route('/:id/update-viewCount').patch(newsController.updateNewsViewCount);

router
  .route('/deleteAllNotifications')
  .delete(newsController.deleteNotifications);

// router.get('/updateUsers', async (req, res, next) => {
//   const User = mongoose.model('User'); // Replace 'User' with your model name

//   const users = await User.find();

//   for (const user of users) {
//     // Check for missing properties and add them with defaults
//     if (!user.newProperty1) {
//       user.newProperty1 = 'default value 1';
//     }
//     if (!user.newProperty2) {
//       user.newProperty2 = 'default value 2';
//     }

//     // Save the updated user object
//     await user.save();

//   res.status(201).json({
//     status: 'success',
//     data: doc
//   });
// });

module.exports = router;
