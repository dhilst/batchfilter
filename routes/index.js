const express = require('express');
const router = express.Router();
const fabric = require('fabric');
const filters = require('../common/filters');
const db = require('../db/config');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.redirect('/preset/setup');
});

router.get('/preset/setup', (req, res, next) => {
  res.render('preset/index');
});

router.get('/preset/:slug', (req, res, next) => {
  res.render('preset/show');
});

router.get('/preset/:slug/:result', (req, res, next) => {
  res.render('preset/results');
});

router.post('/filter', (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  const data = JSON.parse(req.body.data);
  const url = 'foobar';
  filters.applyFilter(data.filters, data.image, 'public/output/outputimage.png');
  console.log(data.image);
	db.connect((err, db) => { });
  res.end(JSON.stringify({url}));
});

module.exports = router;
