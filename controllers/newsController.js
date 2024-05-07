const fs = require('fs');
const util = require('util');
const multer = require('multer');
const sharp = require('sharp');
const { v4: uuid } = require('uuid');
// const sanitizeHtml = require('sanitize-html');
const Filter = require('bad-words');
const News = require('./../models/newsModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');
const { uploadThroughMemory } = require('./../s3');
const Notification = require('../models/notificationModel');

const filter = new Filter();

// exports.getAllNews = factory.getAll(News);

exports.getAllNews = catchAsync(async (req, res, next) => {
  // To allow for nested GET reviews on tour (hack)
  // let filter = {};
  // if (req.params.tourId) filter = { tour: req.params.tourId };
  if (req.query.about === 'general') delete req.query.about;

  const features = new APIFeatures(News.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const docs = await features.query;

  // const doc = await features.query;

  let totalDocsInDB;

  if (req.query.about) {
    totalDocsInDB = await News.countDocuments({
      createdAt: {
        $gte: req.query.createdAt.gte,
        $lte: req.query.createdAt.lte
      },
      about: req.query.about
    });
  } else {
    totalDocsInDB = await News.countDocuments({
      createdAt: {
        $gte: req.query.createdAt.gte,
        $lte: req.query.createdAt.lte
      }
    });
  }

  // const totalDocsInDB = await News.countDocuments();

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

exports.deleteNotifications = catchAsync(async (req, res, next) => {
  await Notification.deleteMany({});

  // SEND RESPONSE
  res.status(200).json({
    status: 'success'
  });
});

exports.getWhatIsNew = catchAsync(async (req, res, next) => {
  // To allow for nested GET reviews on tour (hack)
  // let filter = {};
  // if (req.params.tourId) filter = { tour: req.params.tourId };

  const features = new APIFeatures(News.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const docs = await features.query;

  // const doc = await features.query;

  // const totalDocsInDB = await News.countDocuments();

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    data: {
      data: docs
    }
  });
});

exports.getAllNewsFromSearchQuery = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    News.find({
      title: { $regex: `.*${req.params.searchQuery}.*`, $options: 'i' }
    }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const docs = await features.query;

  // const doc = await features.query;

  let totalDocsInDB;

  if (req.query.about) {
    totalDocsInDB = await News.countDocuments({
      createdAt: {
        $gte: req.query.createdAt.gte,
        $lte: req.query.createdAt.lte
      },
      about: req.query.about,
      title: { $regex: `.*${req.params.searchQuery}.*`, $options: 'i' }
    });
  } else {
    totalDocsInDB = await News.countDocuments({
      createdAt: {
        $gte: req.query.createdAt.gte,
        $lte: req.query.createdAt.lte
      },
      title: { $regex: `.*${req.params.searchQuery}.*`, $options: 'i' }
    });
  }

  // const totalDocsInDB = await News.countDocuments({
  //   createdAt: { $gte: req.query.createdAt.gte, $lte: req.query.createdAt.lte },
  //   title: { $regex: `.*${req.params.searchQuery}.*`, $options: 'i' }
  // });

  // const totalDocsInDB = await News.countDocuments();

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

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images', 400), false);
  }
};

const unlinkFile = util.promisify(fs.unlink);

const uploadCreationImage = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 10485760 }
});

exports.imageUploadMiddleware = uploadCreationImage.single('image');

exports.createNews = catchAsync(async (req, res, next) => {
  // const clean = sanitizeHtml(req.body.content, {
  //   allowedTags: [
  //     'p',
  //     'b',
  //     'i',
  //     'em',
  //     'strong',
  //     'a',
  //     'u',
  //     'h1',
  //     'h2',
  //     'h3',
  //     'h4',
  //     's',
  //     'blockquote',
  //     'br',
  //     'pre',
  //     'iframe',
  //     'sub',
  //     'sup',
  //     'ul',
  //     'ol'
  //   ],
  //   allowedAttributes: {
  //     a: ['href', 'target', 'name'],
  //     img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading'],
  //     iframe: [
  //       'class',
  //       'allowfullscreen',
  //       'frameborder',
  //       'src',
  //       'name',
  //       'multiple'
  //     ],
  //     p: ['class'],
  //     pre: ['spellcheck', 'class']
  //   },
  //   selfClosing: ['img'],
  //   allowedIframeHostnames: [
  //     'www.youtube.com',
  //     'www.vimeo.com',
  //     'www.bilibili.com'
  //   ],
  //   allowedSchemes: ['http', 'https']
  // });

  let doc;

  req.file.filename = `${uuid()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(140, 140, { withoutEnlargement: true, fit: 'inside' })
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`uploads/${req.file.filename}`);

  // req.headers['content-type'] = 'image/jpeg';

  const result = await uploadThroughMemory(
    `uploads/${req.file.filename}`,
    req.file.filename
  );

  await unlinkFile(`uploads/${req.file.filename}`);

  try {
    doc = await News.create({
      authorName: req.body.authorName.trim(),
      link: req.body.link.trim(),
      title: filter.clean(req.body.title).trim(),
      // content: filter.clean(clean),
      about: req.body.about,
      uploaderId: req.user.id,
      image: result.Location
    });
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
exports.updateNews = factory.updateOne(News);
exports.deleteNews = factory.deleteOne(News, 'NewsTeller');
exports.updateNewsViewCount = factory.updateViewCount(News);
