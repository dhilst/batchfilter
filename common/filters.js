const _ = require('lodash');
const fabric = require('fabric').fabric;
const fs = require('fs');
const createFilter = require( '../public/createFilter');

module.exports = {
  applyFilter: function(filters, imagePath, outputPath, baseUrl) {
    const out = fs.createWriteStream(outputPath);
    const canvas = new fabric.StaticCanvas(null, { width: 200, height: 200 });

    console.log('filters', filters);
    fabric.Image.fromURL(baseUrl + imagePath, function(oImg) {
      _(filters).entries().each(([filter, value]) => {
        console.log(filter, value);
        const filterObj = createFilter(filter, value);
        oImg.filters.push(filterObj);
      });
      oImg.applyFilters();
      canvas.setWidth(oImg.width);
      canvas.setHeight(oImg.height);
      canvas.add(oImg);
      canvas.renderAll();
      const stream = canvas.createPNGStream();
      stream.on('data', function(chunk) {
        out.write(chunk);
      });
    });
  },
};
