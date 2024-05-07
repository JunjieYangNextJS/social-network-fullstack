// // review / rating / createdAt / ref to tour / ref to user
// const mongoose = require('mongoose');

// const postCommentSchema = new mongoose.Schema(
//   {
//     //   commenter related
//     content: {
//       type: String,
//       required: ['A comment must have its content.']
//     },
//     images: [String],
//     poster: {
//       type: mongoose.Schema.ObjectId,
//       ref: 'User',
//       required: [true, 'Review must belong to a user']
//     },
//     createdAt: {
//       type: Date,
//       default: Date.now
//     },

//     // reader related

//     // String of reader Like IDs
//     like: [String],
//     commentComments: [
//       {
//         commentCommenter: {
//           type: mongoose.Schema.ObjectId,
//           ref: 'User',
//           required: [true, 'Review must belong to a user']
//         },
//         content: [String, 'A comment must have a content'],
//         createdAt: {
//           type: Date,
//           default: Date.now
//         }
//       }
//     ]
//   },
//   {
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true }
//   }
// );

// const PostComment = mongoose.model('PostComment', postCommentSchema);

// module.exports = PostComment;
