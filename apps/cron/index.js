const cron = require('node-cron');
const config = require('config');
const {clearFilesTaskRun} = require('./tasks/clear-files-task');

cron.schedule(config.get('apps.cron.clear-files-task.schedule'), ()=>{
  clearFilesTaskRun().catch(console.log);
});

console.log('start cron');
