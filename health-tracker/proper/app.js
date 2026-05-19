var createError = require('http-errors');
var express = require('express');
var path = require('path');

var logger = require('morgan');
const session = require('express-session');  
const port = 3000;
var app = express();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var exerciseRouter = require('./routes/exercise');
var dietRouter = require('./routes/diet');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');
var historyRouter = require('./routes/history');
var goalsRouter = require('./routes/goals');
var dashboardRouter = require('./routes/dashboard');


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(session({
  secret: 'yourSecretKey',  
  resave: false,            
  saveUninitialized: true,  

}));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/index', indexRouter);
app.use('/users', usersRouter);
app.use('/goals', goalsRouter);
app.use('/dashboard', dashboardRouter);
app.use('/exercise', exerciseRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/diet', dietRouter);
app.use('/history', historyRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

// Start server
app.listen(port, () => {
  console.log("Server is runnign on http://localhost:" + port);
})

module.exports = app;
