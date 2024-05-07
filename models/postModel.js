// review / rating / createdAt / ref to tour / ref to user

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    //   poster related
    content: {
      type: String
      // required: ['A post must have its content']
    },
    title: {
      type: String,
      required: ['A post must have a title']
    },
    // images: [String],
    about: {
      type: String,
      enum: ['General', 'L', 'G', 'B', 'T', 'Q', 'I', 'A', '2S', '+More'],
      default: 'General'
    },

    poll: [
      {
        label: String,
        votes: {
          type: Number,
          default: 0
        }
      }
    ],

    pollEndsAt: {
      type: Date
      // required: ['A poll must have an end date']
    },

    poster: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A post must belong to a user']
    },

    draft: {
      type: Boolean,
      default: false
    },

    createdAt: {
      type: Date,
      default: Date.now
    },

    editedAt: {
      type: Date
    },

    exposedTo: {
      type: String,
      enum: ['public', 'friendsOnly', 'friendsAndFollowersOnly', 'private'],
      default: 'public'
    },

    willNotify: {
      type: Boolean,
      default: true
    },

    pinned: String,

    // viewers can do these
    reports: [
      {
        reporterId: {
          type: mongoose.Schema.ObjectId,
          ref: 'User'
        },
        reportedFor: {
          type: String,
          enum: [
            'Hatred',
            'Spam',
            'Misinformation',
            'Harassment',
            'Violence',
            'Impersonation',
            'Doxing',
            'Plagiarism',
            'Other violations'
          ]
        }
      }
    ],

    subscribers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A post must belong to a user']
      }
    ],

    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ],

    likesCount: {
      type: Number,
      default: 0
    },

    commentCount: {
      type: Number,
      default: 0
    },

    lastCommentedAt: {
      type: Date,
      default: Date.now
    },

    banned: {
      type: String
    },

    sticky: {
      type: Boolean,
      default: false
    },

    modFavored: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

postSchema.index({
  exposedTo: -1,
  likesCount: -1,
  banned: 1,
  draft: 1,
  about: 1
});

postSchema.index({
  exposedTo: -1,
  commentCount: -1,
  banned: 1,
  draft: 1,
  about: 1
});

postSchema.index({
  createdAt: -1,
  exposedTo: -1,
  lastCommentedAt: -1,
  banned: 1,
  draft: 1,
  about: 1
});

postSchema.index({
  createdAt: -1,
  exposedTo: -1,
  lastCommentedAt: -1,
  banned: 1,
  draft: 1,
  poster: 1
});

postSchema.index(
  { title: 1 },
  {
    collation: {
      locale: 'en',
      strength: 2
    }
  }
);

// child referencing

postSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'poster',
    select: 'username photo profileName role friendList followers'
  });

  // .populate({
  //   path: 'postComment',
  //   select: 'content'
  // });
  next();
});

// parent referencing, virtual populate

postSchema.virtual('postComments', {
  ref: 'PostComment',
  foreignField: 'post',
  localField: '_id'
});
// postSchema.virtual('postReplies', {
//   ref: 'PostReply',
//   foreignField: 'postComment',
//   localField: '_id'
// });

// postSchema.pre('findOneAndUpdate', function(next) {
//   const updated = this.getUpdate();
//   if (updated.reports) {
//     const { reports } = updated;
//     const newReport = reports[reports.length - 1];
//     console.log(newReport);
//     const oldReports = [...reports];
//     oldReports.pop();
//     // console.log(oldReports);

//     const filteredReports = oldReports.filter(
//       el => el.reporter !== newReport.reporter
//     );
//     console.log(filteredReports);

//   }
//   next();
// });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
