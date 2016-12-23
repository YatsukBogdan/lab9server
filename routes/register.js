var express = require('express');
var router = express.Router();
var md5 = require('js-md5');
var fs = require('fs');
var path = require('path');
var user = require('../databaseutils').user;

const LOG_PREFIX = 'REGISTER ROUTE';
function getCurrentTime() {
    return new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
}
function logMessage(msg) {
  console.log(getCurrentTime() + '     ' + LOG_PREFIX + '     ' + msg);
}

router.post('/', (req, res) => {
  const req_username = req.body.username;
  const req_password = req.body.password;

  if (!req_username){
    logMessage('Username missing in request body');
    res.json({status: false});
    return;
  }

  if (!req_password){
    logMessage('Password missing in request body');
    res.json({status: false});
    return;
  }

  user.findOne({
    username: req_username
  }, (err, _user) => {
    if (err){
      logMessage(err);
      res.json(err);
      return;
    }
    if (_user) {
      logMessage('User is already exist');
      res.json({
        status: false
      });
    } else {
      var new_user = new user({
        username: req_username,
        passwordHash: md5(req_password),
        restriction: 'user'
      });

      new_user.save(function(err, resp){
        logMessage(`New user registered: ${req_username}`);
        res.json({
          status: true
        });
      });
    }
  });
});

module.exports = router;
