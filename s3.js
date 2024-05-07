// const aws = require('aws-sdk');
const dotenv = require('dotenv');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const S3 = require('aws-sdk/clients/s3');

dotenv.config({ path: './config.env' });

const region = process.env.AWS_BUCKET_REGION;
const bucketName = process.env.AWS_BUCKET_NAME;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: 'v4'

  // signatureVersion: 'v4'
});

const generateUploadURL = async () => {
  const imageName = `${uuidv4()}.jpg`;

  const params = {
    Bucket: bucketName,
    Key: imageName,
    Expires: 60
  };

  const uploadURL = await s3.getSignedUrlPromise('putObject', params);
  return uploadURL;
};

const uploadFile = file => {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: `${file.filename}.jpeg`,
    ContentType: 'image/jpeg'
  };

  return s3.upload(uploadParams).promise();
};

const uploadThroughMemory = (path, filename) => {
  const fileStream = fs.createReadStream(path);

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: filename,
    ContentType: 'image/jpeg'
  };

  return s3.upload(uploadParams).promise();
};

// const getFileStream = fileKey => {
//   const downloadParams = {
//     Key: fileKey,
//     Bucket: bucketName
//   };

//   return s3.getObject(downloadParams).createReadStream();
// };

// const uploadURL = await s3.getSignedUrlPromise('putObject', params);
// return uploadURL;
// const params = {
//   Bucket: bucketName,
//   Key: imageName,
//   Expires: 300
//   // Conditions: [['content-length-range', 0, 10485760]]
// };

// const uploadURL = await s3.getSignedUrlPromise('putObject', params);
// return uploadURL;
// };

module.exports = { s3, uploadFile, uploadThroughMemory, generateUploadURL };

// const AWS = require('aws-sdk');
// const dotenv = require('dotenv');
// const { v4: uuidv4 } = require('uuid');

// dotenv.config({ path: './config.env' });

// const region = process.env.AWS_BUCKET_REGION;
// const bucketName = process.env.AWS_BUCKET_NAME;
// const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
// const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

// const s3 = new AWS.S3({
//   region,
//   accessKeyId,
//   secretAccessKey,
//   signatureVersion: 'v4'
// });

// exports.generateUploadURL = async () => {
//   const imageName = uuidv4();

//   const params = {
//     Bucket: bucketName,
//     Key: imageName,
//     Expires: 60
//   };

//   const uploadURL = await s3.getSignedUrlPromise('putObject', params);
//   return uploadURL;
// };
