var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

// Test API 
// const mongodb = require('mongodb');
// const uri = 'mongodb://ba_mongo:27017/ba_svlog';
// const MongoClient = mongodb.MongoClient;
// let _db;
// const mongoConnect = callback => {
//   MongoClient.connect(uri)
//     .then(client => {
//       console.log('Connected!');
//       _db = client.db();
//       callback();
//     })
//     .catch(err => {
//       console.log(err);
//       throw err;
//     });
// };

// mongoConnect();

// const getDb = () => {
//   if (_db) {
//     return _db;
//   }
//   throw 'No database found!';
// };
// 

var { open } = require("./utils/database_connection");

open()

var app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// Test API
// app.use('/test/api', async (req, res, next) => {
//   if (!req.query.box_id) {
//     res.json({
//       error_code: 10002,
//       data: [],
//       message: 'Box_id invalidate'
//     });
//   } else if (!req.query.start_date) {
//     res.json({
//       error_code: 10002,
//       data: [],
//       message: 'Start date invalidate'
//     })
//   } else {
//     let criteria = {
//       box_id: new RegExp('^' + req.query.box_id + '$', 'i'), // 'i' = case-insensitive
//       time: { $gte: new Date(req.query.start_date) }
//     }
    
//     const db = getDb();
//     await db.collection('boxlogs').find(criteria).toArray().then(boxlogs => {
//       res.json({
//         error_code: 10000,
//         data: boxlogs,
//         message: "Success"
//       })
//     }).catch(err => {
//       res.json({
//         error_code: 10002,
//         data: [],
//         message: `Error is: ${err}`
//       })
//     });
//   }
// })
//

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
