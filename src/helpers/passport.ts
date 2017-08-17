import passport = require("passport");
import passportLocal = require("passport-local");

import { IUser, userModel } from "../models";

import { NextFunction, Request, Response } from "express";

const LocalStrategy = passportLocal.Strategy;

passport.serializeUser<IUser, String>((user, done) => done(undefined, user.id));
passport.deserializeUser<IUser, String>((id, done) => {
  userModel.findById(id, (err, user) => {
    if (err) done(err);
    if (user) done(err, user);
    done(new Error("User Not Found"));
  });
});

/**
 * Sign in using Email and Password.
 */
const localStrategy = new LocalStrategy(
  { usernameField: "email" },
  (email, password, done) => {
    userModel.findOne({ email: email.toLowerCase() }, (err, user) => {
      if (err) return done(err);

      if (!user)
        return done(undefined, false, {
          message: `Email ${email} not found.`
        });

      if (user.password === password) return done(undefined, user);
      else {
        return done(undefined, false, {
          message: "Invalid email or password."
        });
      }
    });
  }
);

passport.use(localStrategy);
