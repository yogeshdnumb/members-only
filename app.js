const createError = require("http-errors");
const express = require("express");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const compression = require("compression");
const helmet = require("helmet");
const RateLimit = require("express-rate-limit");

require("dotenv").config();

const indexRouter = require("./routes/indexRouter");
const postRouter = require("./routes/postRouter");

const app = express();

console.log(process.env.MONGODB_URL_PROD, process.env.MONGODB_URL_DEV);

// Set up mongoose connection
mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGODB_URL_PROD || process.env.MONGODB_URL_DEV;
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL_PROD || process.env.MONGODB_URL_DEV,
    }),
  })
);

app.use(passport.session());
require("./config/passport");
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 50,
});
// Apply rate limiter to all requests
app.use(limiter);
app.use(compression()); // Compress all routes
app.use(express.static(path.join(__dirname, "public")));

// app.use(function (req, res, next) {
//   console.log(req.session);
//   console.log(req.user);
//   next();
// });

//set variables in views
app.use(function (req, res, next) {
  res.locals.currentUser =
    req.user == undefined ? undefined : req.user.username;
  res.locals.isLogged = req.isAuthenticated();
  res.locals.isAdmin = req.user == undefined ? undefined : req.user.isAdmin;
  res.locals.isMember = req.user == undefined ? undefined : req.user.isMember;
  next();
});

app.use("/", indexRouter);
app.use("/post", postRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
