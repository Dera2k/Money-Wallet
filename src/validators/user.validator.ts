import Joi from "joi";


export const createUserSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  firstName: Joi.string().trim().min(2).max(50).required().messages({
    'string.min': 'First name must be at least 2 characters',
    'string.max': 'First name must not exceed 50 characters',
    'any.required': 'First name is required',
  }),
  lastName: Joi.string().trim().min(2).max(50).required().messages({
    'string.min': 'Last name must be at least 2 characters',
    'string.max': 'Last name must not exceed 50 characters',
    'any.required': 'Last name is required',
  }),
});

export const registerSchema = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required()
    .messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
      "string.empty": "Email cannot be empty",
    }),

  firstName: Joi.string()
    .trim()
    .pattern(/^[a-zA-Z\s'-]+$/)
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.pattern.base": "First name contains invalid characters",
      "string.min": "First name must be at least 2 characters",
      "string.max": "First name must not exceed 50 characters",
      "any.required": "First name is required",
      "string.empty": "First name cannot be empty",
    }),

  lastName: Joi.string()
    .trim()
    .pattern(/^[a-zA-Z\s'-]+$/)
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.pattern.base": "Last name contains invalid characters",
      "string.min": "Last name must be at least 2 characters",
      "string.max": "Last name must not exceed 50 characters",
      "any.required": "Last name is required",
      "string.empty": "Last name cannot be empty",
    }),
}).unknown(false);

export const loginSchema = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required()
    .messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
      "string.empty": "Email cannot be empty",
    }),
}).unknown(false);