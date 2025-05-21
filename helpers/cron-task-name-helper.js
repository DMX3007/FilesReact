const {ReloadInstancesTask} = require('../apps/cron/tasks/reload-instances');
const {RemoveOldMessagesTask} = require('../apps/cron/tasks/remove-old-messages');
const {CheckInstanceStatusTask} = require('../apps/cron/tasks/check-instance-status');
const {UpdateOldVersionsTask} = require('../apps/cron/tasks/update-old-versions');
const {CheckCountAccounts} = require('../apps/cron/tasks/check-count-accounts');

function getCronTasksNamesAndDescriptions() {
  const tasks = [ReloadInstancesTask, RemoveOldMessagesTask,
    CheckInstanceStatusTask,
    UpdateOldVersionsTask,
    CheckCountAccounts];
  const table = tasks.map((t) => {
    const obj = {name: t.name, description: t.description};

    return obj;
  });
  return table;
}

module.exports = {
  getCronTasksNamesAndDescriptions,
};
