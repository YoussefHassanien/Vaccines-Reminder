# Vaccines Reminder Backend

A comprehensive backend API service for managing vaccine products, with advanced image handling and security features.

## Features

- **Product Management**
  - Create new products with image upload
  - Retrieve paginated products using cursor-based pagination
  - Update product quantities
  - Delete products
- **Security**
  - Request rate limiting to prevent abuse
  - Input validation and sanitization
  - XSS protection with express-validator
  - HTTP security headers with Helmet
- **File Management**
  - Image upload via Multer
  - Cloud storage with Cloudinary
  - Image optimization

## Technologies

- **Core**: Node.js, Express.js
- **Database**: MongoDB, Mongoose ODM
- **Documentation**: Swagger/OpenAPI
- **Security**: Helmet, express-validator, express-rate-limit
- **File Handling**: Multer, Cloudinary
- **Validation**: express-validator
- **Logging**: Morgan

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Vaccines-Reminder
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create environment variables**
   Create a [`.env`](.env) file in the root directory with:

   ```
   PORT=8000
   JWT_SECRET=<your-jwt-secret>
   SESSION_SECRET=<your-session-secret>
   ORIGIN=<your-frontend-origin>
   DATABASE_CONNECTION_STRING=<your-mongodb-connection-string>
   CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
   CLOUDINARY_API_KEY=<your-cloudinary-api-key>
   CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

## API Documentation

API documentation is available via Swagger UI at:

```
http://localhost:8000/api-docs
```

### API Endpoints

#### Products

| Method | Endpoint                                  | Description                           |
| ------ | ----------------------------------------- | ------------------------------------- |
| POST   | `/api/products/admin/add`                 | Create a new product (Admin)          |
| GET    | `/api/products`                           | Get paginated products (cursor-based) |
| PATCH  | `/api/products/admin/update-quantity/:id` | Update product quantity (Admin)       |
| DELETE | `/api/products/admin/delete/:id`          | Delete a product (Admin)              |

## Project Structure

```
Vaccines-Reminder/
├── config/                   # Configuration files
│   ├── cloudinary.js         # Cloudinary setup
│   ├── database.js           # MongoDB connection
│   └── multer.js             # File upload configuration
├── src/
│   ├── middlewares/          # Express middlewares
│   │   ├── authentication.js
│   │   └── multerErrorHandler.js
│   ├── models/               # Mongoose models
│   │   ├── productModel.js
│   │   ├── userModel.js
│   │   └── parentModel.js
│   ├── modules/              # Feature modules
│   │   ├── products/         # Products module
│   │   │   ├── controller.js # Request handlers
│   │   │   ├── repository.js # Database operations
│   │   │   ├── services.js   # Business logic
│   │   │   ├── validation.js # Input validation
│   │   │   ├── rateLimiter.js# Rate limiting rules
│   │   │   └── route.js      # Express routes
│   │   └── authentication/   # Auth module
│   └── utils/                # Utility functions
├── app.js                    # Express application
├── server.js                 # Entry point
├── swagger.yaml              # API documentation
└── .env                      # Environment variables
```

## Security Features

- **Input Validation**: All user inputs are validated using express-validator
- **Rate Limiting**: Prevents brute force and DoS attacks
- **Security Headers**: Implemented using Helmet middleware
- **Error Handling**: Proper error reporting without exposing sensitive info

## License

This project is licensed under the GNU General Public License v3.0.
