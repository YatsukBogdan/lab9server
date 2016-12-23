var express = require('express');
var router = express.Router();
var userConnection = require('../databaseutils').userConnection;

const LOG_PREFIX = 'LOGOUT ROUTE';
function getCurrentTime() {
    return new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
}
function logMessage(msg) {
  console.log(getCurrentTime() + '     ' + LOG_PREFIX + '     ' + msg);
}

router.post('/', (req, res) => {
  const sess_username = req.session.username;
  if (sess_username) {
    userConnection.findOne({
      username: sess_username
    }, function(err, connection) {
      if (err) {
        logMessage('Database error: ' + err);
        res.json({error: 'database error'});
        return;
      }
      if (connection) {
        logMessage('Connection removed');
        connection.remove();
        req.session.destroy();
        res.json({
          loggedOut: true
        });
      } else {
        logMessage('Connection not exist');
        res.json({
          loggedOut: false
        });
      }
    });
  } else {
    logMessage('Session is not initialized');
    res.json({error: 'session is not initialized'});
  }
});

module.exports = router;
