# EliteReads E-commerce Website

EliteReads is a book-focused e-commerce platform designed to deliver a seamless browsing, purchasing, and reading experience for book enthusiasts. The project is currently in development and includes advanced features such as dynamic category management, JWT-based authentication, and a robust admin panel.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Future Improvements](#future-improvements)
- [License](#license)

## Features

- **Book Management**: Add, edit, and delete book listings with dynamic category and subcategory selection.
- **Category Management**: Admin controls for adding, editing, and organizing categories and subcategories.
- **Image Management**: Cloudinary integration for secure and efficient image storage.
- **User Authentication**: JWT-based authentication with OTP support for secure login.
- **Role-Based Access Control**: Authorization for different user roles, like admins and regular users.
- **Cart and Checkout**: Add books to the cart, adjust quantities, and proceed with purchases (coming soon).
- **Token Storage and Refresh**: Stateless token management with secure storage in cookies and Redis caching (coming soon).

## Project Structure

```
EliteReads/
├── controllers/         # Application controllers for handling business logic
├── routes/              # Route definitions for API endpoints
├── views/               # EJS templates for frontend rendering
├── public/              # Static assets (CSS, JS, images)
├── middlewares/         # Middleware functions (auth, data-validation, etc.)
├── config/              # Configuration files (database, Cloudinary, JWT)
└── README.md            # Project readme file
```

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/jagathvm/EliteReads.git
   cd EliteReads
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add the following variables:

   ```plaintext
   MONGODB_URI=mongodb://localhost:27017/EliteReads_Project
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ACCESS_TOKEN_SECRET=your_access_token_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   ```

4. **Run the server**:

   ```bash
   npm start
   ```

   The app will start on `http://localhost:3000` (or your configured port).

## Configuration

- **MongoDB**: Database for storing users, books, categories, and subcategories.
- **Cloudinary**: Used for storing and managing images.
- **JWT**: Manages stateless authentication and access control.
- **Redis**: Provides session caching and stores refresh tokens for improved performance and security.

## Usage

- **Admin Panel**: Manage categories, subcategories, and book listings, including image uploads.
- **User Features**: Register, log in (with OTP), browse books, and add to cart.
- **Authentication**: Secure login with OTP, along with refresh tokens and role-based access control.

## Technologies Used

- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Frontend**: HTML, CSS, JavaScript, EJS
- **Authentication**: JSON Web Tokens (JWT)
- **Image Management**: Cloudinary
- **Session Management**: Redis
- **Validation**: JustValidate (frontend validation library)

## Future Improvements

- Full checkout and payment gateway integration
- Advanced search and filtering capabilities for books
- User review and rating system
- Personalized recommendations based on user history

## License

This project is licensed under the MIT License.
