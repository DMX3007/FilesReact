const express = require('express');
const moment = require('moment');
const RESULT = require('../../../helpers/constants.js');
const {FileApiLog} = require('../../../models');

const reportsRouter = express.Router();

reportsRouter.get('/file-api', async (req, res)=>{
  try {
    let date = moment().format('YYYY-MM-DD');
    if (req.query.date) {
      date = req.query.date;
    }
    const dateFilter={
      $gte: `${date} 00:00:00`,
      $lte: `${date} 23:59:59`,
    };
    const endpoints = await FileApiLog.find({
      date: dateFilter,
    }).distinct('endpoint');
    const result = [];
    for (const endpoint of endpoints) {
      result.push({
        endpoint,
        all: await FileApiLog.countDocuments({
          date: dateFilter,
          endpoint,
        }),
        ok: await FileApiLog.countDocuments({
          date: dateFilter,
          endpoint,
          result: RESULT.OK,
        }),
        fail: await FileApiLog.countDocuments({
          date: dateFilter,
          endpoint,
          result: RESULT.FAIL,
        }), 
      });
    }
    res.json({
      endpoints: result,
    });
  } catch (err) {
    console.log(err);
    res.json({
      endpoints: [],
    });
  }
});

module.exports = {
  reportsRouter,
};
