# Vaccines Reminder Backend

A comprehensive healthcare backend API service for managing vaccination schedules, health products, and parental care resources with advanced automation and security features.

## Overview

The Vaccines Reminder Backend is a complete healthcare management system designed to help parents track their children's vaccination schedules, purchase health products, and access educational resources. The system includes automated reminder services, nurse appointment scheduling, complaint handling, and comprehensive user management.

## Key Features

### 🩹 **Vaccination Management**
- Vaccine catalog with age-specific requirements
- Automated reminder system with daily cron jobs
- Vaccine request submission and tracking
- Provider network management
- Nurse assignment and slot booking

### 🛒 **E-commerce Platform**
- Health products marketplace
- Shopping cart management with multiple payment options
- Inventory tracking and management
- Product reviews and ratings
- Order status tracking

### 👨‍⚕️ **Healthcare Services**
- Nurse scheduling and assignment system
- Provider directory with location details
- Appointment slot management
- Service delivery tracking

### 📱 **User Experience**
- Parent and child profile management
- Educational content (pregnancy tips, milestones)
- Complaint submission and resolution
- Comprehensive user authentication

### 🔧 **System Features**
- Automated cron jobs for maintenance and reminders
- Rate limiting and security protection
- Cloud image storage and optimization
- Comprehensive API documentation
- Real-time status tracking

## Technology Stack

### **Backend Framework**
- **Node.js** (18+): Runtime environment
- **Express.js** (5.1.0): Web application framework
- **MongoDB**: NoSQL database with Mongoose ODM

### **Authentication & Security**
- **JWT**: Secure token-based authentication
- **bcrypt**: Password hashing
- **Helmet**: HTTP security headers
- **express-rate-limit**: Request rate limiting
- **express-validator**: Input validation and sanitization

### **File Management**
- **Multer**: Multipart form data handling
- **Cloudinary**: Cloud image storage and optimization

### **Communication**
- **Twilio**: SMS notifications for reminders
- **CORS**: Cross-origin resource sharing

### **Automation**
- **node-cron**: Scheduled task management
- **Morgan**: HTTP request logging

### **Documentation**
- **Swagger/OpenAPI**: Interactive API documentation
- **YAML**: Configuration and documentation

### **Development Tools**
- **Nodemon**: Development server with hot reload
- **GitHub Actions**: CI/CD pipeline for Azure deployment

## Installation & Setup

### Prerequisites
- Node.js (version 18.0.0 or higher)
- MongoDB database
- Cloudinary account for image storage
- Twilio account for SMS services (optional)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Vaccines-Reminder
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=8000
NODE_ENV=development

# Database
DATABASE_CONNECTION_STRING=mongodb://localhost:27017/vaccines-reminder

# Authentication
JWT_SECRET=your-super-secret-jwt-key
SESSION_SECRET=your-session-secret-key

# Frontend Configuration
ORIGIN=http://localhost:3000

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Twilio Configuration (Optional)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number
```

### 4. Database Setup
Ensure MongoDB is running on your system. The application will automatically connect and create the necessary collections.

### 5. Start the Application

**Development Mode (with hot reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

The server will start on `http://localhost:8000`

## API Documentation

### Interactive Documentation
Access the comprehensive Swagger UI documentation at:
```
http://localhost:8000/api-docs
```

### API Modules Overview

#### **Authentication & User Management**
- User registration and login
- Password management
- Role-based access control (Admin/User)
- JWT token authentication

#### **Products & E-commerce**
- Product catalog management
- Shopping cart operations
- Order processing and tracking
- Inventory management
- Product reviews and ratings

#### **Vaccination Services**
- Vaccine catalog and information
- Vaccination request submission
- Automated reminder system
- Provider and nurse management

#### **Healthcare Services**
- Nurse scheduling and assignments
- Appointment slot management
- Service delivery tracking

#### **Content Management**
- Pregnancy tips and milestones
- Educational content delivery
- Complaint handling system

## Project Architecture

```
Vaccines-Reminder/
├── 📁 config/                    # Configuration files
│   ├── 🔧 cloudinary.js         # Cloudinary setup
│   ├── 🗄️ database.js            # MongoDB connection
│   └── 📤 multer.js              # File upload configuration
├── 📁 src/
│   ├── 📁 middlewares/           # Express middlewares
│   │   ├── 🔐 authentication.js  # Auth middleware
│   │   └── ⚠️ multerErrorHandler.js # File upload error handling
│   ├── 📁 models/                # Database models (18 models)
│   │   ├── 👤 userModel.js       # User schema
│   │   ├── 🛒 productModel.js    # Product schema
│   │   ├── 🛒 cartModel.js       # Shopping cart schema
│   │   ├── 💉 vaccineModel.js    # Vaccine schema
│   │   ├── 👶 childModel.js      # Child profile schema
│   │   ├── 👩‍⚕️ nurseModel.js        # Nurse schema
│   │   ├── 🏥 providerModel.js   # Healthcare provider schema
│   │   ├── 📝 complaintModel.js  # Complaint schema
│   │   ├── ⭐ reviewModel.js      # Review schema
│   │   └── ... (9 more models)
│   ├── 📁 modules/               # Feature modules (12 modules)
│   │   ├── 📁 authentication/    # User auth module
│   │   ├── 📁 products/          # Product management
│   │   ├── 📁 carts/             # Shopping cart functionality
│   │   ├── 📁 vaccines/          # Vaccine management
│   │   ├── 📁 nurse/             # Nurse services
│   │   ├── 📁 user/              # User profile management
│   │   ├── 📁 child/             # Child profile management
│   │   ├── 📁 payment/           # Payment processing
│   │   ├── 📁 providers/         # Healthcare providers
│   │   ├── 📁 vaccines-requests/ # Vaccination requests
│   │   ├── 📁 complaints/        # Complaint handling
│   │   ├── 📁 products-reviews/  # Product reviews
│   │   └── 📁 tips/              # Educational content
│   └── 📁 utils/                 # Utility functions
├── 📁 jobs/                      # Automated tasks
│   ├── ⏰ cronJobs.js            # General maintenance jobs
│   └── 💉 vaccinesRemindersJob.js # Vaccine reminder automation
├── 📁 scripts/                   # Data seeding scripts
│   ├── 🧪 productsScript.js      # Product data seeding
│   ├── 🏥 providersScript.js     # Provider data seeding
│   ├── 💉 vaccinesScript.js      # Vaccine data seeding
│   └── 📝 pregnancyTipsScript.js # Educational content seeding
├── 📁 .github/workflows/         # CI/CD pipeline
│   └── 🚀 main_baby-guard.yml   # Azure deployment workflow
├── 🚀 app.js                     # Express application setup
├── 🌐 server.js                  # Application entry point
├── 📖 swagger.yaml               # API documentation (50+ endpoints)
├── 📦 package.json               # Dependencies and scripts
└── 🔒 .env                       # Environment variables
```

## Database Models

The application uses 18 comprehensive Mongoose models:

| Model | Purpose |
|-------|---------|
| `userModel` | Parent/user accounts and authentication |
| `childModel` | Child profiles and health records |
| `productModel` | Health products and supplements |
| `cartModel` | Shopping cart management |
| `cartProductModel` | Cart-product relationships |
| `vaccineModel` | Vaccine catalog and information |
| `vaccineRequestModel` | Vaccination appointment requests |
| `nurseModel` | Healthcare nurse profiles |
| `nurseSlotModel` | Nurse availability scheduling |
| `providerModel` | Healthcare provider directory |
| `complaintModel` | User feedback and complaints |
| `productReviewModel` | Product ratings and reviews |
| `pregnancyTipsModel` | Educational pregnancy content |
| `milestonesModel` | Child development milestones |
| `paymentOtpModel` | Payment verification codes |
| `recommendedFoodModel` | Nutritional recommendations |
| `trimesterModel` | Pregnancy stage information |
| `reviewModel` | General review system |

## API Endpoints Summary

### **Authentication** (`/api/auth`)
- `POST /signup` - User registration
- `POST /login` - User authentication
- `PATCH /update-password` - Password update

### **Products** (`/api/products`)
- `GET /` - Browse products with pagination
- `POST /admin/add` - Add new product (Admin)
- `PATCH /admin/update-quantity/:id` - Update inventory (Admin)
- `DELETE /admin/delete/:id` - Remove product (Admin)

### **Shopping Cart** (`/api/carts`)
- `POST /` - Create new cart
- `GET /pending` - Get current pending cart
- `GET /my-orders` - Get order history
- `POST /{cartId}/products` - Add product to cart
- `DELETE /{cartId}/products/{productId}` - Remove product
- `PATCH /{cartId}/products/{productId}` - Update quantity
- `PATCH /status/{cartId}` - Update cart status
- `DELETE /{cartId}` - Delete entire cart

### **Vaccines** (`/api/vaccines`)
- `GET /` - Browse available vaccines
- `POST /admin` - Add new vaccine (Admin)
- `DELETE /admin/{vaccineId}` - Remove vaccine (Admin)

### **Vaccine Requests** (`/api/vaccine-requests`)
- `POST /` - Submit vaccination request
- `GET /` - Get user's requests
- `GET /admin` - Get all requests (Admin)
- `PATCH /status/admin/{id}` - Update request status (Admin)
- `DELETE /{id}` - Cancel request

### **Nurses** (`/api/nurse`)
- `GET /` - List all nurses (Admin)
- `POST /` - Add new nurse (Admin)
- `GET /{nurseId}/slots` - Get nurse availability
- `POST /{nurseId}/assign` - Assign nurse to request
- `DELETE /{nurseId}` - Remove nurse (Admin)

### **User Management** (`/api/user`)
- User profile operations and management

### **Child Management** (`/api/child`)
- Child profile creation and management

### **Providers** (`/api/provider`)
- Healthcare provider directory

### **Complaints** (`/api/complaints`)
- User feedback and complaint handling

### **Reviews** (`/api/products-reviews`)
- Product review and rating system

### **Educational Content** (`/api/tips`)
- Pregnancy tips and health information

## Automation Features

### **Vaccine Reminders**
- **Schedule**: Daily at 12:00 AM (Africa/Cairo timezone)
- **Function**: Sends automated vaccination reminders to parents
- **Technology**: Node-cron with Twilio SMS integration

### **System Maintenance**
- **Schedule**: Daily at 2:00 AM (Africa/Cairo timezone)
- **Function**: Maintains nurse availability slots
- **Alternative**: Every 6 hours for high-frequency maintenance

### **Cron Job Configuration**
```javascript
// Daily vaccine reminders
cron.schedule("0 0 * * *", vaccineReminderTask);

// Daily slot maintenance
cron.schedule("0 2 * * *", nurseSlotMaintenance);
```

## Security Features

### **Authentication & Authorization**
- JWT-based token authentication
- Role-based access control (Admin/User)
- Password hashing with bcrypt
- Session management

### **Request Protection**
- Rate limiting per endpoint
- Input validation and sanitization
- XSS protection
- HTTP security headers via Helmet
- CORS configuration

### **Data Protection**
- MongoDB injection prevention
- File upload restrictions
- Secure environment variable handling
- Error message sanitization

## Development Scripts

### **Available Commands**
```bash
# Development with hot reload
npm run dev

# Production start
npm start

# Build (placeholder for future use)
npm run build

# Test (placeholder for future implementation)
npm test
```

### **Data Seeding Scripts**
Located in `/scripts/` directory:
- `productsScript.js` - Seed health products
- `providersScript.js` - Seed healthcare providers
- `vaccinesScript.js` - Seed vaccine catalog
- `pregnancyTipsScript.js` - Seed educational content

## Deployment

### **Azure Deployment**
The project includes GitHub Actions workflow for automated deployment to Azure Web Apps:

- **Workflow File**: `.github/workflows/main_baby-guard.yml`
- **Platform**: Azure Web App (Baby-Guard)
- **Node Version**: 22.x
- **Deployment**: Automated on main branch push

### **Environment Requirements**
- Node.js 18.0.0+
- MongoDB database
- Cloudinary account
- Azure Web App service

## Usage Examples

### **Create a New Product**
```bash
curl -X POST "http://localhost:8000/api/products/admin/add" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "name=Vitamin D Supplement" \
  -F "price=29.99" \
  -F "description=High-quality vitamin D for infants" \
  -F "quantity=100" \
  -F "requiredAge=0-12 months" \
  -F "image=@/path/to/image.jpg"
```

### **Get Products with Pagination**
```bash
curl "http://localhost:8000/api/products?limit=10&cursor=eyJpZCI6IjY..."
```

### **Submit Vaccine Request**
```bash
curl -X POST "http://localhost:8000/api/vaccine-requests" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "childId": "60d21b4667d0d8992e610c85",
    "vaccineId": "60d21b4667d0d8992e610c87",
    "preferredDate": "2024-12-25"
  }'
```

## Contributing

### **Development Setup**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Follow the existing code structure and patterns
4. Ensure proper error handling and validation
5. Add appropriate rate limiting for new endpoints
6. Update API documentation in `swagger.yaml`
7. Test thoroughly before submitting

### **Code Standards**
- Use ES6+ features and modules
- Follow existing naming conventions
- Implement proper error handling
- Add input validation for all endpoints
- Include rate limiting for public endpoints
- Document new API endpoints in Swagger

### **Submission Process**
1. Commit changes: `git commit -m 'Add amazing feature'`
2. Push to branch: `git push origin feature/amazing-feature`
3. Open a Pull Request

## Troubleshooting

### **Common Issues**

#### Database Connection
```bash
# Check MongoDB status
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod
```

#### Environment Variables
```bash
# Verify .env file exists and has correct permissions
ls -la .env
cat .env
```

#### Port Conflicts
```bash
# Check if port 8000 is in use
lsof -i :8000

# Kill process using port 8000
kill -9 $(lsof -t -i:8000)
```

#### Cloudinary Issues
- Verify API credentials in `.env`
- Check Cloudinary dashboard for usage limits
- Ensure proper CORS settings

### **Logging**
The application uses Morgan for HTTP request logging. Check console output for detailed request information and error messages.

### **Debug Mode**
Enable debug mode by setting:
```env
NODE_ENV=development
DEBUG=*
```

## License

This project is licensed under the **GNU General Public License v3.0** - see the [LICENSE](LICENSE) file for details.

## Support

For issues, questions, or contributions, please:
1. Check the existing documentation
2. Search through GitHub issues
3. Create a new issue with detailed information
4. Include error logs and environment details

---

**Built with ❤️ for children's healthcare and parental peace of mind.**
