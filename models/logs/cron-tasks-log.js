const mongoose = require('mongoose');

const cronTasksLogSchema = new mongoose.Schema({
  date: String,
  task: {
    type: String,
  },
  iterateId: String,
  description: String,
  result: {
    type: String,
    enum: ['OK', 'FAIL'],
  },
  subresult: String,
  executingTime: String,
});

module.exports = {
  cronTasksLogSchema,
};
