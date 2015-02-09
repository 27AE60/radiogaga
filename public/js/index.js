'use strict';

document.addEventListener("DOMContentLoaded", function(event) {
  var client = new Faye.Client('/faye',{
    timeout: 20
  });

  client.subscribe('/channel', function(message) {
    document.getElementById('current-song').innerHTML = message.song;
  });
});
