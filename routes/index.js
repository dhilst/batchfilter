const express = require('express');
const router = express.Router();
const fabric = require('fabric');
const filters = require('../common/filters');
const utils = require('../common/utils');
const db = require('../db/config');
const path = require('path');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const md5 = require('object-hash').MD5;
const createError = require('http-errors');
const _ = require('lodash');
const rimraf = require('rimraf');
const JSZip = require("jszip");

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
  console.log(file, extension, picpath);
  file.mv(__basedir + '/public' + picpath);
  res.render('preset/index', { picture: picpath });
});


router.post('/preset/save', (req, res, next) => {
  const data = req.body;
  db.savedfilters((db, savedfilters) => {
    savedfilters.insertOne(req.body, (err, dbres) => {
      if (err) throw err;
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
  db.savedfilters((db, savedfilters) => {
    savedfilters.findOne(id, (err, filtersobj) => {
      filtersobj = _.pickBy(filtersobj, (v,k) => ['_id', 'picture'].indexOf(k) === -1)
      const inputdir = `${__basedir}/public/input/${req.params.id}`;
      const outdir = `${__basedir}/public/output/${req.params.id}`;
      rimraf.sync(inputdir);
      rimraf.sync(outdir);
      fs.mkdirSync(inputdir);
      fs.mkdirSync(outdir);
      _(files).each((file) => {
        const extension = path.extname(file.name);
        const inputpath = `${inputdir}/${file.md5}${extension}`;
        const inputsrc = `/input/${req.params.id}/${file.md5}${extension}`;
        const outputpath = `${outdir}/${file.md5}${extension}`;
        file.mv(inputpath);
        filters.applyFilter(filtersobj, inputsrc, outputpath, utils.baseUrl(req));
      });
      res.redirect(`/preset/download/preview/${req.params.id}`);
    });
  });
});

router.get('/preset/download/preview/:id', (req, res, next) => {
  fs.readdir(`${__basedir}/public/output/${req.params.id}`, (err, files) => {
    files = files.map(f => `/output/${req.params.id}/${f}`);
    res.render('preset/download', { files, id: req.params.id });
  });
});


router.post('/preset/download/zip/:id', async (req, res, next) => {
  const zip = new JSZip();
  const img = zip.folder(`${req.params.id}`);

  // read all files
  const files =  await fs.readdirAsync(`${__basedir}/public/output/${req.params.id}`)
    .then(files => {
      return new Promise.all(
        files.map(async file => {
          const fpath = `${__basedir}/public/output/${req.params.id}/${file}`;
          const contents = await fs.readFileAsync(fpath);
          return { file, contents };
        })
      );
    });
  files.forEach(({file, contents}) => {
    img.file(file, contents);
  });
  img 
    .generateNodeStream({type:'nodebuffer',streamFiles:true})
    .pipe(fs.createWriteStream(`${__basedir}/public/zips/${req.params.id}.zip`))
    .on('finish', () => {
      // JSZip generates a readable stream with a "end" event,
      // but is piped here in a writable stream which emits a "finish" event.
      res.redirect(`/zips/${req.params.id}.zip`);
    });
})

router.post('/filter', (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  const data = JSON.parse(req.body.data);
  const url = 'foobar';
  filters.applyFilter(data.filters, data.image, 'public/output/outputimage.png');
	db.connect((err, db) => { });
  res.end(JSON.stringify({url}));
});

module.exports = router;
