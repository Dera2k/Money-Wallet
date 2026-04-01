import Joi from 'joi';

export const fundWalletSchema = Joi.object({
  amount: Joi.number().positive().max(9999999999.99).required().messages({
    'number.positive': 'Amount must be greater than zero',
    'number.max': 'Amount exceeds maximum allowed value',
    'any.required': 'Amount is required',
  }),
  reference: Joi.string().min(3).max(100).required().messages({
    'string.min': 'Reference must be at least 3 characters',
    'string.max': 'Reference must not exceed 100 characters',
    'any.required': 'Reference is required',
  }),
});

export const transferSchema = Joi.object({
  toUserId: Joi.string().uuid().required().messages({
    'string.guid': 'Invalid user ID format',
    'any.required': 'Recipient user ID is required',
  }),
  amount: Joi.number().positive().max(9999999999.99).required().messages({
    'number.positive': 'Amount must be greater than zero',
    'number.max': 'Amount exceeds maximum allowed value',
    'any.required': 'Amount is required',
  }),
  reference: Joi.string().min(3).max(100).required().messages({
    'string.min': 'Reference must be at least 3 characters',
    'string.max': 'Reference must not exceed 100 characters',
    'any.required': 'Reference is required',
  }),
});

export const withdrawSchema = Joi.object({
  amount: Joi.number().positive().max(9999999999.99).required().messages({
    'number.positive': 'Amount must be greater than zero',
    'number.max': 'Amount exceeds maximum allowed value',
    'any.required': 'Amount is required',
  }),
  reference: Joi.string().min(3).max(100).required().messages({
    'string.min': 'Reference must be at least 3 characters',
    'string.max': 'Reference must not exceed 100 characters',
    'any.required': 'Reference is required',
  }),
});