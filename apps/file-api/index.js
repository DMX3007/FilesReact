const config = require('config');
const {createApp} = require('./app');

const {FileApiLog, File} = require('../../models');

const app = createApp({
  FileApiLog,
  File,
});

app.listen(config['apps']['file-api'].port, () => {
  console.log('app started with config:', config['apps']['file-api']);
});
