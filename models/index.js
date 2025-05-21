const mongoose = require('mongoose');
const config = require('config');
mongoose.Promise = Promise;

const logsDbConnection = mongoose.createConnection(config.get('logsMongodb'));
const settingsDbConnection = mongoose.createConnection(config.get('settingsMongodb'));

const {FileApiLogSchema} = require('./logs/file-api-log.js');
const {cronTasksLogSchema} = require('./logs/cron-tasks-log.js');
const {FileSchema} = require('./File.js');

const FileApiLog = logsDbConnection.model('fileApiLog', FileApiLogSchema);
const CronTaskLog = logsDbConnection.model('cronTasksLog', cronTasksLogSchema);
const File = settingsDbConnection.model('file', FileSchema);

module.exports = {
  FileApiLog,
  CronTaskLog,
  File,
};
