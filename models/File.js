const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  date: {type: String},
  fileId: {type: String},
  name: {type: String},
  size: {type: Number},
  encoding: {type: String},
  mimetype: {type: String},
  md5: {type: String},
});

module.exports = {
  FileSchema,
};
