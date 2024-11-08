import { sendResponse } from "../helpers/responseHelper.js";

const validateData = (schema) => {
  return async (req, res, next) => {
    try {
      if (req.body.checkbox) {
        req.body.checkbox = req.body.checkbox === "on";
      }

      const { error: validationError, value: validData } = schema.validate(
        req.body,
        { abortEarly: false }
      );

      // Send error response if validation fails
      if (validationError) {
        return sendResponse(
          res,
          400,
          validationError.details.map((error) => error.message),
          false
        );
      }

      req.validData = validData;
      next();
    } catch (error) {
      console.error(`An unexpected error occurred. ${error}`);
      return sendResponse(res, 500, "An unexpected error occurred.", false);
    }
  };
};

export default validateData;
