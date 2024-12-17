var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cors = require('cors');
const session = require('express-session');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var rolesRouter = require('./routes/roles');
var serachRouter =  require('./routes/search');
var authRouter =  require('./routes/auth'); // register & login
var brandsRouter = require('./routes/brands');
var categoryRouter = require('./routes/categories');
var productsRouter =  require('./routes/products');
// var cartRouter =  require('./routes/cart'); // would be cool to have a active listenere on sql table on change 
var ordersRouter =  require('./routes/orders');
var membershipRouter = require('./routes/memberships');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use(session({
  secret: 'eat my shorts',
  saveUninitialized: true,
  resave: false,
  cookie: { secure: false, maxAge: 2 * 60 * 60 * 1000 } // 2 hours
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.static(__dirname + '/node_modules/jquery/dist'));

app.use('/admin/auth', authRouter); 
app.use('/admin/products', productsRouter);
app.use('/admin/orders', ordersRouter);
app.use('/admin/brands', brandsRouter); 
app.use('/admin/categories', categoryRouter);
app.use('/admin/search', serachRouter); 

app.use('/admin', indexRouter);  
app.use('/admin/users', usersRouter);
app.use('/admin/memberships', membershipRouter); 
app.use('/admin/roles', rolesRouter); 

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
  res.render('error');
});

module.exports = app;
