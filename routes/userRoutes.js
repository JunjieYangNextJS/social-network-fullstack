const express = require('express');

const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const otherUserController = require('./../controllers/otherUserController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/googleLogin', authController.googleLogin);
router.post('/guestLogin', authController.guestLogin);
router.patch(
  '/convertGuestToUser',
  authController.protect,
  authController.convertGuestToUser
);

router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.post(
  '/postStoryImageUpload',
  authController.protect,
  userController.imageUploadMiddleware,
  userController.postStoryImageUpload
);
router.post(
  '/commentImageUpload',
  authController.protect,
  userController.imageUploadMiddleware,
  userController.commentImageUpload
);
router.post(
  '/replyImageUpload',
  authController.protect,
  userController.imageUploadMiddleware,
  userController.replyImageUpload
);
// get presign
router.get(
  '/expoPostStoryImageUpload',
  authController.protect,
  userController.expoPostStoryImageUpload
);

// From others
router.patch(
  '/updateMeFromOthers',

  userController.updateMeFromOthers
);
// router.use(authController.restrictTo('admin'));

// Protect all routes after this middleware
// router.use(authController.protect);

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);

router.patch(
  '/deleteMyAccount',
  authController.protect,
  authController.deleteMyAccount
);
router.delete(
  '/deleteMyGuestAccount',
  authController.protect,
  authController.deleteMyGuestAccount
);

router.get('/me', authController.protect, userController.getMe);

router
  .route('/searchQuery/:searchQuery')
  .get(userController.getAllUsersFromSearchQuery);

router
  .route('/willNotifyNotifications')
  .get(authController.protect, userController.getWillNotifyNotifications)
  .patch(
    authController.protect,
    userController.patchReadWillNotifyNotifications
  );

router
  .route('/notifications')
  .get(authController.protect, userController.getMyNotifications);

router
  .route('/notifications/:id')
  .patch(authController.protect, userController.patchNotification);

router.get(
  '/getPopularPeople',
  authController.isLoggedIn,
  otherUserController.getPopularPeople
);
router.get(
  '/getLikeMindedPeople',
  authController.protect,
  otherUserController.getLikeMindedPeople
);

router.get(
  '/getMyFollowingPeoplePosts',
  authController.protect,
  otherUserController.getMyFollowingPeoplePosts
);
router.get(
  '/getMyFollowingPeopleStories',
  authController.protect,
  otherUserController.getMyFollowingPeopleStories
);

router.get(
  '/getMyFollowingPeople',
  authController.protect,
  userController.getMyFollowingPeople
);

router.get(
  '/getOtherUserFollowers/:username',
  otherUserController.getOtherUserFollowers
);

router.get(
  '/getOtherUserFollowing/:username',
  otherUserController.getOtherUserFollowing
);

router.get(
  '/getOtherUserLikeMinded/:gender/:sexuality',
  authController.isLoggedIn,
  otherUserController.getOtherUserLikeMinded
);

router
  .route('/updateMe')
  .patch(
    authController.protect,
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.updateMe
  )
  .post(
    authController.protect,
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.updateMe
  );

router
  .route('/updateMeWithoutPhoto')
  .patch(
    authController.protect,

    userController.updateMeWithoutPhoto
  )
  .post(
    authController.protect,

    userController.updateMeWithoutPhoto
  );

// handle friends
router.patch(
  '/:id/removeFriend',
  authController.protect,
  otherUserController.removeFriend
);
router.patch(
  '/:id/acceptFriendRequest',
  authController.protect,
  otherUserController.acceptFriendRequest
);

router.patch(
  '/removeFriendRequest',
  authController.protect,
  otherUserController.removeFriendRequest
);

router
  .route('/:id/receiveFriendRequest')
  .patch(authController.protect, otherUserController.receiveFriendRequest);

router.patch(
  '/addBlockedUser',
  authController.protect,
  userController.addBlockedUser
);
router.patch(
  '/removeBlockedUser',
  authController.protect,
  userController.removeBlockedUser
);

router
  .route('/:id/update-reports')
  .patch(authController.protect, userController.updateUserReports);

// HANDLE PATCH POSTS METHODS

router.patch(
  '/patchLikedItems',
  authController.protect,
  userController.patchLikedItems
);
router.patch(
  '/patchBookmarkedItems',
  authController.protect,
  userController.patchBookmarkedItems
);

// handleBookmarkedPost
router.patch(
  '/addBookmarkedPost',
  authController.protect,
  userController.addBookmarkedPost
);
router.patch(
  '/removeBookmarkedPost',
  authController.protect,
  userController.removeBookmarkedPost
);
// handle hiddenPost
router.get(
  '/getHiddenPosts',
  authController.protect,
  userController.getHiddenPosts
);
router.patch(
  '/addHiddenPost',
  authController.protect,
  userController.addHiddenPost
);
router.patch(
  '/removeHiddenPost',
  authController.protect,
  userController.removeHiddenPost
);
// handleLikedStory
router.patch(
  '/addLikedStory',
  authController.protect,
  userController.addLikedStory
);
router.patch(
  '/removeLikedStory',
  authController.protect,
  userController.removeLikedStory
);
// handleBookmarkedStory
router.patch(
  '/addBookmarkedStory',
  authController.protect,
  userController.addBookmarkedStory
);
router.patch(
  '/removeBookmarkedStory',
  authController.protect,
  userController.removeBookmarkedStory
);
// handle hiddenStory
router.get(
  '/getHiddenStories',
  authController.protect,
  userController.getHiddenStories
);
router.patch(
  '/addHiddenStory',
  authController.protect,
  userController.addHiddenStory
);
router.patch(
  '/removeHiddenStory',
  authController.protect,
  userController.removeHiddenStory
);
// handleLikedSecret
router.patch(
  '/addLikedSecret',
  authController.protect,
  userController.addLikedSecret
);
router.patch(
  '/removeLikedSecret',
  authController.protect,
  userController.removeLikedSecret
);
// handleBookmarkedSecret
router.patch(
  '/addBookmarkedSecret',
  authController.protect,
  userController.addBookmarkedSecret
);
router.patch(
  '/removeBookmarkedSecret',
  authController.protect,
  userController.removeBookmarkedSecret
);
// handle hiddenSecret
router.get(
  '/getHiddenSecrets',
  authController.protect,
  userController.getHiddenSecrets
);
router.patch(
  '/addHiddenSecret',
  authController.protect,
  userController.addHiddenSecret
);
router.patch(
  '/removeHiddenSecret',
  authController.protect,
  userController.removeHiddenSecret
);
// handle chatRooms
router.patch(
  '/addChatRoom',
  authController.protect,
  otherUserController.addChatRoom
);
router.patch(
  '/removeChatRoom',
  authController.protect,
  otherUserController.removeChatRoom
);

// get blocked;
router.get(
  '/getBlockedUsers',
  authController.protect,
  userController.getBlockedUsers
);

// get my creations;
router.get('/getMyPosts', authController.protect, userController.getMyPosts);
router.get(
  '/getMyComments/:set',
  authController.protect,
  userController.getMyComments
);

router.get(
  '/getMyStories',
  authController.protect,
  userController.getMyStories
);
router.get(
  '/getMySecrets',
  authController.protect,
  userController.getMySecrets
);

router.get(
  '/getMyPostComments',
  authController.protect,
  userController.getMyPostComments
);
router.get(
  '/getMyPostReplies',
  authController.protect,
  userController.getMyPostReplies
);
router.get(
  '/getMyStoryComments',
  authController.protect,
  userController.getMyStoryComments
);
router.get(
  '/getMyStoryReplies',
  authController.protect,
  userController.getMyStoryReplies
);

// get liked and populate them in me/liked
router.get(
  '/getLikedPosts',
  authController.protect,
  userController.getLikedPosts
);
router.get(
  '/getLikedPostComments',
  authController.protect,
  userController.getLikedPostComments
);
router.get(
  '/getLikedPostReplies',
  authController.protect,
  userController.getLikedPostReplies
);
router.get(
  '/getLikedStories',
  authController.protect,
  userController.getLikedStories
);
router.get(
  '/getLikedStoryComments',
  authController.protect,
  userController.getLikedStoryComments
);
router.get(
  '/getLikedSecrets',
  authController.protect,
  userController.getLikedSecrets
);

// get bookmarked and populate them in me/bookmarked
router.get(
  '/getBookmarkedPosts',
  authController.protect,
  userController.getBookmarkedPosts
);
router.get(
  '/getBookmarkedPostComments',
  authController.protect,
  userController.getBookmarkedPostComments
);
router.get(
  '/getBookmarkedStories',
  authController.protect,
  userController.getBookmarkedStories
);
router.get(
  '/getBookmarkedStoryComments',
  authController.protect,
  userController.getBookmarkedStoryComments
);
router.get(
  '/getBookmarkedSecrets',
  authController.protect,
  userController.getBookmarkedSecrets
);

router
  .route('/updateEmailOrUsername')
  .patch(authController.protect, authController.updateEmailOrUsername);

router
  .route('/updateBirthday')
  .patch(authController.protect, authController.updateBirthday);
// router.patch('/updateMyEmailOrUsername', userController.updateMe);

// router
//   .route('/')
//   .get(userController.getAllUsers)
//   .post(userController.createUser);
router.get('/getHover/:userId', otherUserController.getHoverOtherUser);

router.delete('/deleteMe', userController.deleteMe);

router.patch(
  '/patchUserSilencedTill',
  authController.protect,
  authController.restrictTo('admin'),
  otherUserController.patchUserSilencedTill
);
router.patch(
  '/patchUsersProfileImage',
  otherUserController.patchUsersProfileImage
);

router.post(
  '/happyBirthday',
  authController.protect,
  authController.restrictTo('admin'),
  otherUserController.happyBirthday
);

router
  .route('/:id/addOtherUserChatRoom')
  .patch(authController.protect, otherUserController.addOtherUserChatRoom);

router
  .route('/:otherUserId/followOtherUser')
  .patch(authController.protect, otherUserController.followOtherUser);

router
  .route('/:otherUserId/unfollowOtherUser')
  .patch(authController.protect, otherUserController.unfollowOtherUser);

router.route('/:id/updateOtherUser').patch(otherUserController.updateOtherUser);

router
  .route('/:username')
  .get(authController.isLoggedIn, otherUserController.getOtherUser);

module.exports = router;
