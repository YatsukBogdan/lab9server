var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: String,
  passwordHash: String,
  restriction: String
});

var UserConnectionSchema = new Schema ({
  username: String,
  token: String,
  restriction: String
});

var SongSchema = new Schema({
  id: Number,
  url: String,
  img: String,
  album: String,
  name: String,
  artist: String,
  year: String
});

var SongsCountSchema = new Schema({
  name: String,
  count: Number
});

var connection = mongoose.createConnection('mongodb://admin:1111@ds023438.mlab.com:23438/songs');

var song = connection.model('songs', SongSchema);
var songsCount = connection.model('songsCount', SongsCountSchema);
var user = connection.model('user', UserSchema);
var userConnection = connection.model('userConnection', UserConnectionSchema);

module.exports = {
  song: song,
  songsCount: songsCount,
  user: user,
  userConnection: userConnection
};
