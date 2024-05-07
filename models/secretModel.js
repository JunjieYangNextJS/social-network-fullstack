// review / rating / createdAt / ref to tour / ref to user

const mongoose = require('mongoose');

const secretSchema = new mongoose.Schema(
  {
    //   secreter related
    // title: {
    //   type: String,
    //   required: ['A secret must have its title']
    // },

    content: {
      type: String,
      required: ['A secret must have its content']
    },

    secretTeller: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A secret must belong to a user']
    },

    sexuality: {
      type: [String],
      enum: [
        'everyone',
        'gay',
        'lesbian',
        'bisexual',
        'bicurious',
        'pansexual',
        'asexual',
        'queer',
        'questioning',
        'androsexual',
        'gynesexual',
        'demisexual',
        'polyamory',
        'kink'
      ],
      default: ['everyone']
    },

    gender: {
      type: [String],
      enum: [
        'everyone',
        'male',
        'female',
        'mtf',
        'ftm',
        'agender',
        'androgyne',
        'bigender',
        'intersex',
        'two-spirit',
        'queer',
        'questioning'
      ],
      default: ['everyone']
    },

    tempUsername: {
      type: String,
      default: 'Anonymous user'
    },

    createdAt: {
      type: Date,
      default: Date.now
    },

    anonymous: {
      type: Boolean,
      default: true
    },

    willNotify: {
      type: Boolean,
      default: true
    },

    editedAt: Date,

    expiredAt: {
      type: Date,
      // 1 day
      required: [true, 'Please provide a valid expiration date and time.']
    },

    // timeLimit: {
    //   type: Date
    // },

    exposedTo: {
      type: String,
      enum: ['public', 'friendsOnly', 'friendsAndFollowersOnly', 'private'],
      default: 'public'
    },

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
    ]
    // String of reporter IDs
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

secretSchema.index({
  secretTeller: 1,
  createdAt: -1,
  expiredAt: -1
});

// secretSchema.pre('findOneAndUpdate', async function() {
//   const docToUpdate = await this.model.findOne(this.getQuery());
//   console.log(docToUpdate); // The document that `findOneAndUpdate()` will modify
//   if (docToUpdate.viewCount === docToUpdate.viewLimit) {
//     await this.model.findByIdAndUpdate({ id: '' });
//     timeLimit: { $gt: Date.now() }
//   }
// });

// secretSchema.pre(/^find/, function(next) {
//   // this points to the current query
//   this.find({ exposed: { $ne: false } });
//   next();
// });
// secretSchema.pre(/^find/, function(next) {
//   // this points to the current query
//   this.find({ expiredAt: { $gte: this.createdAt } });
//   next();
// });

// child referencing

// secretSchema.pre(/^find/, function(next) {
//   this.populate({
//     path: 'secreter',
//     select: 'username photo'
//   });
//   // .populate({
//   //   path: 'secretComment',
//   //   select: 'content'
//   // });
//   next();
// });

// parent referencing, virtual populate

// secretSchema.virtual('secretComments', {
//   ref: 'SecretComment',
//   foreignField: 'secret',
//   localField: '_id'
// });

// secretSchema.virtual('secretReplies', {
//   ref: 'secretReply',
//   foreignField: 'secretComment',
//   localField: '_id'
// });

// secretSchema.pre('findOneAndUpdate', function(next) {
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

const Secret = mongoose.model('Secret', secretSchema);

module.exports = Secret;
