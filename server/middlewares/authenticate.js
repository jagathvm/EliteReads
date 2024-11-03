import { verifyAccessToken } from "../helpers/authHelper.js";
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

  try {
    // Verify the access token
    req.user = verifyAccessToken(accessToken);
    next();
  } catch (error) {
    // Set user layout for 403
    req.app.set("layout", "auth/layout/layout-auth");
    return renderResponse(res, 403, "user/user-login-redirect", {
      req,
      errorMessage: "Session Timed Out",
    });
  }
};

const checkUserLoggedIn = async (req, res, next) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    // No token present, set user to null
    req.user = null;
    return next();
  }

  try {
    // Verify the access token
    req.user = await verifyAccessToken(accessToken);
  } catch (error) {
    req.user = null;
  }
  next();
};

export { authenticateToken, checkUserLoggedIn };
