'use strict';

var express  = require('express'),
  http = require('http'),
  bodyParser = require ('body-parser'),
  morgan     = require ('morgan'),
  faye       = require('faye');

var PollCurrentSong = require('./current_song.js');
/**/
var app = express();

/* default configurations */
app.use(morgan());
app.use(bodyParser());
app.use(express.static(__dirname + '/public'));
app.engine('html', require('ejs').renderFile);

var bayeux = new faye.NodeAdapter({
  mount:    '/faye',
  timeout:  45
});

var server = http.createServer(app);
bayeux.attach(server);

/* routes */
app.get('/', function(req, res) {
  res.render('index.html');
});

var _pollCurrentSong =  new PollCurrentSong();
_pollCurrentSong.addEventListener(function(data) {
  bayeux.getClient().publish('/channel', data);
});

var port = process.env.port || 3000;
server.listen(port);
console.log('Server up and listening on port ' + port);
