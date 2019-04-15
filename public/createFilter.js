if (typeof module !== "undefined" && module.exports) {
    var fabric = require('fabric').fabric;
    var _ = require('lodash');
}

const createFilter = (filter, value) => {
  value = parseFloat(value);
  switch(filter){
    case 'pixelate':
      return new fabric.Image.filters.Pixelate({ blocksize: value });
    case 'gamma-red':
      return new fabric.Image.filters.Gamma({ gamma: [value, 1, 1] });
    case 'gamma-green':
      return new fabric.Image.filters.Gamma({ gamma: [1, value, 1] });
    case 'gamma-blue':
      return new fabric.Image.filters.Gamma({ gamma: [1, 1, value] });
    case 'blur':
    case 'noise':
    case 'pixelate':
    case 'saturation':
    case 'contrast':
    case 'brightness':
      return new fabric.Image.filters[_.capitalize(filter)]({ [filter]: value })
    default:
      throw Error(`unknown filter ${filter}`);
  }
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = createFilter;
}
