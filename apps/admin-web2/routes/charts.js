const express = require('express');
const moment = require('moment');
const {FileApiLog} = require('../../../models');
const chartsRouter = express.Router();
const RESULT = require('../../../helpers/constants');

chartsRouter.get('/files-api', async (req, res) => {
  try {
    console.log('get Charts /files');
    const end = moment();
    const start = moment().subtract(30, 'days');
    const labels = [];
    const ok = [];
    const fail = [];

    for (; start <= end; start.add(1, 'days')) {
      const datetimeStart = start.format('YYYY-MM-DD 00:00:00');
      const datetimeEnd = start.format('YYYY-MM-DD 23:59:59');
      labels.push(start.format('DD.MM'));

      ok.push(await FileApiLog.countDocuments({
        date: {
          $gte: datetimeStart,
          $lte: datetimeEnd,
        },
        result: RESULT.OK,
      }));

      fail.push(await FileApiLog.countDocuments({
        date: {
          $gte: datetimeStart,
          $lte: datetimeEnd,
        },
        result: RESULT.FAIL,
      }));
    }

    res.json({
      data: {
        labels,
        ok,
        fail,
      },
    });
  } catch (err) {
    console.log('err', err);
    res.json({
      data: {
        labels: [],
        ok: [],
        fail: [],
      },
    });
  }
});

module.exports = {
  chartsRouter,
};
