const express = require('express');
const router = express.Router();
const fabric = require('fabric');
const filters = require('../common/filters');
const db = require('../db/config');
const path = require('path');
const fs = require('fs');
const md5 = require('object-hash').MD5;
const createError = require('http-errors');
const _ = require('lodash');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.redirect('/preset/setup');
});

router.get('/preset/setup', (req, res, next) => {
  res.render('preset/index');
});

router.post('/preset/setup/changepicture', (req, res, next) => {
  const file = req.files.custompicture;
  const extension = path.extname(file.name);
  const picpath = '/images/custompictures/' + file.md5 + extension
  file.mv(__basedir + '/public' + picpath);
  res.render('preset/index', { picture: picpath });
});


router.post('/preset/save', (req, res, next) => {
  const data = req.body;
  db.savedfilters((db, savedfilters) => {
    savedfilters.insertOne(req.body, (err, dbres) => {
      if (err) throw err;
      console.log('insterted', data);
      db.close();
      res.redirect('/preset/saved/' + data._id);
    });
  });
}); 

router.get('/preset/saved/:id', (req, res, next) => {
  const id = db.toId(req.params.id);
  db.savedfilters((db, savedfilters) => {
    savedfilters.findOne(id, (err, dbres) => {
      res.render('preset/show', { savedfilter: dbres });
    });
  });
});

router.post('/preset/process/:id', (req, res, next) => {
  const id = db.toId(req.params.id);
  const files = req.files.uploads;
  console.log(req.files);
  db.savedfilters((db, savedfilters) => {
    savedfilters.findOne(id, (err, filtersobj) => {
      filtersobj = _.pickBy(filtersobj, (v,k) => ['_id', 'picture'].indexOf(k) === -1)
      _(files).each((file) => {
        const extension = path.extname(file.name);
        const inputdir = `${__basedir}/public/input/${req.params.id}`;
        const inputpath = `${inputdir}/${file.md5}${extension}`;
        const outdir = `${__basedir}/public/output/${req.params.id}`;
        const outputpath = `${outdir}/${file.md5}${extension}`;
        if (!fs.existsSync(inputdir)){
              fs.mkdirSync(inputdir);
        }
        if (!fs.existsSync(outdir)){
              fs.mkdirSync(outdir);
        }
        file.mv(inputpath);
        _(filtersobj).entries().each(([filter, value]) => {
          filters.applyFilter(filter, inputpath, outputpath);
        });
      });
      res.redirect(`/preset/download/preview/${req.params.id}`);
    });
  });
});

router.get('/preset/download/preview/:id', (req, res, next) => {
  fs.readdir(`${__basedir}/public/output/${req.params.id}`, (err, files) => {
    files = files.map(f => `/output/${req.params.id}/${f}`);
    console.log(files);
    res.render('preset/download', { files });
  });
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
