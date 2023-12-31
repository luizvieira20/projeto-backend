var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var loginRouter = require('./routes/login');
app.use('/', loginRouter);

var installRouter = require('./routes/install');
app.use('/', installRouter);

var cadastroRouter = require('./routes/cadastro');
app.use('/', cadastroRouter);

var docsRouter = require('./routes/docs');
app.use('/', docsRouter);

var adminRouter = require('./routes/admin');
app.use('/', adminRouter);

var userRouter = require('./routes/user');
app.use('/', userRouter);

var categoriaRouter = require('./routes/categoria');
app.use('/', categoriaRouter);

var instrumentoRouter = require('./routes/instrumentos');
app.use('/', instrumentoRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({Mensagem: 'Um erro ocorreu.'});
});

module.exports = app;
