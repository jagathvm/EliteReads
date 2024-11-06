import Joi from "joi";

const bookSchema = Joi.object({
  // Book Title
  title: Joi.string().required().messages({
    "string.empty": "Book title is required",
    "any.required": "Book title is required.",
  }),

  // Author
  author: Joi.string().required().messages({
    "string.empty": "Author is required",
    "any.required": "Author is required.",
  }),

  // Description
  description: Joi.string().min(10).max(1000).required().messages({
    "string.empty": "Book description is required",
    "string.min": "Description must be at least 10 characters long",
    "string.max": "Description must be less than 1000 characters",
    "any.required": "Book description is required.",
  }),

  // Price (supports decimals)
  price: Joi.number().min(0.1).required().messages({
    "number.empty": "Price is required",
    "number.base": "Price must be a valid number",
    "number.min": "Price must be greater than 0",
    "any.required": "Price is required",
  }),

  // ISBN (exactly 13 digits)
  isbn: Joi.string()
    .pattern(/^[0-9]{13}$/)
    .required()
    .messages({
      "string.empty": "ISBN is required",
      "string.pattern.base": "ISBN must be exactly 13 digits",
      "any.required": "ISBN is required",
    }),

  // Publisher
  publisher: Joi.string().required().messages({
    "string.empty": "Publisher is required",
    "any.required": "Publisher is required",
  }),

  // Publication Year
  year: Joi.number()
    .integer()
    .min(1000)
    .max(new Date().getFullYear())
    .required()
    .messages({
      "number.empty": "Publication year is required",
      "number.base": "Publication year must be a number",
      "number.min": "Year must be a valid year",
      "number.max": "Year cannot be in the future",
      "any.required": "Publication year is required",
    }),

  // Language
  language: Joi.string().min(2).required().messages({
    "string.empty": "Language is required",
    "string.min": "Language must be at least 2 characters long",
    "any.required": "Language is required",
  }),

  pages: Joi.number().integer().positive().required().messages({
    "number.base": "Pages must be a number",
    "number.integer": "Pages must be an integer",
    "number.positive": "Pages must be a positive number",
    "any.required": "Pages are required",
  }),

  weight: Joi.number().integer().positive().required().messages({
    "number.base": "Weight must be a number",
    "number.integer": "Weight must be an integer",
    "number.positive": "Weight must be a positive number",
    "any.required": "Weight is required",
  }),

  // Featured (Optional)
  featured: Joi.optional().messages({
    "any.only": "Please select the featured option if necessary",
  }),

  // Category (Dropdown)
  category: Joi.string().required().messages({
    "string.empty": "Category is required",
    "any.required": "Category selection is required",
  }),

  // Subcategory (Dropdown, Optional)
  subcategory: Joi.string().allow("").optional().messages({
    "string.empty": "Subcategory is required if a selection is made",
  }),

  removedImageUrls: Joi.alternatives()
    .try(
      Joi.array().items(Joi.string().uri()).optional(),
      Joi.string().allow("").optional()
    )
    .messages({
      "array.base": "Removed image URLs must be an array or an empty string",
      "string.uri": "Each removed image URL must be a valid URL",
    }),
});

const categorySchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).required().messages({
    "string.empty": "Category Name is required.",
    "string.min": "Category Name must be at least 3 characters long.",
    "string.max": "Category Name cannot exceed 100 characters.",
    "any.required": "Category Name is required.",
  }),
  description: Joi.string().trim().min(10).max(500).required().messages({
    "string.empty": "Description is required.",
    "string.min": "Description must be at least 10 characters long.",
    "string.max": "Description cannot exceed 500 characters.",
    "any.required": "Description is required.",
  }),
  parentCategory: Joi.string().allow(null, "").optional().messages({
    "string.base": "Parent Category must be a string.",
  }),
});

export { bookSchema, categorySchema };
