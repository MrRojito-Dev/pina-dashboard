var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.get('/login', (req, res) => {
  res.redirect("https://discord.com/api/oauth2/authorize?client_id=744386070552117278&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=token&scope=identify")
})

app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.get('*', (req, res) => {
  res.status(404).render('404', {
    title: "Piña Bot"
  });
});

module.exports = app;
