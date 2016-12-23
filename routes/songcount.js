var express = require('express');
var router = express.Router();
var song = require('../databaseutils').song;

const LOG_PREFIX = 'SONGS ROUTE';
function getCurrentTime() {
    return new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
}
function logMessage(msg) {
  console.log(getCurrentTime() + '     ' + LOG_PREFIX + '     ' + msg);
}

router.get('/', (req, res) => {
  song.find({}, (err, songs) => {
    res.json({count: songs.length});
  });
});

module.exports = router;
