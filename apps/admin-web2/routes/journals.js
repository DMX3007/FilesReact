const express = require('express');
const moment = require('moment');
const {FileApiLog, File} = require('../../../models');
const journalsRouter = express.Router();

function findColumnFilter(columns, columnName) {
  if (!columns) return
  if (!columnName) return
  const column = columns.find((column) => column.data === columnName);
  if (column) {
    return column.search.value;
  }
}

journalsRouter.get('/files', async (req, res) => {
  const query = {};
  console.log('get /files');

  const fileIdFilter = findColumnFilter(req.query.columns, 'fileId');
  if (fileIdFilter) {
    query.fileId = fileIdFilter;
  }
  const mimetypeFilter = findColumnFilter(req.query.columns, 'mimetype');
  if (mimetypeFilter) {
    query.mimetype = mimetypeFilter;
  }
  try {
    const rows = await File.find(query, null, {
      sort: '-date',
      limit: parseInt(req.query.length || 10),
      skip: parseInt(req.query.start || 0),
    });
    const count = await File.countDocuments(query);
    res.json({
      draw: parseInt(req.query.draw),
      recordsTotal: count,
      recordsFiltered: count,
      data: rows,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send('');
  }
});

journalsRouter.get('/api', async (req, res) => {
  const query = {};
  const columns = req.query.columns;
  console.log('get /api');

  const dateFilter = findColumnFilter(columns, 'date');
  if (dateFilter) {
    const [start, end] = dateFilter.split(' - ');

    query.date = {
      $gte: `${start} 00:00:00`,
      $lte: `${end} 23:59:59`,
    };
  } else {
    query.date = {
      $gte: moment().format('YYYY-MM-DD 00:00:00'),
      $lte: moment().format('YYYY-MM-DD 23:59:59'),
    };
  }

  const fileIdFilter = findColumnFilter(columns, 'fileId');
  if (fileIdFilter) {
    query.fileId = fileIdFilter;
  }
  const endpointFilter = findColumnFilter(columns, 'endpoint');
  if (endpointFilter) {
    query.endpoint = endpointFilter;
  }
  const resultFilter = findColumnFilter(columns, 'result');
  if (resultFilter === 'OK') {
    query.result = 'OK';
  } else if (resultFilter === 'FAIL') {
    query.result = 'FAIL';
  }

  try {
    const rows = await FileApiLog.find(query, null, {
      sort: '-date',
      limit: parseInt(req.query.length || 10),
      skip: parseInt(req.query.start || 0),
    });
    const count = await FileApiLog.countDocuments(query);
    res.json({
      draw: parseInt(req.query.draw),
      recordsTotal: count,
      recordsFiltered: count,
      data: rows,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send('');
  }
});


module.exports = {
  journalsRouter,
};
