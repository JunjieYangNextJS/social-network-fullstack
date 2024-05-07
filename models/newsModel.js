// review / rating / createdAt / ref to tour / ref to user

const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema(
  {
    //   poster related
    uploaderId: String,

    authorName: String,

    link: String,

    image: String,

    title: {
      type: String,
      required: ['A news must have a title']
    },

    // content: {
    //   type: String,
    //   required: ['A news must have a content']
    // },

    about: {
      type: String,
      enum: ['General', 'L', 'G', 'B', 'T', 'Q', 'I', 'A', '2S', '+More'],
      default: 'General'
    },

    // newsType: {
    //   type: String
    // },

    createdAt: {
      type: Date,
      default: Date.now
    }

    // editedAt: {
    //   type: Date
    // }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// postSchema.index({ viewCount: -1 });

// postSchema.index({ likes: -1 });

// postSchema.index({ poster: 1 });
newsSchema.index({ createdAt: -1 });
// postSchema.index({ title: 1 });

newsSchema.index(
  { title: 1 },
  {
    collation: {
      locale: 'en',
      strength: 2
    }
  }
);

// child referencing

// postSchema.pre(/^find/, function(next) {
//   this.populate({
//     path: 'poster',
//     select: 'username photo profileName friendList followers'
//   });

//   // .populate({
//   //   path: 'postComment',
//   //   select: 'content'
//   // });
//   next();
// });

// parent referencing, virtual populate

const News = mongoose.model('News', newsSchema);

module.exports = News;
