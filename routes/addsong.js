var express = require('express');
var router = express.Router();
var song = require('../databaseutils').song;
var songsCount = require('../databaseutils').songsCount;

const LOG_PREFIX = 'ADD_SONG ROUTE';
function getCurrentTime() {
    return new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
}
function logMessage(msg) {
  console.log(getCurrentTime() + '     ' + LOG_PREFIX + '     ' + msg);
}

router.post('/', (req, res) => {
  var songs = new songsCount({
    name: 'counter',
    count: 0
  });
  songs.save((err) => {});
  songsCount.findOne({
    name: 'counter'
  }, (err, songs_count) => {
    console.log(songs_count)
    if (err) {
      res.json({error: err});
      return;
    }
    var songs_count_number = songs_count.count;

    var img = req.body.img;
    if (img == 'local') {
      img = 'http://localhost:9000/images/image' + songs_count_number + '.jpeg';
    }
    var new_song = new song({
      id: songs_count_number,
      url: req.body.url,
      img: img,
      album: req.body.album,
      name: req.body.name,
      artist: req.body.artist,
      year: req.body.year
    });

    new_song.save((err) => {
      if (err) {
        logMessage(err);
        res.json({
          error: err
        });
        return;
      } else {
        res.json({
          res: 'success'
        });
      }
    });

    songs_count.count++;
    songs_count.save((err) => {
      if (err) {
        logMessage(err);
      }
    });
  });
});

module.exports = router;
