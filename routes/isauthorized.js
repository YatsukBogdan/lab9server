var express = require('express');
var router = express.Router();
var userConnection = require('../databaseutils').userConnection;

const LOG_PREFIX = 'IS_AUTHORIZED ROUTE';
function getCurrentTime() {
    return new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
}
function logMessage(msg) {
  console.log(getCurrentTime() + '     ' + LOG_PREFIX + '     ' + msg);
}

router.post('/', (req, res) => {
  const sess_username = req.session.username;
  const sess_token = req.session.token;

  logMessage(`Requested ${sess_username}`);
  if (!sess_token){
    logMessage(`User ${sess_username} has no token.`);
    res.json({
      isAuthorized: false,
      currentUser: sess_username,
      restriction: 'guest'
    });
    return;
  }

  if (sess_username) {
    userConnection.findOne({
      username: sess_username
    }, (err, connection) => {
      if (err){
        logMessage(`Error on database call.`);
        res.json({
          isAuthorized: false,
          currentUser: sess_username,
          restriction: 'guest'
        });
        return;
      }
      if (connection) {
        if (sess_token == connection.token){
          logMessage(`User ${sess_username} is authorized.`);
          res.json({
            isAuthorized: true,
            currentUser: sess_username,
            restriction: connection.restriction
          });
        } else {
          logMessage(`User's ${sess_username} token didn't match the one on the server side.`);
          res.json({
            isAuthorized: false,
            currentUser: sess_username,
            restriction: connection.restriction
          });
        }
      } else {
        logMessage(`User ${sess_username} has no connection.`);
        res.json({
          isAuthorized: false,
          currentUser: sess_username,
          restriction: 'guest'
        });
      }
    });
  } else {
    logMessage('Session is not initialized');
    res.json({error: 'session is not initialized'});
  }
});

module.exports = router;
