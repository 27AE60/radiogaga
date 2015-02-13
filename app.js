'use strict';

var express  = require('express'),
  http = require('http'),
  bodyParser = require ('body-parser'),
  morgan     = require ('morgan'),
  faye       = require('faye');

var PollCurrentSong = require('./utilities/current_song.js');
var cfg = require('./radiogaga.json');

/**/
var app = express();

/* default configurations */
app.set('view engine', 'jade')
app.set('views', __dirname + '/src');
app.engine('html', require('ejs').renderFile);

app.use(morgan());
app.use(bodyParser());
app.use(express.static(__dirname + '/public'));

var bayeux = new faye.NodeAdapter({
  mount:    '/faye',
  timeout:  45
});

var server = http.createServer(app);
bayeux.attach(server);

/* routes */
app.get('/', function(req, res) {
  res.render('index.jade');
});

app.get('/:channel', function(req, res) {
  var _channel = {
    station : null,
    imgSrc : null
  };

  var found = cfg.channels.some(function(c) {
    if (c.channel === req.params.channel) {
      _channel.station = cfg.api.station + c.mount,
      _channel.imgSrc = c.img
      return true;
    }
  });

  var _render = found ? 'channel.jade' : 'not_found.jade';

  res.render('../src/' + _render, _channel);
});

var _pollCurrentSong = new PollCurrentSong();
_pollCurrentSong.addEventListener(function(data) {
  bayeux.getClient().publish('/channel', data);
});

module.exports = app;
