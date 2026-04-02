import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/response.util";
import { AppError } from "../utils/errors.util";

export const errorHandler = (
  err: Error | AppError, req: Request, res: Response,
  next: NextFunction
): void => {
  let statusCode = 500; //default to 500 server error
  let code = 'INTERNAL_SERVER_ERROR';
  let message = 'An unexpected error occurred';

  //handle operational errors 
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
  } else {
    console.error('Unexpected Error:', err);
  }

  //send the error response
  res.status(statusCode).json(
    errorResponse(message, code, {
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    })
  );
};

//handle 404 routes
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(404).json(
    errorResponse(
      `Route ${req.method} ${req.path} not found`,
      'ROUTE_NOT_FOUND'
    )
  );
};