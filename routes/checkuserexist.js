var express = require('express');
var router = express.Router();
var user = require('../databaseutils').user;

const LOG_PREFIX = 'CHECK_USER_EXIST ROUTE';
function getCurrentTime() {
    return new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
}
function logMessage(msg) {
  console.log(getCurrentTime() + '     ' + LOG_PREFIX + '     ' + msg);
}

router.post('/', (req, res) => {
  const req_username = req.body.username;
  if (req_username) {
    logMessage(`Username requested: ${req_username}`);

    user.findOne({
      username: req_username
    }, (err, _user) => {
      if (_user) {
        logMessage(`User exist`);
        res.json({userexist: true});
      } else {
        logMessage(`User not found`);
        res.json({userexist: false});
      }
    });
  } else {
    logMessage('Username missing in request body.');
    res.json({error: 'username missing in request body'});
  }
});

module.exports = router;
