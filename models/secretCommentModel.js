// review / rating / createdAt / ref to tour / ref to user
const mongoose = require('mongoose');

const secretCommentSchema = new mongoose.Schema(
  {
    //   secreter related
    commenter: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A comment must belong to a user']
    },

    secret: {
      type: mongoose.Schema.ObjectId,
      ref: 'Secret',
      required: [true, 'A comment must belong to a secret']
    },

    secretTeller: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A secret must belong to a user']
    },

    willNotify: {
      type: Boolean,
      default: true
    },

    // willNotify: {
    //   type: Boolean,
    //   default: true
    // },

    // anonymous: {
    //   type: Boolean,
    //   default: true
    // },

    // content: {
    //   type: String,
    //   required: [true, 'A comment must have its content']
    // },

    route: { type: String, default: 'secretComments' },

    // createdAt: {
    //   type: Date,
    //   default: Date.now
    // },

    // editedAt: {
    //   type: Date
    // },

    replies: [
      {
        replier: {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
          required: [true, 'A reply must belong to a user']
        },

        content: {
          type: String,
          required: [true, 'A reply must have its content']
        },

        createdAt: {
          type: Date,
          default: Date.now
        },

        editedAt: {
          type: Date
        }
      }
    ],

    // Replier related
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

    // for secretTeller
    hiddenBy: String
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// parent referencing, virtual populate

// child referencing

// secretCommentSchema.pre(/^find/, function(next) {
//   this.populate({
//     path: 'commenter',
//     select: 'username photo profileName role'
//   });
//   next();
// });

secretCommentSchema.index({ secret: -1, createdAt: -1 });

const SecretComment = mongoose.model('SecretComment', secretCommentSchema);

module.exports = SecretComment;
