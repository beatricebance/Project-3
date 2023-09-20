import { TYPES } from '../../domain/constants/types';
import { container } from '../../infrastructure/ioc/ioc_container';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import JWTstrategy, { ExtractJwt } from 'passport-jwt';
import localStrategy from 'passport-local';
import { User } from '../../domain/models/user';
import { StatusService } from '../../domain/services/status.service';
import { STATUS } from '../../domain/constants/status';

export const passportRegisterMiddleware = () => {
  passport.use(
    'register',
    new localStrategy.Strategy(
      {
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        try {
          const user = await User.create(req.body);
          return done(null, user, {
            message: 'Account created succesfully.',
          });
        } catch (error) {
          // TODO: Better error handling
          done(error, null, undefined);
        }
      },
    ),
  );
};

// This middleware function is performed first in the login
// middleware function calls. It verifies the credentials of user
// against the database.
export const passportLoginMiddleware = () => {
  passport.use(
    'login',
    new localStrategy.Strategy(
      {
        usernameField: 'username',
        passwordField: 'password',
      },
      async (username, password, done) => {
        try {
          const user = await User.findOne({ username });
          if (!user) {
            return done({ message: 'Username not found' }, false, undefined);
          }

          const validate = await user.isValidPassword(password);

          if (!validate) {
            return done({ message: 'Wrong password' }, false, undefined);
          }

          return done(null, user, {
            message: 'Logged in succesfully',
          });
        } catch (error) {
          return done(error);
        }
      },
    ),
  );
};

// This middleware sets up the JWT strategy that will create a JWT token
// for the user.
export const jwtStrategyMiddleware = () => {
  passport.use(
    'jwt',
    new JWTstrategy.Strategy(
      {
        secretOrKey: 'SIMPSRISE',
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      },
      async (token, done) => {
        try {
          return done(null, token.user);
        } catch (error) {
          done(error);
        }
      },
    ),
  );
};

// Provides the middleware function that will be called when the
// /auth/register endpoint is hit.
const authRegisterMiddlewareFactory = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('register', (err, user, info) => {
      try {
        // TODO: Better error handling.
        if (err || !user) {
          return res.json({
            user: null,
            token: null,
            info: null,
            error: err.message,
          });
        }

        req.login(user, { session: false }, (error) => {
          const body = {
            id: user.id,
            username: user.username,
          };

          const token = jwt.sign({ user: body }, 'SIMPSRISE');

          return res.json({
            user: user,
            token: token,
            info: info.message,
            error: null,
          });
        });
      } catch (err) {
        return next(err);
      }
    })(req, res, next);
  };
};

// Provides the middleware function that will be called when the
// /auth/login endpoint is hit.
const authLoginMiddlewareFactory = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('login', async (err, user, info) => {
      try {
        if (err || !user) {
          return res.json({
            user: null,
            token: null,
            info: null,
            error: err.message,
          });
        }
        req.login(user, { session: false }, async (error) => {
          const body = {
            id: user.id,
            user: user.username,
          };

          const token = jwt.sign({ user: body }, 'SIMPSRISE');

          // Updating the last login
          User.updateOne(
            { _id: user._id },
            { lastLogin: new Date() },
            (err: Error, user: any) => {},
          );

          const statusService = container.get(
            TYPES.StatusService,
          ) as StatusService;
          statusService.updateStatus(user._id.toString(), STATUS.Online);

          return res.json({
            user: user,
            token: token,
            info: info.message,
            error: null,
          });
        });
      } catch (error) {
        return next(error);
      }
    })(req, res, next);
  };
};

const authRegisterMiddleware = authRegisterMiddlewareFactory();
const authLoginMiddleware = authLoginMiddlewareFactory();

export { authRegisterMiddleware, authLoginMiddleware };
