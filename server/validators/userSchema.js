import Joi from "joi";

const userSignUpSchema = Joi.object({
  username: Joi.string()
    .pattern(/^[a-z0-9_]+$/)
    .required()
    .messages({
      "string.pattern.base":
        "Username can contain only lowercase letters, numbers, and underscores",
      "string.empty": "Username is required",
    }),
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email address",
    "string.empty": "Email is required",
  }),
  phone: Joi.string()
    .pattern(/^[6-9]/)
    .required()
    .messages({
      "string.empty": "Phone number is required",
      "string.pattern.base":
        "Phone number must start with a digit between 6 and 9",
    })
    .pattern(/^[6-9]\d{9}$/)
    .messages({
      "string.pattern.base": "Phone number must be exactly 10 digits",
    }),
  password: Joi.string()
    .min(8)
    .max(16)
    .pattern(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])/)
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.max": "Password must not exceed 16 characters",
      "string.pattern.base":
        "Password must contain at least one letter, one digit, and one special character",
      "string.empty": "Password is required",
    }),
  passwordConfirm: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords must match",
    "string.empty": "Password confirmation is required",
  }),
  checkbox: Joi.boolean().valid(true).required().messages({
    "any.only": "You must agree to the terms and policy",
    "boolean.base": "You must agree to the terms and policy",
    "any.required": "You must agree to the terms and policy",
  }),
});

const userLogInSchema = Joi.object({
  usernameEmailPhone: Joi.string()
    .required()
    .custom((value, helpers) => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phonePattern = /^[6-9]\d{9}$/;
      const usernamePattern = /^[a-z0-9_]{3,20}$/;

      if (emailPattern.test(value)) {
        return value; // valid email
      } else if (phonePattern.test(value)) {
        return value; // valid phone number
      } else if (usernamePattern.test(value)) {
        return value; // valid username
      }

      return helpers.message("Enter a valid username, email, or phone number");
    })
    .messages({
      "string.empty": "Username, Email, or Phone is required",
      "string.pattern.base":
        "Username must be 3-20 characters, using only lowercase letters, numbers, and underscores",
    }),
  password: Joi.string().required().min(8).max(16).messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 8 characters long",
    "string.max": "Password must not exceed 16 characters",
  }),
  checkbox: Joi.boolean()
    // Optional checkbox with default value of false
    .optional()
    .default(false),
});

const userOtpVerificationSchema = Joi.object({
  otp: Joi.string()
    .length(6)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      "string.empty": "OTP is required",
      "string.length": "OTP must be exactly 6 digits",
      "string.pattern.base": "OTP must contain only digits",
    }),
});

export { userSignUpSchema, userLogInSchema, userOtpVerificationSchema };
