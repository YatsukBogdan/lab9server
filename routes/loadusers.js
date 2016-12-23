var express = require('express');
var router = express.Router();
var user = require('../databaseutils').user;


const LOG_PREFIX = 'LOAD_USERS ROUTE';
function getCurrentTime() {
    return new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
}
function logMessage(msg) {
  console.log(getCurrentTime() + '     ' + LOG_PREFIX + '     ' + msg);
}

router.post('/', (req, res) => {
  const sess_username = req.session.username;

  if (!sess_username){
    logMessage('Session not initialized');
    res.json({status: 'failed'});
    return;
  }

  user.findOne({
    username: sess_username
  }, function(err, user_) {
    if (user_) {
      if (user_.restriction == 'admin') {
        user.find({}, (err, users) => {
          logMessage(users);
          res.json({users: users});
        });
      } else {
        res.json({status: 'failed'});
      }
    }
  });
});

module.exports = router;
