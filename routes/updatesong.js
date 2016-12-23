var express = require('express');
var router = express.Router();
var song = require('../databaseutils').song;

const LOG_PREFIX = 'ADD_SONG ROUTE';
function getCurrentTime() {
    return new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
}
function logMessage(msg) {
  console.log(getCurrentTime() + '     ' + LOG_PREFIX + '     ' + msg);
}

router.post('/', (req, res) => {

  song.findOne({
    id: req.body.database_id
  }, (err, _song) => {
    if (err) {
      res.json({error: err});
      return;
    }
    if (_song) {
      _song.url = req.body.url;
      _song.img = req.body.img;
      _song.album = req.body.album;
      _song.name = req.body.name;
      _song.artist = req.body.artist;
      _song.year = req.body.year;

      _song.save((err) => {
        if (err) {
          res.json({
            error: err
          });
          return;
        }
        res.json({
          status: 'success'
        })
      });
    }
  });
});

module.exports = router;
