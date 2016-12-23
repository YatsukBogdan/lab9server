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
  var page = parseInt(req.query.page);
  var elements = parseInt(req.query.elements);

  var songs_res = [];
  song.find({}, (err, songs) => {
    if (err) {
      res.json({error: err});
      return;
    }
    if (songs.length > (page - 1) * elements) {
      var first_index = (page - 1) * elements;
      var last_index = page * elements - 1;
      songs.forEach((song, i) => {
        if (i >= first_index && i <= last_index) {
          songs_res.push(song);
        }
      });
      res.json({songs: songs_res});
    } else {
      res.json({
        error: 'there is no songs on this page'
      });
    }
  });
});

module.exports = router;
