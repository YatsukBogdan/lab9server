var express = require('express');
var md5 = require('js-md5');
var router = express.Router();
var jwt =  require('jsonwebtoken');
var user = require('../databaseutils').user;
var userConnection = require('../databaseutils').userConnection;

const superSecret = "asd3tg9*(53lj!@$RG.Shsfh).hsa6261y%&%_)&";

const LOG_PREFIX = 'LOGIN ROUTE';
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
    res.json({logined: false});
    return;
  }

  if (!req_password){
    logMessage('Password missing in request body');
    res.json({logined: false});
    return;
  }

  user.findOne({
    username: req_username,
    passwordHash: md5(req_password)
  }, function(err, user) {
    if (user){
      userConnection.findOne({
        username: req_username
      }, (err, connection) =>{
        var token = jwt.sign(user, superSecret, {
          expiresIn: 60*60*24
        });

        req.session.username = req_username;
        req.session.token = token;

        if (connection) {
          connection.token = token;
          connection.save((err) => {
            logMessage('Connection updated');
          });
        } else {
          var new_user_connection = new userConnection({
            username: req_username,
            token: token,
            restriction: user.restriction
          });

          new_user_connection.save((err) => {
            logMessage('New connection created.');
          });
        }
        res.json({
          logined: true
        });
      });
    } else {
      logMessage('Login failed.');
      res.json({
        logined: false
      });
    }
  });
});

module.exports = router;
