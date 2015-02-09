var request = require('request');
var parser = require('xml2json');
var events = require('events');

var EventEmitter = require("events").EventEmitter;
var _event = new EventEmitter();

// URL to a known Icecast stream
var url = 'http://admin:hackme@localhost:8000/admin/stats';

var currentSong = null;

var PollCurrentSong = function() {
  /* poll Icecast2 for songs update */
  setInterval(function() {
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var response = JSON.parse(parser.toJson(response.body));

        if (currentSong !==  response["icestats"]["source"]["title"]) {
          currentSong = response["icestats"]["source"]["title"];
          /* emit event to all listeners */
          _event.emit('next_song', {
            'song' : response["icestats"]["source"]["title"]
          });
        }

        if (!currentSong) {
          currentSong = response["icestats"]["source"]["title"];
        }
      }
    });
  }, 1000);
};

PollCurrentSong.prototype.addEventListener = function(cb) {
  _event.on('next_song', cb);
};

module.exports = PollCurrentSong;
