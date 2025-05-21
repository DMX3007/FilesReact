const fs = require('fs/promises');
const path = require('path');
const config = require('config');
const moment = require('moment');
const RESULT = require('../../../helpers/constants');

let requestCounter = 0;

module.exports = (FileApiLog) => {
  async function get(req, res) {
    requestCounter++;
    const log = (...args) => {
      console.log(`[file:${requestCounter}]`, ...args);
    };
    const baseUrl = '/' + req.originalUrl.split(('/'))[1];
    try {
      let isRequiredMp3 = false;
      const {fileId, filename} = req.params;
      log('>>> get file', JSON.stringify({fileId, filename}));
      const subDirId = fileId.substring(0, 4);
      const subDirPath = path.join(config['apps']['file-api'].uploadDir, subDirId);
      let uploadPathFile = path.join(subDirPath, fileId);
      if (filename && path.extname(filename) === '.mp3') {
        uploadPathFile = uploadPathFile + '.mp3';
        log('required mp3 file', uploadPathFile);
        isRequiredMp3 = true;
      }
      const uploadPathMetadata = path.join(subDirPath, fileId + '.json');
      try {
        await fs.access(uploadPathFile);
      } catch (err) {
        await FileApiLog.create({
          date: moment().format('YYYY-MM-DD HH:mm:ss'),
          fileId,
          endpoint: baseUrl,
          result: RESULT.FAIL,
          subresult: err,
        });
        res.status(404).json({status: 'NOT FOUND'});
        log('not found file', fileId);
        return;
      }
      const metadataFileData = await fs.readFile(uploadPathMetadata);
      const metadata = JSON.parse(metadataFileData);
      log('metadata', metadata);
      await FileApiLog.create({
        date: moment().format('YYYY-MM-DD HH:mm:ss'),
        fileId,
        endpoint: baseUrl,
        result: RESULT.OK,
        subresult: '',
      });
      res.sendFile(uploadPathFile, {
        headers: {
          'Content-Type': isRequiredMp3 ? 'audio/mpeg' : metadata.mimetype,
        },
      });
    } catch (err) {
      log(err);
      await FileApiLog.create({
        date: moment().format('YYYY-MM-DD HH:mm:ss'),
        fileId,
        endpoint: baseUrl,
        result: RESULT.FAIL,
        subresult: err,
      });
      res.status(500).send();
    }
  }
  get.apiDoc = {
    summary: '',
    description: 'Upload a file and get a response',
    operationId: 'FileGet',
    tags: ['files'],
    responses: {
      200: {
        description: 'File found and returned successfully',
        schema: {
          $ref: '#/definitions/File',
        },
      },
      404: {
        description: 'File not found',
        schema: {
          $ref: '#/definitions/Error_Not_Found',
        },
      },
      500: {
        description: 'Internal server error',
      },
    },
  };

  return {
    get,
  };
};
