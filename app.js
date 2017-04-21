var express = require('express');
var crud = require('./routes/crud');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json( ));
app.use(bodyParser.urlencoded({ extended: true }));

// mount routes
app.use("/", crud);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('404 - Not Found');
  err.status = 404;
  next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status( err.status || 500 );
  res.json({ message: err.message, status: err.status });
});

mongoose.connect('mongodb://localhost:27017/olev');

module.exports = app;
