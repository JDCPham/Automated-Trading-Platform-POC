/* Module Imports */
var createError         =   require('http-errors');
var express             =   require('express');
var path                =   require('path');
var cookieParser        =   require('cookie-parser');
var logger              =   require('morgan');
var sassMiddleware      =   require('node-sass-middleware');
var fs                  =   require('fs');
var cron                =   require('node-cron');
var request             =   require('request');
var malcolm             =   require('./malcolm.js');
var json                =   require('./json.js');


/* Static File Imports */
var static              =   require('./static');

/* Router Imports */
var indexRouter         =   require('./routes/index');

/* Paths */
var viewPath            =   path.join(__dirname, 'views');
var publicPath          =   path.join(__dirname, 'public');
var styleSourcePath     =   path.join(__dirname);
var styleDestPath       =   path.join(__dirname, 'public');

/* Create Express App */
var app                 =   express();

/* Other variables */
var env                 =   app.get('env');

/* View Engine Setup */
app.set('views', viewPath);
app.set('view engine', 'pug');

/* Pretty HTML output */
app.locals.pretty = true;

/* Module Setup */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/* SASS Engine Setup */
app.use(sassMiddleware({
  src: styleSourcePath,
  dest: styleDestPath,
  indentedSyntax: false,
  outputStyle: 'compressed',
  sourceMap: true
}));

/* Static File Setup */
app.use(express.static(publicPath));

/* Routers */
app.use('/', indexRouter);

/* Page Not Found */
app.use(function(req, res, next) {
  next(createError(404));
});

/* Error Handler */
app.use(function(err, req, res, next) {

  res.locals.message = err.message;
  res.locals.error = env === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error', { 

    react       :   static.react,
    metadata    :   static.metadata,
    scripts     :   static.scripts,
    stylesheets :   static.stylesheets,
    title       :   static.title,
    subtitle    :   'Error'

  });

});

module.exports = app;