const mongoose = require('mongoose');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');
const User = require('./../models/userModel');
const Secret = require('./../models/secretModel');
const SecretComment = require('./../models/secretCommentModel');
const Post = require('./../models/postModel');
const PostComment = require('./../models/postCommentModel');
const PostReply = require('./../models/postReplyModel');
const Story = require('./../models/storyModel');
const StoryComment = require('./../models/storyCommentModel');
const StoryReply = require('./../models/storyReplyModel');
const Notification = require('./../models/notificationModel');
// const News = require('./../models/postReplyModel');
const genericErrorMessage = require('./../utils/genericErrorMessage');
const { cleanSanitize, sanitizeAllTags } = require('./../utils/sanitize');
const cleanBadWord = require('../utils/cleanBadWord');

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour (hack)
    // let filter = {};
    // if (req.params.tourId) filter = { tour: req.params.tourId };

    if (req.query.about === 'general' || req.query.about === 'General')
      delete req.query.about;

    // if (exposedTo) {
    const features = new APIFeatures(
      Model.find({
        exposedTo: 'public',
        banned: undefined,
        createdAt: { $lte: new Date().toISOString() },
        draft: false,
        sticky: false
      }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const docs = await features.query;

    const totalDocsInDB = await Model.countDocuments({
      exposedTo: 'public',
      createdAt: { $lte: new Date().toISOString() },
      draft: false,
      banned: undefined,
      sticky: false
    });

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        data: docs
      },
      totalDocsInDB
    });

    // if (req.query.about === 'general') delete req.query.about;

    // if (req.user) {
    //   // if (exposedTo) {
    //   const features = new APIFeatures(
    //     Model.find({
    //       exposedTo: 'public',
    //       banned: undefined,
    //       createdAt: { $lte: new Date().toISOString() },
    //       draft: false,
    //       sticky: false,
    //       _id: { $nin: req.user[hidden] },
    //       [creator]: { $nin: req.user.blockedUsers }
    //     }),
    //     req.query
    //   )
    //     .filter()
    //     .sort()
    //     .limitFields()
    //     .paginate();
    //   const docs = await features.query;

    //   const totalDocsInDB = await Model.countDocuments({
    //     exposedTo: 'public',
    //     createdAt: { $lte: new Date().toISOString() },
    //     draft: false,
    //     banned: undefined,
    //     sticky: false
    //   });

    //   // SEND RESPONSE
    //   res.status(200).json({
    //     status: 'success',
    //     results: docs.length,
    //     data: {
    //       data: docs
    //     },
    //     totalDocsInDB
    //   });
    // } else {
    //   const features = new APIFeatures(
    //     Model.find({
    //       exposedTo: 'public',
    //       banned: undefined,
    //       createdAt: { $lte: new Date().toISOString() },
    //       draft: false,
    //       sticky: false
    //     }),
    //     req.query
    //   )
    //     .filter()
    //     .sort()
    //     .limitFields()
    //     .paginate();
    //   const docs = await features.query;

    //   const totalDocsInDB = await Model.countDocuments({
    //     exposedTo: 'public',
    //     createdAt: { $lte: new Date().toISOString() },
    //     draft: false,
    //     banned: undefined,
    //     sticky: false
    //   });

    //   // SEND RESPONSE
    //   res.status(200).json({
    //     status: 'success',
    //     results: docs.length,
    //     data: {
    //       data: docs
    //     },
    //     totalDocsInDB
    //   });
    // }
  });

exports.deleteOne = (Model, userId) =>
  catchAsync(async (req, res, next) => {
    try {
      if (Model === Post) {
        await Post.findOneAndDelete({
          _id: req.params.id,
          [userId]: req.user.id
        });
      }
      if (Model === Story) {
        await Story.findOneAndDelete({
          _id: req.params.id,
          [userId]: req.user.id
        });
      }

      if (Model === PostComment || Model === PostReply) {
        if (Model === PostComment) {
          await Notification.deleteMany({
            sender: req.user._id,
            commentId: req.params.id
          });

          const isReplyExists = await PostReply.exists({
            postComment: mongoose.Types.ObjectId(req.params.id)
          });

          if (isReplyExists) {
            await PostComment.findOneAndUpdate(
              {
                _id: req.params.id,
                [userId]: req.user.id
              },
              {
                $set: {
                  content: '<p>[ This content has been deleted. ]</p>',
                  commenter: mongoose.Types.ObjectId(process.env.DELETE_BOT_ID),
                  editedAt: Date.now()
                }
              }
            );
          } else {
            await PostComment.findOneAndDelete({
              _id: req.params.id,
              [userId]: req.user.id
            });

            await Post.updateOne(
              { _id: req.body.post },
              { $inc: { commentCount: -1 } },
              {
                new: true,
                runValidators: true
              }
            );
          }
        }

        if (Model === PostReply) {
          // code is working but it is not throwing an error if not successful

          const p1 = Notification.deleteMany({
            sender: req.user._id,
            replyId: req.params.id
          });
          const p2 = PostReply.findOneAndDelete({
            _id: req.params.id,
            [userId]: req.user.id
          });

          await Promise.all([p1, p2]);

          await Post.updateOne(
            { _id: req.body.post },
            { $inc: { commentCount: -1 } },
            {
              new: true,
              runValidators: true
            }
          );
        }
      }
      if (Model === StoryComment || Model === StoryReply) {
        if (Model === StoryComment) {
          await Notification.deleteMany({
            sender: req.user._id,
            commentId: req.params.id
          });

          const isReplyExists = await StoryReply.exists({
            storyComment: mongoose.Types.ObjectId(req.params.id)
          });

          if (isReplyExists) {
            await StoryComment.findOneAndUpdate(
              {
                _id: req.params.id,
                [userId]: req.user.id
              },
              {
                $set: {
                  content: '<p>[ This content has been deleted. ]</p>',
                  commenter: mongoose.Types.ObjectId(process.env.DELETE_BOT_ID),
                  editedAt: Date.now()
                }
              }
            );
          } else {
            await StoryComment.findOneAndDelete({
              _id: req.params.id,
              [userId]: req.user.id
            });
          }
        }

        if (Model === StoryReply) {
          const p1 = Notification.deleteMany({
            sender: req.user._id,
            replyId: req.params.id
          });

          const p2 = StoryReply.findOneAndDelete({
            _id: req.params.id,
            [userId]: req.user.id
          });

          await Promise.all([p1, p2]);
        }

        await Story.updateOne(
          { _id: req.body.story },
          { $inc: { commentCount: -1 } },
          {
            new: true,
            runValidators: true
          }
        );
      }

      // doc = await Model.findOneAndDelete({
      //   _id: req.params.id,
      //   [userId]: req.user.id
      // });
    } catch (e) {
      return next(new AppError('Oops, something went wrong', 400));
    }

    // if (doc[`${userId}`].id !== req.user.id) {
    //   return next(new AppError('Permission is not granted', 401));
    // }
    // await Model.deleteOne({ _id: doc._id });

    res.status(204).json({
      status: 'success',
      data: null
    });
  });

exports.updateOne = (Model, property, user) =>
  catchAsync(async (req, res, next) => {
    let modelQueryName;

    switch (Model) {
      case Post:
        modelQueryName = 'postId';
        break;
      case PostComment:
        modelQueryName = 'commentId';
        break;
      case PostReply:
        modelQueryName = 'replyId';
        break;
      case Story:
        modelQueryName = 'storyId';
        break;
      case StoryComment:
        modelQueryName = 'commentId';
        break;
      case StoryReply:
        modelQueryName = 'replyId';
        break;
      case Secret:
        modelQueryName = 'secretId';
        break;
      case SecretComment:
        modelQueryName = 'commentId';
        break;

      default:
        break;
    }

    try {
      const doc = await Model.findOneAndUpdate(
        { _id: req.params.id, [user]: req.user.id },
        { $set: { [property]: req.body[property], editedAt: Date.now() } },
        {
          new: true,
          runValidators: true
        }
      );

      if (modelQueryName === 'postId' || modelQueryName === 'storyId') {
        await Notification.updateMany(
          { [modelQueryName]: req.params.id, sender: req.user._id },
          { content: sanitizeAllTags(doc.title) }
        );
      } else {
        await Notification.updateMany(
          { [modelQueryName]: req.params.id, sender: req.user._id },
          { content: sanitizeAllTags(doc.content) }
        );
      }
    } catch (e) {
      return next(new AppError('Oops, something is wrong', 400));
    }

    res.status(200).json({
      status: 'success'
      // data: {
      //   data: doc
      // }
    });
  });

exports.createOne = (Model, creator) =>
  catchAsync(async (req, res, next) => {
    if (Model === Secret && !Number.isInteger(req.body.expiredAt)) {
      return next(new AppError('Please enter a validate expiration time', 400));
    }

    if (Model === Secret && req.body.expiredAt - 550000 <= Date.now()) {
      return next(
        new AppError('Secrets should not expire in less than 10 minutes', 400)
      );
    }

    let doc;

    let sanitizedContent;

    if (req.body.content) sanitizedContent = cleanSanitize(req.body.content);

    try {
      if (Model === Post) {
        if (!req.body.title)
          return next(new AppError('Please enter your title', 400));

        doc = await Model.create({
          ...req.body,
          content: sanitizedContent,
          title: cleanBadWord(req.body.title),
          poster: req.user.id
        });
      }

      if (Model === Story || Model === Secret) {
        if (!req.body.title)
          return next(new AppError('Please enter your title', 400));

        doc = await Model.create({
          ...req.body,
          [creator]: req.user.id,
          content: sanitizedContent,
          title: cleanBadWord(req.body.title)
        });
      }
      // cleanse and create

      // if (Model === PostComment || Model === PostReply) {
      //   // update and get post

      //   const post = await Post.findByIdAndUpdate(
      //     req.body.post,
      //     {
      //       $inc: { commentCount: 1 },
      //       $set: { lastCommentedAt: Date.now() }
      //     },
      //     {
      //       new: true,
      //       runValidators: true
      //     }
      //   );

      //   if (!post) return next(new AppError('Post is not found', 404));

      //   console.log('sus1');
      //   const mentionedUsers = req.body.content
      //     .split(' ')
      //     .filter(str => str.startsWith('@'))
      //     .map(s => s.slice(1));
      //   // const atArray = splitted.filter(str => str.startsWith('@'));
      //   // const usernames = atArray.map(s => s.slice(1));
      //   console.log('sus end');
      //   // create postComment/ postReply
      //   if (post.poster.id !== req.user.id && post.willNotify) {
      //     doc = await Model.create({
      //       ...req.body,
      //       content: sanitizedContent
      //     });
      //   } else {
      //     doc = await Model.create({
      //       ...req.body,
      //       content: sanitizedContent,
      //       willNotify: false
      //     });
      //   }

      //   console.log('sus 2');
      //   if (Model === PostComment) {
      //     let promises = [];

      //     for (let user of mentionedUsers) {
      //       promises.push(
      //         User.updateOne(
      //           { username: user },
      //           {
      //             $push: {
      //               mentioned: {
      //                 username: req.user.username,
      //                 t_id: doc.id,
      //                 route: 'postComments'
      //               }
      //             }
      //           }
      //         )
      //       );
      //     }

      //     await Promise.all(promises);
      //   }
      //   console.log('sus3');

      //   if (Model === PostReply) {
      //     await User.updateOne(
      //       { username: 'test99' },
      //       {
      //         $push: {
      //           mentioned: {
      //             username: req.user.username,
      //             t_id: doc.postComment,
      //             route: 'postReplies',
      //             replyId: doc._id
      //           }
      //         }
      //       }
      //     );
      //   }
      // }

      // update post's commentCount per postComment created
    } catch (e) {
      return next(new AppError('Oops, something is wrong', 400));
    }

    res.status(201).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) {
      // for (let pop of popOptions) {
      //   query = query.populate(pop);
      // }
      query = query.populate(popOptions);
    }
    const doc = await query;
    // const doc = await Model.findById(req.params.id).populate(
    //   popOptions.join(' ')
    // );

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.getAllUserCreations = (
  Model,
  creator,
  creatorId,
  creations,
  creationsExposedTo
) =>
  catchAsync(async (req, res, next) => {
    // creator = poster, creatorId = posterId, creations= posts, creationsExposedTo = postsExposedTo
    req.query[creator] = req.params[creatorId];
    const selectedUser = await User.findById(req.params[creatorId]).select(
      `${creationsExposedTo} friendList followers`
    );

    if (!selectedUser) {
      return next(new AppError('No user found with that ID', 404));
    }

    if (
      selectedUser[creationsExposedTo] === 'private' &&
      req.user &&
      req.user.id !== selectedUser.id
    )
      return next(new AppError(`This user hid their ${creations}`, 403));

    if (
      selectedUser[creationsExposedTo] === 'friendsOnly' &&
      req.user &&
      req.user.id !== selectedUser.id &&
      !selectedUser.friendList.includes(req.user.id)
    )
      return next(
        new AppError(
          `Their ${creations} are protected, add them as a friend to see their ${creations}`,
          403
        )
      );

    if (
      selectedUser[creationsExposedTo] === 'friendsAndFollowersOnly' &&
      req.user &&
      req.user.id !== selectedUser.id &&
      !selectedUser.friendList.includes(req.user.id) &&
      !selectedUser.followers.includes(req.user.id)
    )
      return next(
        new AppError(
          `Their ${creations} are protected, follow them or add them as a friend, and then refresh the page to see their ${creations}`,
          403
        )
      );

    const features = new APIFeatures(Model.find({ draft: false }), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;

    const totalDocsInDB = await Model.countDocuments({
      [creator]: selectedUser.id,
      draft: false
    });

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc
      },
      totalDocsInDB
    });
  });

exports.updateViewCount = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewCount: 1 } },
      {
        new: true,
        runValidators: true
      }
    );

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.patchArrayMethod = (Model, method, property) =>
  catchAsync(async (req, res, next) => {
    try {
      await Model.updateOne(
        { _id: req.user.id },
        { [method]: { [property]: req.body.item } },
        {
          new: true,
          safe: true,
          runValidators: true
        }
      );
    } catch (e) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success'
    });
  });

exports.patchLikedMethod = () =>
  catchAsync(async (req, res, next) => {
    // try {
    if (req.body.method !== '$pull' && req.body.method !== '$addToSet')
      return next(new AppError('You cannot do that', 403));

    const allowed = [
      'likedPosts',
      'likedPostComments',
      'likedStories',
      'likedStoryComments'
    ];

    if (!allowed.includes(req.body.likedProperty))
      return next(new AppError('You cannot do that', 403));

    const userUpdate = User.updateOne(
      { _id: req.user.id },
      { [req.body.method]: { [req.body.likedProperty]: req.body.itemId } },
      {
        new: true,
        safe: true,
        runValidators: true
      }
    );

    let obj;
    let someoneLikedRoute;
    let receiverProperty;
    let idProperty;

    switch (req.body.likedProperty) {
      case 'likedPosts':
        obj = Post;
        someoneLikedRoute = 'posts';
        receiverProperty = 'poster';
        idProperty = 'postId';
        break;
      case 'likedPostComments':
        obj = PostComment;
        someoneLikedRoute = 'postComments';
        receiverProperty = 'commenter';
        idProperty = 'commentId';
        break;

      case 'likedStories':
        obj = Story;
        someoneLikedRoute = 'stories';
        receiverProperty = 'storyTeller';
        idProperty = 'storyId';
        break;
      case 'likedStoryComments':
        obj = StoryComment;
        someoneLikedRoute = 'storyComments';
        receiverProperty = 'commenter';
        idProperty = 'commentId';
        break;

      default:
        return next(new AppError('You cannot do that', 403));
    }

    let changeLikesCount;

    if (req.body.method === '$addToSet') {
      changeLikesCount = 1;
    } else {
      changeLikesCount = -1;
    }

    // if (req.body.likedProperty === 'likedPostComments') obj = PostComment;

    const itemUpdate = obj.findByIdAndUpdate(
      req.body.itemId,

      {
        [req.body.method]: { likes: req.user._id },
        $inc: { likesCount: changeLikesCount }
      },

      {
        new: true,
        runValidators: true
      }
    );

    const resolved = await Promise.all([userUpdate, itemUpdate]);

    if (
      req.body.method === '$pull' &&
      resolved[1][`${receiverProperty}`].id !== req.user.id
    ) {
      await Notification.deleteOne({
        [idProperty]: resolved[1].id,
        sender: req.user._id,
        replyId: undefined,
        someoneLiked: true
      });
    }

    if (
      req.body.method === '$addToSet' &&
      resolved[1][`${receiverProperty}`].id !== req.user.id
    ) {
      const dupNotification = await Notification.countDocuments({
        sender: req.user._id,
        [idProperty]: resolved[1].id,
        replyId: undefined,
        someoneLiked: true
      });

      if (dupNotification === 0) {
        const cleaned =
          someoneLikedRoute === 'posts' || someoneLikedRoute === 'stories'
            ? sanitizeAllTags(resolved[1].title)
            : sanitizeAllTags(resolved[1].content);

        await Notification.create({
          sender: req.user._id,
          receiver: [
            {
              receiver: resolved[1][`${receiverProperty}`]._id,
              read: false,
              checked: false,
              receiverIsMentioned: false
            }
          ],
          content: cleaned,
          route: someoneLikedRoute,
          [idProperty]: resolved[1].id,
          someoneLiked: true
        });
      }
    }
    // } catch (e) {
    //   return next(new AppError('No document found with that ID', 404));
    // }
    // try {
    //   if (req.user[property].includes(req.body.itemId)) {
    //     const userUpdate = User.updateOne(
    //       { _id: req.user.id },
    //       { $pull: { [property]: req.body.itemId } },
    //       {
    //         new: true,
    //         safe: true,
    //         runValidators: true
    //       }
    //     );

    //     const itemUpdate = ItemModel.updateOne(
    //       { _id: req.body.itemId },
    //       { $pull: { likes: req.user.id } },
    //       {
    //         new: true,
    //         runValidators: true
    //       }
    //     );

    //     await Promise.all([userUpdate, itemUpdate]);
    //   } else {
    //     const userUpdate = User.updateOne(
    //       { _id: req.user.id },
    //       { $addToSet: { [property]: req.body.itemId } },
    //       {
    //         new: true,
    //         safe: true,
    //         runValidators: true
    //       }
    //     );

    //     const itemUpdate = ItemModel.updateOne(
    //       { _id: req.body.itemId },
    //       { $addToSet: { likes: req.user.id } },
    //       {
    //         new: true,
    //         runValidators: true
    //       }
    //     );

    //     await Promise.all([userUpdate, itemUpdate]);

    //     console.log(1);
    //   }
    // } catch (e) {
    //   return next(new AppError('No document found with that ID', 404));
    // }

    res.status(200).json({
      status: 'success'
    });
  });

exports.patchBookmarkedMethod = () =>
  catchAsync(async (req, res, next) => {
    let statement;

    try {
      if (req.body.method !== '$pull' && req.body.method !== '$addToSet')
        return next(new AppError('You cannot do that', 403));
      const allowed = [
        'bookmarkedPosts',
        'bookmarkedPostComments',
        'bookmarkedStories',
        'bookmarkedStoryComments'
      ];

      if (!allowed.includes(req.body.bookmarkedProperty))
        return next(new AppError('You cannot do that', 403));

      if (req.body.method === '$pull')
        statement = 'This has been removed from your bookmarks.';
      if (req.body.method === '$addToSet')
        statement = 'This has been added to your bookmarks.';

      await User.updateOne(
        { _id: req.user.id },
        {
          [req.body.method]: { [req.body.bookmarkedProperty]: req.body.itemId }
        },
        {
          new: true,
          safe: true,
          runValidators: true
        }
      );
    } catch (e) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      statement
    });
  });

exports.updateReports = Model =>
  catchAsync(async (req, res, next) => {
    await Model.updateOne(
      { _id: req.params.id },
      {
        $pull: { reports: { reporterId: req.user._id } }
      },

      {
        runValidators: true
      }
    );
    const doc = await Model.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: {
          reports: {
            reporterId: req.user._id,
            reportedFor: req.body.reportedFor
          }
        }
      },

      {
        runValidators: true
      }
    );

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    if (doc.reports.length >= 20 && doc.banned === undefined) {
      const mostFrequent = arr =>
        Object.entries(
          arr
            .map(el => el.reportedFor)
            .reduce((a, v) => {
              a[v] = a[v] ? a[v] + 1 : 1;
              return a;
            }, {})
        ).reduce((a, v) => (v[1] >= a[1] ? v : a), [null, 0])[0];

      const mostlyReportedFor = mostFrequent(doc.reports);

      await Model.updateOne(
        { _id: req.params.id },
        {
          $set: { banned: mostlyReportedFor }
        },

        {
          runValidators: true
        }
      );
    }

    res.status(200).json({
      status: 'success'
    });
  });

exports.getMyItems = (items, select) =>
  catchAsync(async (req, res, next) => {
    const doc = await User.findById(req.user.id)
      .select(items)
      .populate(items, select);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc[items].reverse()
      }
    });
  });

exports.getMyItemsInf = (Modal, creator) =>
  catchAsync(async (req, res, next) => {
    const features = new APIFeatures(
      Modal.find({
        [creator]: req.user.id
      }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;

    // const doc = await features.query;

    const totalDocsInDB = await Modal.countDocuments({
      [creator]: req.user.id
    });

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      data: doc,
      totalDocsInDB
    });
  });

exports.getMyComments = (items, select) =>
  catchAsync(async (req, res, next) => {
    // if (items === 'myPostComments') {
    //   const totalDocsInDB = await PostComment.countDocuments({
    //     commenter: req.user.id
    //   });

    //   const doc = await User.findById(req.user.id)
    //     .select(items)
    //     .populate({
    //       path: items,
    //       select,
    //       options: {
    //         sort: '-createdAt',
    //         limit: req.query.limit,
    //         skip: (req.query.page - 1) * req.query.limit
    //       }
    //     });

    //   if (!doc) {
    //     return next(new AppError('No document found with that ID', 404));
    //   }

    //   console.log(totalDocsInDB, doc[items]);

    //   return res.status(200).json({
    //     status: 'success',
    //     data: doc[items],
    //     totalDocsInDB
    //   });
    // }

    const doc = await User.findById(req.user.id)
      .select(items)
      .populate({
        path: items,
        select,
        options: {
          sort: '-createdAt',
          limit: req.query.limit,
          skip: (req.query.page - 1) * req.query.limit
        }
      });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: doc[items]
    });
  });

exports.getMyReplies = (Model, queryKey) =>
  catchAsync(async (req, res, next) => {
    const totalDocsInDB = await Model.countDocuments({
      [queryKey]: req.user.id
    });

    const features = new APIFeatures(
      Model.find({
        [queryKey]: req.user.id
      }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // features.query = features.query.populate('replier');

    const doc = await features.query.populate(queryKey);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: doc,
      totalDocsInDB
    });
  });

exports.getMyLikedReplies = Model =>
  catchAsync(async (req, res, next) => {
    const totalDocsInDB = await Model.countDocuments({
      likes: req.user.id
    });

    const features = new APIFeatures(
      Model.find({
        likes: req.user.id
      }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // features.query = features.query.populate('replier');

    const doc = await features.query.populate('replier');

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: doc,
      totalDocsInDB
    });
  });

exports.getMyCommentsAndReplies = () =>
  catchAsync(async (req, res, next) => {
    const doc = await User.findById(req.user.id)
      .select(`myPostComments myPostReplies`)
      .populate(`myPostComments myPostReplies`, '-reports');

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    // myStoryComments myStoryReplies mySecretComments

    const sorted = [...doc.myPostComments, ...doc.myPostReplies].sort((a, b) =>
      a.createdAt < b.createdAt ? 1 : -1
    );

    const data = sorted.slice(req.params.set * 60, (req.params.set + 1) * 60);

    res.status(200).json({
      status: 'success',
      data: {
        myComments: data,
        totalDocs: sorted.length
      }
    });
  });

exports.updatePinnedComment = (Model, creator) =>
  catchAsync(async (req, res, next) => {
    try {
      await Model.updateOne(
        { _id: req.params.id, [creator]: req.user.id },
        { pinned: req.body.pinned },
        {
          new: true,
          runValidators: true
        }
      );
    } catch (e) {
      return next(new AppError(genericErrorMessage, 400));
    }

    res.status(200).json({
      status: 'success'
    });
  });

exports.updateWillNotify = (Model, creator) =>
  catchAsync(async (req, res, next) => {
    try {
      await Model.updateOne(
        { _id: req.params.creationId, [creator]: req.user.id },
        [{ $set: { willNotify: { $not: '$willNotify' } } }],
        {
          new: true,
          runValidators: true
        }
      );
    } catch (e) {
      return next(new AppError(genericErrorMessage, 400));
    }

    res.status(200).json({
      status: 'success'
    });
  });

exports.getMyFollowingPeopleCreations = (Model, creator) =>
  catchAsync(async (req, res, next) => {
    const features = new APIFeatures(
      Model.find({
        [creator]: { $in: req.user.following },
        exposedTo: { $in: ['public', 'friendsAndFollowersOnly'] },
        banned: undefined,
        createdAt: { $lte: new Date().toISOString() },
        draft: false
      }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const docs = await features.query;

    // const doc = await features.query;

    const totalDocsInDB = await Model.countDocuments({
      [creator]: { $in: req.user.following },
      exposedTo: { $in: ['public', 'friendsAndFollowersOnly'] },
      createdAt: { $lte: new Date().toISOString() },
      draft: false,
      banned: undefined
    });

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        data: docs
      },
      totalDocsInDB
    });
  });

exports.updateSubscribers = Model =>
  catchAsync(async (req, res, next) => {
    if (req.body.isSubscribed) {
      await Model.updateOne(
        { _id: req.params.id },
        {
          $pull: { subscribers: req.user.id }
        },
        {
          new: true,
          runValidators: true
        }
      );
    } else {
      await Model.updateOne(
        { _id: req.params.id },
        {
          $addToSet: { subscribers: req.user.id }
        },
        {
          new: true,
          runValidators: true
        }
      );
    }

    res.status(200).json({
      status: 'success'
    });
  });
