export const setLayout = (req, res, next) => {
  const url = req.originalUrl;

  // Ignore .css.map, .js.map, and other static asset requests
  if (url.endsWith(".map") || url.startsWith("/static")) {
    return next(); // Skip layout setting for these routes
  }

  const layout = url.startsWith("/admin")
    ? "admin/layout/layout-admin"
    : url.startsWith("/api")
      ? "auth/layout/layout-auth"
      : "user/layout/layout-user";

  req.app.set("layout", layout);

  // // Log the current route and layout
  // console.log(`Current route: ${url}`);
  // console.log(`Layout set to: ${layout}`);

  next();
};
