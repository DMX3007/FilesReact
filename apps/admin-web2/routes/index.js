const express = require('express');
const {journalsRouter} = require('./journals');
const {reportsRouter} = require('./reports');
const router = express.Router();

// router.get('/', (req, res) => {
//   res.render('index', {
//     account: req.account,
//     user: req.user,
//     apps: req.relatedApplications,
//   });
// });

router.use('/journals', journalsRouter);
router.use('/reports', reportsRouter);

module.exports = router;
