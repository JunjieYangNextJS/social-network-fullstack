const express = require('express');
const snoowrap = require('snoowrap');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

const router = express.Router();

const r = new snoowrap({
  userAgent: 'Adventurous-Table170',
  clientId: '_3Pt0bmLxcJ6kvLxNuZvbw',
  clientSecret: '0igEJZvbnrkTkW957gpKx4u6Tlmwmg',
  refreshToken: '1147786167587-VVDGlW3PLBF028TunIePJLpD0O3k1A'
});

const tryMe = async () => {
  await r.getHot();
};

console.log(tryMe());

const getHot = catchAsync(async (req, res, next) => {
  const docs = await r.getHot();
  console.log(docs);

  // const doc = await features.query;

  // const totalDocsInDB = await News.countDocuments();

  // SEND RESPONSE
  res.status(200).json({
    status: 'success'
  });
});

router.get('/redditHot', getHot);

module.exports = router;
