import jwt from "jsonwebtoken";
import { renderResponse } from "../utils/responseHandler.js";

const authenticateToken = (req, res, next) => {
  const { accessToken } = req.cookies;

  // Function to determine the correct login redirect URL
  const renderPage = req.originalUrl.startsWith("/admin")
    ? "admin/admin-login-redirect"
    : "user/user-login-redirect";

  if (!accessToken) {
    // Set user layout for 401
    req.app.set("layout", "auth/layout/layout-auth");

    return renderResponse(res, 401, renderPage, {
      req,
      errorMessage: "Please Login First.",
    });
  }

  // Verify the access token
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      // Set user layout for 403
      req.app.set("layout", "auth/layout/layout-auth");

      return renderResponse(res, 403, renderPage, {
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

export { authenticateToken };
