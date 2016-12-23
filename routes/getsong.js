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
  var req_id = parseInt(req.query.id);

  song.findOne({
    id: req_id
  }, (err, _song) => {
    if (err) {
      res.json({error: err});
      return;
    }
    if (_song) {
      res.json(_song);
    } else {
      res.json({err: 'there is no such song'});
    }
  });
});

module.exports = router;
