import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ValidationError } from '../utils/errors.util';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => 
    {
    const { error, value } = schema.validate(req.body,
        {
      abortEarly: false, 
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(', ');

      return next(new ValidationError(errorMessage));
    }
    req.body = value; //replace req.body with validated and sanitized value
    next();
  };
};