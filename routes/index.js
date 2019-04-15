const express = require('express');
const router = express.Router();
const fabric = require('fabric');
const filters = require('../common/filters');
const db = require('../db/config');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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
