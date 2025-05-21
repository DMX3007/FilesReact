const fileHanlder = require('./fileHandler.js');

module.exports = (FileApiLog) => {
  return {
    parameters: [
      {
        name: 'fileId',
        in: 'path',
        required: true,
        type: 'string',
        description: 'ID of the file to retrieve',
      },
      {
        name: 'fileName',
        in: 'path',
        type: 'string',
        required: true,
        description: 'Name of the file, used to specify the file extension',
      },
    ],
    get: fileHanlder(FileApiLog).get,
  };
};
