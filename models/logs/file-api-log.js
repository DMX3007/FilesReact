const mongoose = require('mongoose');

const FileApiLogSchema = new mongoose.Schema({
  date: {type: Date},
  fileId: String,
  endpoint: String,
  result: {
    type: String,
    enum: ['OK', 'FAIL'],
  },
  subresult: String,
});

module.exports = {
  FileApiLogSchema,
};
