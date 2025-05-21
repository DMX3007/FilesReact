const fs = require('fs/promises');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const moment = require('moment');
const RESULT = require('../../../helpers/constants.js');
const config = require('config');

const {getId} = require('../getId');

const prepareMetadata = (uploadedFile) => {
  return {
    name: uploadedFile.name,
    mimetype: uploadedFile.mimetype,
    md5: uploadedFile.md5,
    size: uploadedFile.size,
    dateCreated: (+new Date() / 1000).toFixed(0),
  };
};

const postUploadAction = async (metadata) => {
  if (metadata.mimetype !== 'audio/ogg' && metadata.mimetype !== 'audio/mpeg') {
    return console.log(
        `${metadata.mimetype}: post actions for uploaded mimetype is not defined`,
    );
  }

  if (metadata.mimetype === 'audio/ogg' || metadata.mimetype === 'audio/mpeg') {
    console.log(`${metadata.mimetype}: start post upload action`);
    const fileId = metadata.fileId;

    const subDirId = fileId.substring(0, 4);

    const subDirPath = path.join(config['apps']['file-api'].uploadDir, subDirId);
    await fs.mkdir(subDirPath, {recursive: true});

    const uploadPathFile = path.join(subDirPath, fileId);
    const {stdout, stderr} = await exec(
        `ffmpeg -i ${uploadPathFile} ${uploadPathFile}.mp3`,
    );
    console.log(stdout, stderr);
  }
};

module.exports = (FileApiLog, File) => {
  let requestCounter = 0;
  async function post(req, res) {
    requestCounter++;
    const log = (...args) => {
      console.log(`[upload:${requestCounter}]`, ...args);
    };
    if (!req.files || Object.keys(req.files).length === 0) {
      log('no file');
      await FileApiLog.create({
        date: moment().format('YYYY-MM-DD HH:mm:ss'),
        fileId: undefined,
        endpoint: req.baseUrl,
        result: RESULT.FAIL,
        subresult: 'No files were uploaded',
      });
      return res.status(400).send('No files were uploaded.');
    }

    // const key = req.get(authHeader);
    // log('upload with key', key);
    const key = 'key';

    log('external fileId:', req.query.fileId);

    const fileId = req.query.fileId ? req.query.fileId : getId();
    const uploadedFile = req.files.file;

    const subDirId = fileId.substring(0, 4);

    const subDirPath = path.join(config['apps']['file-api'].uploadDir, subDirId);
    try {
      await fs.mkdir(subDirPath, {recursive: true});

      const uploadPathFile = path.join(subDirPath, fileId);
      const uploadPathMetadata = path.join(subDirPath, fileId + '.json');

      const metadata = {
        ...prepareMetadata(uploadedFile),
        fileId,
        key,
      };
      log('metadata', JSON.stringify(metadata));

      await uploadedFile.mv(uploadPathFile);
      await fs.writeFile(uploadPathMetadata, JSON.stringify(metadata, null, 2));

      const resData = {
        fileId,
        url: `${config['apps']['file-api'].baseUrl}/file/${fileId}`,
        status: RESULT.OK,
      };
      await File.create({
        ...uploadedFile,
        date: moment().format('YYYY-MM-DD HH:mm:ss'),
        fileId: resData.fileId,
      });

      await FileApiLog.create({
        date: moment().format('YYYY-MM-DD HH:mm:ss'),
        fileId: resData.fileId,
        endpoint: req.originalUrl,
        result: RESULT.OK,
        subresult: '',
      });

      log('<<< response', resData);
      res.json(resData);
      await postUploadAction(metadata);
    } catch (err) {
      log(err);
      await FileApiLog.create({
        date: moment().format('YYYY-MM-DD HH:mm:ss'),
        fileId,
        endpoint: req.originalUrl,
        result: RESULT.FAIL,
        subresult: err,
      });
      res.status(500).send(err);
    }
    console.log('post');
  }

  post.apiDoc = {
    summary: 'Upload a file',
    description: 'Upload a file and get a response',
    operationId: 'fileUpload',
    tags: ['files'],
    parameters: [
      {
        name: 'file',
        in: 'formData',
        required: true,
        type: 'file',
        description: 'The file to upload',
      },
      {
        name: 'fileId',
        in: 'query',
        type: 'string',
        description: 'Optional file ID',
      },
    ],
    responses: {
      200: {
        description: 'File uploaded successfully',
        schema: {
          $ref: '#/definitions/File_upload',
        },
      },
      400: {
        description: 'No files were uploaded',
      },
      500: {
        description: 'Internal server error',
      },
    },
  };

  return {
    post,
  };
};
