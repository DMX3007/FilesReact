const {File, CronTaskLog} = require('../../../models/index.js');
const {CronTask} = require('../../../helpers/crontask.js');

class ClearFilesTask extends CronTask {
  static name = 'clear-files';
  static description = 'clear files';
  async childRun() {
    const deleted = await File.deleteMany({
      date: {
      // remove files older than 1 month
        $lt: moment().subtract(1, 'month').format('YYYY-MM-DD HH:mm:ss'),
      },
    });
    return `deleted ${deleted.deletedCount} files`;
  }
}

const clearFilesTaskRun = async () => {
  const task = new ClearFilesTask({
    logModel: CronTaskLog,
  });
  await task.run();
};

module.exports = {
  clearFilesTaskRun,
  ClearFilesTask,
};
