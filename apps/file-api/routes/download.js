const moment = require('moment');
const fs = require('fs/promises');
const path = require('path');
const config = require('config');
const axios = require('axios');
const {performance} = require('node:perf_hooks');
const RESULT = require('../../../helpers/constants.js');

const {getId} = require('../getId.js');

const authHeader = config['apps']['file-api'].authHeader || 'X-API-Key';

let requestCounter = 0;
let requestFailCounter = 0;

module.exports = (FileApiLog) => {
  async function post(req, res) {
    console.log('post /download');
    const startTime = performance.now();
    requestCounter++;
    const log = (...args) => {
      console.log(`[download:${requestCounter}]`, ...args);
    };
    const downloadUrl = req.body.url;
    const fileId = getId();

    try {
      const key = req.get(authHeader);
      log('>>> request', {key, fileId, downloadUrl});
      const resData = {
        fileId,
        url: `${config['apps']['file-api'].baseUrl}/file/${fileId}`,
        status: 'DOWNLOAD',
      };
      log('<<< response:', resData);
      res.json(resData);

      const response = await axios.get(downloadUrl, {responseType: 'arraybuffer'});
      const date = new Date();
      const metadata = {
        fileId,
        downloadUrl,
        mimetype: response.headers['content-type'],
        size: response.headers['content-length'],
        dateCreated: (+date/1000).toFixed(0),
        key,
      };
      log({metadata});

      const subDirId = fileId.substring(0, 4);
      const subDirPath = path.join(config['apps']['file-api'].uploadDir, subDirId);
      await fs.mkdir(subDirPath, {recursive: true});

      const uploadPathFile = path.join(subDirPath, fileId);
      const uploadPathMetadata = path.join(subDirPath, fileId + '.json');

      await fs.writeFile(uploadPathFile, response.data, {encoding: 'binary'});
      await fs.writeFile(uploadPathMetadata, JSON.stringify(metadata, null, 2));

      await FileApiLog.create({
        date: moment().format('YYYY-MM-DD HH:mm:ss'),
        fileId: metadata.fileId,
        endpoint: req.originalUrl,
        result: RESULT.OK,
        subresult: '',
      });
      log('file download success', fileId);
    } catch (err) {
      requestFailCounter++;
      await FileApiLog.create({
        date: moment().format('YYYY-MM-DD HH:mm:ss'),
        fileId,
        endpoint: req.originalUrl,
        result: RESULT.FAIL,
        subresult: err,
      });
      log('download, failCounter:', requestFailCounter);
      log('download, catch err', err);
    }
    const duration = Number((performance.now() - startTime)/1000).toFixed(2);
    log('performance:', duration);
  }
  post.apiDoc = {
    summary: 'Download a file',
    description: 'Send url get a response',
    operationId: 'fileDownload',
    tags: ['files'],
    parameters: [],
    responses: {
      200: {
        description: 'Success',
        schema: {
          $ref: '#/definitions/File_download',
        },
      },
      400: {
        description: 'Bad request',
      },
      500: {
        description: 'Internal server error',
      },
    },
  };
  return {
    parameters: [
      {
        in: 'body',
        name: 'body',
        schema: {
          '$ref': '#/definitions/File_download',
        },
      },
    ],
    post,
  };
};
