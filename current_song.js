var request = require('request');
var parser = require('xml2json');

// URL to a known Icecast stream
var url = 'http://admin:hackme@localhost:8000/admin/stats';

setInterval(function() {
  request('http://admin:hackme@localhost:8000/admin/stats', function (error, response, body) {
    response.on('metadata', function(metadata) {
      console.log('metadata', metadata);
    });

    if (!error && response.statusCode == 200) {
      var response = JSON.parse(parser.toJson(response.body));
      console.log('response', response["icestats"]["source"]["title"]);
    }
  });
}, 1000);
