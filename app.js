import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import expressEjsLayouts from "express-ejs-layouts";
import cookieParser from "cookie-parser";
// import morgan from "morgan";

import { setLayout } from "./server/middlewares/setLayout.js";

// Import Routes
import authRouter from "./server/routes/auth.js";
import adminRouter from "./server/routes/admin.js";
import userRouter from "./server/routes/user.js";

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Serve static files from the 'public' directory.
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(morgan("tiny"));

/**
 * Set the view engine to EJS and use EJS layouts.
 */
app.set("view engine", "ejs");
app.use(expressEjsLayouts);

// Apply the layout-setting middleware
app.use(setLayout);

/**
 * Use the admin router for handling /api/admin endpoints.
 */
app.use("/api/auth", authRouter);

/**
 * Use the admin router for handling /admin endpoints.
 */
app.use("/admin", adminRouter);

/**
 * Use the user router for handling / endpoints.
 */
app.use("/", userRouter);

/**
 * Start the server and listen on the specified port.
 */
app.listen(PORT, () => {
  console.log(`Server up at http://localhost:${PORT}/`);
});

/**
 * Export app for potential testing or further configurations
 */
export default app;
