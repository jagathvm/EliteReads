import jwt from "jsonwebtoken";
import { renderResponse } from "../utils/responseHandler.js";

const authenticateToken = (req, res, next) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    // Set user layout for 401
    req.app.set("layout", "auth/layout/layout-auth");
    return renderResponse(res, 401, "user/user-login-redirect", {
      req,
      errorMessage: "Please Login First.",
    });
  }

  // Verify the access token
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      // Set user layout for 403
      req.app.set("layout", "auth/layout/layout-auth");

      return renderResponse(res, 403, "user/user-login-redirect", {
        req,
        errorMessage: "Session Timed Out",
      });
    }

    // Attach the user information to the request
    req.user = user;
    // Proceed to the next middleware or route handler
    next();
  });
};

const checkUserLoggedIn = (req, res, next) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    // No token present, set user to null
    req.user = null;
    return next();
  }

  // Verify the access token
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      // Invalid token, set user to null
      req.user = null;
    } else {
      // Valid token, set req.user to the decoded user info
      req.user = user;
    }

    // Proceed to the next middleware or route handler
    next();
  });
};

export { authenticateToken, checkUserLoggedIn };
