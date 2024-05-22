const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const ratelimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const tourRouter = require('./Routers/tourRouter');
const userRouter = require('./Routers/userRouter');
const reviewRouter = require('./Routers/reviewRouter');
const viewRoutes = require('./Routers/viewRoutes');
const bookingRouter = require('./Routers/bookingRouter');
const cookieParser = require('cookie-parser');
const { log } = require('console');
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));
// http secureity
app.use(helmet());

// 1) MIDDLEWARES
if (process.env.NEDE_ENV === 'development') {
  app.use(morgan('dev'));
}
// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Body parser, reading data from body into req.body
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
//remove $ . from query NoSQL injection attacks
// app.use(mongoSanitize());

// Data sanitization against XSS convert html scripts
app.use(xss());

//?sort=duration&sort=price هيسصورت بالاخيره
app.use(hpp());

app.use((req, res, next) => {
  console.log('hi from middelware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const limiter = ratelimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'to many reqs , Try After 1 hour',
});

app.use('/api', limiter);

//Route Handler

app.use('/', viewRoutes);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`THIS PAGE ${req.originalUrl} NOT FOUND`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
