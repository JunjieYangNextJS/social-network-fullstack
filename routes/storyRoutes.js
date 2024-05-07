const express = require('express');
// const Story = require('./../models/storyModel');
const authController = require('./../controllers/authController');
const storyController = require('./../controllers/storyController');

const router = express.Router();

router
  .route('/')
  .get(authController.isLoggedIn, storyController.getAllStories)
  .post(
    authController.isLoggedIn,
    authController.createAnonymousRandomUser,
    storyController.createStory
  );

// router.delete('/addProp', async (req, res, next) => {
//   await Story.deleteMany({
//     sticky: false
//   });

//   res.status(201).json({ status: 'success' });
// });

// Draft Stories
router.get('/draft', authController.protect, storyController.getDraftStories);

router
  .route('/draft/:storyId')
  .get(authController.protect, storyController.getDraftStory);

router
  .route('/searchQuery/:searchQuery')
  .get(storyController.getAllStoriesFromSearchQuery);

router
  .route('/storyTeller/:storyTellerId')
  .get(authController.isLoggedIn, storyController.getAllUserStories);

router
  .route('/relatedAndUnresponsedStories/:storyId/:about')
  .get(storyController.getRelatedAndUnresponsedStories);

router.route('/:id/from-viewers').patch(storyController.updateStoryFromViewers);

router
  .route('/:id/updateOpenComments')
  .patch(authController.protect, storyController.updateOpenComments);

router
  .route('/:id/update-reports')
  .patch(authController.protect, storyController.updateStoryReports);

router
  .route('/:id/update-pinnedComment')
  .patch(authController.protect, storyController.updatePinnedComment);

router
  .route('/:id/update-subscribers')
  .patch(authController.protect, storyController.updateStorySubscribers);

router
  .route('/:id')
  .get(storyController.getStory)
  .patch(authController.protect, storyController.patchStory)
  .delete(authController.protect, storyController.deleteStory);

module.exports = router;
