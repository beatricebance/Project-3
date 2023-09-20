import { NextFunction, Request, Response } from 'express';

export const reqMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(
    `Request middleware:
    HTTP: ${req.method} ${req.url}`,
  );
  next();
};

export const exceptionLoggerMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(`
  Exception middleware
  Http ${req.method} ${req.url}
  ${error.message}
  ${error.stack}
  `);

  res.status(500).json(error);
};
