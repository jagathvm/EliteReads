import Joi from "joi";

export const userSignUpSchema = Joi.object({
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

export const userLogInSchema = Joi.object({
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

export const userOtpVerificationSchema = Joi.object({
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

export const postAddressValidationSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    "string.base": "Name must be a valid string.",
    "string.empty": "Name is required.",
    "string.min": "Name must be at least 3 characters long.",
    "any.required": "Name is required.",
  }),

  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      "string.empty": "Phone number is required.",
      "string.pattern.base":
        "Phone number must be a valid 10-digit number starting with 6-9.",
      "any.required": "Phone number is required.",
    }),

  pincode: Joi.string()
    .pattern(/^\d{6}$/)
    .required()
    .messages({
      "string.empty": "Pincode is required.",
      "string.pattern.base": "Pincode must be a valid 6-digit number.",
      "any.required": "Pincode is required.",
    }),

  locality: Joi.string().min(3).required().messages({
    "string.empty": "Locality is required.",
    "string.min": "Locality must be at least 3 characters long.",
    "any.required": "Locality is required.",
  }),

  street: Joi.string().min(3).required().messages({
    "string.empty": "Street address is required.",
    "string.min": "Street address must be at least 3 characters long.",
    "any.required": "Street address is required.",
  }),

  city: Joi.string().min(3).required().messages({
    "string.empty": "City/District/Town is required.",
    "string.min": "City/District/Town must be at least 3 characters long.",
    "any.required": "City/District/Town is required.",
  }),

  state: Joi.string().min(3).required().messages({
    "string.empty": "State is required.",
    "string.min": "State must be at least 3 characters long.",
    "any.required": "State is required.",
  }),

  landmark: Joi.string().min(3).allow("").optional().messages({
    "string.base": "Landmark must be a valid string.",
    "string.min": "Landmark must be at least 3 characters long.",
  }),

  alt_phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .allow("")
    .min(3)
    .optional()
    .messages({
      "string.pattern.base":
        "Alternate phone number must be a valid 10-digit number starting with 6-9.",
    }),

  address_type: Joi.string().valid("home", "work").required().messages({
    "any.only": "Address type must be either Home or Work.",
    "any.required": "Address type is required.",
  }),
});

export const editAddressValidationSchema = Joi.object({
  name: Joi.string().min(3).max(50).messages({
    "string.min": "Name must be at least 3 characters",
    "string.max": "Name must be at most 50 characters",
  }),

  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .messages({
      "string.pattern.base":
        "Phone number must be valid (10 digits starting with 6-9)",
    }),

  pincode: Joi.string()
    .length(6)
    .pattern(/^\d{6}$/)
    .messages({
      "string.length": "Pincode must be exactly 6 digits",
      "string.pattern.base": "Pincode must contain only numbers",
    }),

  locality: Joi.string().min(3).max(100).messages({
    "string.min": "Locality must be at least 3 characters",
    "string.max": "Locality must be at most 100 characters",
  }),

  street: Joi.string().min(5).max(150).messages({
    "string.min": "Street address must be at least 5 characters",
    "string.max": "Street address must be at most 150 characters",
  }),

  city: Joi.string().min(2).max(100).messages({
    "string.min": "City must be at least 2 characters",
    "string.max": "City must be at most 100 characters",
  }),

  state: Joi.string().min(2).max(100).messages({
    "string.min": "State must be at least 2 characters",
    "string.max": "State must be at most 100 characters",
  }),

  landmark: Joi.string().max(150).allow("").messages({
    "string.max": "Landmark must be at most 150 characters",
  }),

  alt_phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .allow("")
    .messages({
      "string.pattern.base":
        "Alternate phone must be valid (10 digits starting with 6-9)",
    }),

  address_type: Joi.string().valid("home", "work").messages({
    "any.only": "Address type must be either 'home' or 'work'",
  }),
}).min(1);
