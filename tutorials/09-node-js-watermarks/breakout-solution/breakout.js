/**
 * Created by Tobi on 17.12.2016.
 */

/**
 * adds a suffix to a filename before the file extension.
 *
 * @param suffix will be appended before the dot (if it's not there, yet).
 * @returns {string}
 */
String.prototype.extend = function (suffix) {
  var lastIndex = this.lastIndexOf('.');
  var isAlreadySuffixed = this.indexOf(suffix) !== -1 && this.indexOf(suffix) + suffix.length === lastIndex;
  // this looks like the suffix is already included;
  if (isAlreadySuffixed) {
    return this + '';
  } else if (lastIndex !== -1) {
    var split = this.split('');
    split.splice(lastIndex, 0, suffix);
    return split.join('');
  } else {
    return this + suffix;
  }
};

var path = require('path');
var Jimp = require('jimp');
var glob = require('glob');

var watermarkName = 'watermark.png',
  watermarkPath = path.join(__dirname, watermarkName);
var suffix = '_watermarked';

Jimp.read(watermarkPath, function (err, watermark) {
  if (err) throw err;
  glob('*.{png,jpg}', null, function (err, files) {
    if (err) throw err;
    files.forEach(function (file) {
      console.log(file);

      // don't watermark the watermark ;)
      if (file != watermarkName) {
        Jimp.read(file, function (err, img) {
          var x = 0, y = 0;
          var output = file.extend(suffix);
          img.composite(watermark, x, y)
            .write(path.join(__dirname, 'watermarked', output));
          console.log('wrote ' + output);
        });
      }
    });
  });
});