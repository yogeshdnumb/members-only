const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await userModel.findOne({ username });
      if (!user) {
        done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.hash);
      if (!match) {
        // passwords do not match!
        return done(null, false, { message: "Incorrect password" });
      }
      done(null, user);
    } catch (err) {
      done(err);
    }
  })
);
