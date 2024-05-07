const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, 'Please tell us your username!']
    },
    profileName: {
      type: String
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email']
    },

    role: {
      type: String,
      enum: ['user', 'admin', 'dev', 'bot'],
      default: 'user'
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
      select: false
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        // This only works on CREATE and SAVE!!!
        validator: function(el) {
          return el === this.password;
        },
        message: 'Passwords are not the same!'
      }
    },

    birthYear: Number,

    birthMonth: Number,

    birthDay: Number,

    createdAt: {
      type: Date,
      default: Date.now
      // select: false
    },

    createdBy: {
      type: String,
      enum: ['signup', 'google', 'guest'],
      default: 'signup'
    },

    createdThrough: {
      type: String,
      enum: ['iOS', 'Android', 'web'],
      default: 'web'
    },

    modelName: String,

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,

    active: {
      type: Boolean,
      default: true,
      select: false
    },

    silencedTill: Date,

    // complete at profile
    photo: {
      type: String,
      default:
        'https://s3.us-west-1.amazonaws.com/priders.net-images-bucket/bfc086cd-a2c4-41af-90b5-ec4b548af0c8.jpeg'
    },
    profileImage: {
      type: String,
      default:
        'https://s3.us-west-1.amazonaws.com/priders.net-images-bucket/bfc086cd-a2c4-41af-90b5-ec4b548af0c8.jpeg'
    },
    location: String,
    gender: String,
    sexuality: String,
    bio: String,
    twitter: String,

    reports: [{ reporterId: String, reportedFor: String }],

    postsExposedTo: {
      type: String,
      enum: ['public', 'friendsOnly', 'friendsAndFollowersOnly', 'private'],
      default: 'public'
    },
    storiesExposedTo: {
      type: String,
      enum: ['public', 'friendsOnly', 'friendsAndFollowersOnly', 'private'],
      default: 'public'
    },
    secretsExposedTo: {
      type: String,
      enum: ['public', 'friendsOnly', 'friendsAndFollowersOnly', 'private'],
      default: 'private'
    },

    whoCanMessageMe: {
      type: String,
      enum: ['anyone', 'friendsOnly', 'none'],
      default: 'anyone'
    },

    followers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ],
    following: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ],

    allowFollowing: {
      type: Boolean,
      default: true
    },

    allowFriending: {
      type: Boolean,
      default: true
    },

    chatRooms: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'ChatRoom'
      }
    ],

    // Posts bookmarked, liked, hidden
    bookmarkedPosts: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Post'
      }
    ],

    likedPosts: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Post'
      }
    ],

    hiddenPosts: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Post'
      }
    ],

    // Stories bookmarked, liked, hidden
    bookmarkedStories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Story'
      }
    ],

    likedStories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Story'
      }
    ],

    hiddenStories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Story'
      }
    ],

    bookmarkedPostComments: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'PostComment'
      }
    ],

    likedPostComments: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'PostComment'
      }
    ],

    bookmarkedStoryComments: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'StoryComment'
      }
    ],

    likedStoryComments: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'StoryComment'
      }
    ],

    // Secrets hidden

    hiddenSecrets: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Secret'
      }
    ],

    // other users related
    blockedUsers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ],

    friendList: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ],

    myVotes: { type: [String], default: [] },

    imagesUploadedInHalfDay: {
      type: Number,
      default: 0
    },

    incomingFriendRequests: [
      {
        userId: String,
        username: String,
        profileName: String,
        photo: String,
        role: String,
        message: {
          type: String,
          default: 'Nice to meet you.'
        }
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

userSchema.index({ username: 1 });

// virtual populate, parent referencing
userSchema.virtual('myPosts', {
  ref: 'Post',
  foreignField: 'poster',
  localField: '_id'
});

userSchema.virtual('myPostComments', {
  ref: 'PostComment',
  foreignField: 'commenter',
  localField: '_id'
});

userSchema.virtual('myPostReplies', {
  ref: 'PostReply',
  foreignField: 'replier',
  localField: '_id'
});

userSchema.virtual('myStories', {
  ref: 'Story',
  foreignField: 'storyTeller',
  localField: '_id'
});

userSchema.virtual('myStoryComments', {
  ref: 'StoryComment',
  foreignField: 'commenter',
  localField: '_id'
});

userSchema.virtual('myStoryReplies', {
  ref: 'StoryReply',
  foreignField: 'replier',
  localField: '_id'
});

userSchema.virtual('mySecrets', {
  ref: 'Secret',
  foreignField: 'secretTeller',
  localField: '_id'
});

userSchema.virtual('mySecretComments', {
  ref: 'SecretComment',
  foreignField: 'commenter',
  localField: '_id'
});

// userSchema.virtual('myReplies', {
//   ref: 'PostReply',
//   foreignField: 'replier',
//   localField: '_id'
// });

// userSchema.pre(/^find/, function(next) {
//   this.populate({
//     path: 'myPosts',
//     select: '-reports'
//   })
//     .populate({
//       path: 'myComments',
//       select: ' -images -reports'
//     })
//     .populate({
//       path: 'myReplies',
//       select: '-reports'
//     })
//     .populate({
//       path: 'friendList',
//       select: 'photo role username '
//     })
//     .populate({
//       path: 'blockedUsers',
//       select: 'photo username '
//     })
//     .populate({
//       path: 'chatRooms'
//     })
//     .populate({
//       path: 'bookmarkedPosts',
//       select: 'content title poster likes viewCount'
//     })
//     .populate({
//       path: 'likedPosts',
//       select: 'content title poster likes viewCount'
//     })
//     .populate({
//       path: 'bookmarkedStories',
//       select: 'content title poster likes viewCount'
//     })
//     .populate({
//       path: 'likedStories',
//       select: 'content title poster likes viewCount'
//     });
//   next();
//   // this.populate('myPosts', '-reports');
//   // this.populate('myComments', ' -images -reports');
//   // this.populate('myReplies', '-reports');
//   // this.populate('friendList', 'photo role username ');
//   // this.populate('blockedUsers', 'photo username ');
//   // this.populate('chatRooms');
//   // this.populate('bookmarkedPosts', 'content title poster likes viewCount');
//   // this.populate('likedPosts', 'content title poster likes viewCount');
//   // this.populate('bookmarkedStories', 'content title  likes viewCount');
//   // this.populate('likedStories', 'content title  likes viewCount');
// });

userSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;

  next();
});

// userSchema.pre(/^find/, function(next) {
//   // this points to the current query
//   this.find({ active: { $ne: false } });
//   next();
// });

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // console.log({ resetToken }, this.passwordResetToken);
  // const d = new Date();
  // const t = -d.getTimezoneOffset() + 10;

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
