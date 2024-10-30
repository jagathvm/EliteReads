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
  emailOrPhone: Joi.string()
    .required()
    .custom((value, helpers) => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phonePattern = /^[6-9]\d{9}$/;

      if (!emailPattern.test(value) && !phonePattern.test(value)) {
        return helpers.message("Enter a valid email or phone number");
      }

      return value;
    })
    .messages({
      "string.empty": "Email or Phone is required",
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

export { userSignUpSchema, userLogInSchema };
