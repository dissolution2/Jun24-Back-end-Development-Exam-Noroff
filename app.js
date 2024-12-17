require('dotenv').config();

const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger-output.json')
const bodyParser = require('body-parser');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// var adminRouter = require('./routes/admin'); NB Stand alone application WebAdmin NB
var initRouter =  require('./routes/init'); 

// var indexRouter = require('./routes/index'); // !: used to check a simple pass jest test
var usersRouter = require('./routes/users'); 

var rolesRouter = require('./routes/roles');

var searchRouter =  require('./routes/search');

var authRouter =  require('./routes/auth'); // register & login
var brandsRouter = require('./routes/brands');
var categoryRouter = require('./routes/categories');
var productsRouter =  require('./routes/products');
var cartRouter =  require('./routes/cart');
var ordersRouter =  require('./routes/orders');
var membershipRouter = require('./routes/memberShip');

var userHistory = require('./routes/userdiscountlogg');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/init', initRouter); // check - create/init DB
app.use('/auth', authRouter); //
app.use('/cart', cartRouter);
app.use('/products', productsRouter);
app.use('/orders', ordersRouter);
app.use('/brands', brandsRouter);
app.use('/categories', categoryRouter);
app.use('/membership', membershipRouter);  
app.use('/search', searchRouter);
// app.use('/', indexRouter); // ! used to to check a simple pass jest test 
app.use('/users', usersRouter); 
app.use('/roles', rolesRouter);
app.use('/history', userHistory);

app.use(bodyParser.json());
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

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
