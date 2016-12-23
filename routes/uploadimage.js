var express = require('express');
var router = express.Router();
var path = require('path');
var multer = require('multer');
var mime = require('mime');
var song = require('../databaseutils').song;
var songsCount = require('../databaseutils').songsCount;
const LOG_PREFIX = 'UPLOAD_IMAGE_ROUTE ROUTE';

function getCurrentTime() {
    return new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
}

function logMessage(msg) {
  console.log(getCurrentTime() + '     ' + LOG_PREFIX + '     ' + msg);
}

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/');
  },
  filename: function (req, file, cb) {
    songsCount.findOne({
      name: 'counter'
    }, (err, songs_count) => {
      if (err) {
        res.json({error: err});
        return;
      }
      console.log(songs_count);
      cb(null,  'image' + songs_count.count + '.' + mime.extension(file.mimetype));
    });
  }
});

var upload = multer({ storage: storage });

router.post('/', upload.single('image'), (req, res) => {
  res.json({
    test: 'ok'
  });
});

module.exports = router;
