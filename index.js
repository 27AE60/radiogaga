'use strict';

var express = require('express'),
  path = require('path');

/**/
var app = express();

/* default configurations */
app.set('views', __dirname + '/public');
app.engine('html', require('ejs').renderFile);

app.use(express.static(path.join(__dirname, 'public')));

/* routes */
app.get('/', function(req, res) {
  res.render('index.html');
});

app.listen(3000, function()  {
  console.log('Listening on %d', 3000);
});
