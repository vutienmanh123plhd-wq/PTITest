# PTIT Online Quiz System - Backend

A Node.js/Express backend server for the PTIT Online Quiz System with MySQL database.

## 📋 Table of Contents

- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [Database Setup](#database-setup)
- [API Documentation](#api-documentation)
- [Testing with Postman](#testing-with-postman)

## 🏗️ Project Structure

```
backend/
├── config/                 # Configuration files
│   └── database.js        # MySQL connection configuration
├── controllers/           # Business logic for each resource
│   ├── auth.controller.js
│   ├── exam.controller.js
│   ├── result.controller.js
│   └── admin/             # Admin-specific controllers
│       ├── auth.controller.js
│       ├── user.controller.js
│       ├── exam.controller.js
│       ├── statistics.controller.js
│       └── result.controller.js
├── routes/               # API route definitions
│   ├── auth.routes.js
│   ├── exam.routes.js
│   ├── result.routes.js
│   └── admin/            # Admin routes
│       ├── auth.routes.js
│       ├── user.routes.js
│       ├── exam.routes.js
│       ├── statistics.routes.js
│       └── result.routes.js
├── middleware/           # Custom middleware
│   ├── auth.js          # JWT authentication
│   ├── errorHandler.js  # Global error handling
│   └── validation.js    # Request validation with Joi
├── scripts/             # Utility scripts
│   └── initializeDatabase.js
├── .env.example         # Environment variables template
├── server.js            # Main server file
└── package.json         # Dependencies and scripts
```

## 🚀 Installation

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### Steps

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Update .env with your database credentials**
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=pti_quiz_system
   PORT=5000
   JWT_SECRET=your_super_secret_key_here
   ```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=pti_quiz_system

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_secret_key_change_in_production
JWT_EXPIRATION=24h
ADMIN_JWT_EXPIRATION=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads
```

## 🗄️ Database Setup

### 1. Create MySQL Database

```sql
CREATE DATABASE IF NOT EXISTS pti_quiz_system;
```

### 2. Initialize Database Tables and Sample Data

```bash
npm run migrate
```

Or manually:

```bash
node scripts/initializeDatabase.js
```

This will:
- Create all necessary tables
- Create default admin account (username: `admin`, password: `admin123`)
- Create sample exam with questions

## ▶️ Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

### Health Check
```bash
curl http://localhost:5000/api/health
```

## 📚 API Documentation

### Complete API Specification

See [API_DESIGN.md](../API_DESIGN.md) for detailed API documentation including:

- Authentication endpoints
- Student exam endpoints
- Student result endpoints
- Admin authentication
- Admin user management
- Admin exam management
- Admin statistics and reporting

### Base URL
```
http://localhost:5000/api
```

### Authentication

Most endpoints require JWT token in the Authorization header:

```
Authorization: Bearer {your_jwt_token}
```

### Default Admin Account

After database initialization:
- **Username**: admin
- **Password**: admin123

**⚠️ Change this password immediately in production!**

## 🧪 Testing with Postman

### 1. Import API Collection

1. Open Postman and click "Import"
2. Select the API collection file (if provided)
3. Or create requests manually following the API_DESIGN.md documentation

### 2. Set Environment Variables

Create a Postman environment with:
```json
{
  "base_url": "http://localhost:5000/api",
  "student_token": "",
  "admin_token": "",
  "exam_id": 1,
  "user_id": 1
}
```

### 3. Sample API Calls

#### Students Login
```http
POST {{base_url}}/auth/login
Content-Type: application/json

{
  "username": "student_username",
  "password": "password123"
}
```

#### Admin Login
```http
POST {{base_url}}/admin/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

#### Get All Exams
```http
GET {{base_url}}/exams
```

#### Submit Exam
```http
POST {{base_url}}/exams/1/submit
Authorization: Bearer {{student_token}}
Content-Type: application/json

{
  "answers": [
    {
      "question_id": 1,
      "selected_option_id": 2
    },
    {
      "question_id": 2,
      "selected_option_id": 3
    }
  ]
}
```

#### Get Student Results
```http
GET {{base_url}}/results
Authorization: Bearer {{student_token}}
```

#### Admin - Get All Users
```http
GET {{base_url}}/admin/users
Authorization: Bearer {{admin_token}}
```

#### Admin - Get Dashboard
```http
GET {{base_url}}/admin/statistics/dashboard
Authorization: Bearer {{admin_token}}
```

## 📝 Common Operations

### Create New Admin User

```bash
curl -X POST http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newadmin",
    "email": "newadmin@pti.edu.vn",
    "password": "password123",
    "full_name": "New Admin"
  }'
```

### Create New Exam

```bash
curl -X POST http://localhost:5000/api/admin/exams \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Midterm Exam",
    "description": "Midterm examination",
    "type": "midterm",
    "status": "available",
    "duration": 90,
    "questions": [
      {
        "question": "Question 1?",
        "options": [
          {"option_text": "Option A", "is_correct": false},
          {"option_text": "Option B", "is_correct": true},
          {"option_text": "Option C", "is_correct": false},
          {"option_text": "Option D", "is_correct": false}
        ]
      }
    ]
  }'
```

### Import Exam from Excel

```bash
curl -X POST http://localhost:5000/api/admin/exams/1/import \
  -H "Authorization: Bearer {admin_token}" \
  -F "file=@exam.xlsx" \
  -F "name=Imported Exam" \
  -F "description=Exam imported from file" \
  -F "type=practice" \
  -F "status=available" \
  -F "duration=60"
```

### Export Statistics to Excel

```bash
curl -X GET "http://localhost:5000/api/admin/statistics/export?format=excel" \
  -H "Authorization: Bearer {admin_token}" \
  -o statistics.xlsx
```

## 🔧 Troubleshooting

### Database Connection Error

- Check MySQL is running
- Verify credentials in .env file
- Ensure database server is accessible on configured host/port

### JWT Token Error

- Verify JWT_SECRET in .env matches between auth and verification
- Check token expiration time
- Ensure Authorization header format: `Bearer {token}`

### Port Already in Use

Change PORT in .env or kill the process using the port:

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID {PID} /F

# Linux/Mac
lsof -i :5000
kill -9 {PID}
```

### CORS Error

Check CORS_ORIGIN in .env matches your frontend URL

## 📦 Dependencies

Main dependencies:
- **express**: Web framework
- **mysql2**: MySQL database driver
- **jsonwebtoken**: JWT authentication
- **bcryptjs**: Password hashing
- **joi**: Request validation
- **multer**: File upload handling
- **xlsx**: Excel file processing
- **pdfkit**: PDF generation
- **cors**: CORS middleware
- **helmet**: Security headers
- **morgan**: HTTP request logging

Development dependencies:
- **nodemon**: Auto-reload during development
- **jest**: Testing framework

## 🚀 Deployment

### Before Deployment

1. Change all default passwords
2. Update JWT_SECRET with a secure random string
3. Set NODE_ENV=production
4. Configure proper database backups
5. Use HTTPS in production
6. Implement rate limiting
7. Add request logging and monitoring

### Recommended Hosting

- AWS EC2 / RDS
- DigitalOcean
- Heroku
- Azure App Service
- Google Cloud Platform

## 📄 License

ISC

## 👥 Author

PTIT Team

## 📞 Support

For issues and questions, please contact the development team.
