# Certificate Verification Backend - Authentication System

## 🔐 Complete Authentication System

This backend now includes a complete authentication system with user registration, login, and JWT token-based authorization.

## 🚀 Quick Setup

### 1. Environment Setup
```bash
# Run the setup script
node setup.js

# Or manually create .env file
cp config/env.example .env
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start MongoDB
Make sure MongoDB is running on your system.

### 4. Start the Backend
```bash
npm run dev
```

## 📋 API Endpoints

### Authentication Endpoints

#### POST `/api/auth/signup`
Register a new user
```json
{
  "username": "testuser",
  "password": "testpass123",
  "email": "test@example.com"
}
```

#### POST `/api/auth/login`
Login with username and password
```json
{
  "username": "admin",
  "password": "admin123"
}
```

#### GET `/api/auth/verify`
Verify JWT token (requires Authorization header)
```
Authorization: Bearer <your_jwt_token>
```

#### POST `/api/auth/logout`
Logout (requires Authorization header)

### Certificate Verification Endpoints

#### POST `/api/certificates/verify`
Verify a certificate (requires authentication)
- Content-Type: multipart/form-data
- Field: `certificate` (image file)
- Query: `certificateType` (optional)

#### GET `/api/certificates/history`
Get verification history (requires authentication)
- Query params: `page`, `limit`, `type`, `verified`

## 🔑 Authentication Flow

1. **User Registration/Login**: User signs up or logs in
2. **Token Generation**: Server returns JWT token
3. **Protected Requests**: Include token in Authorization header
4. **Token Verification**: Middleware validates token on protected routes

## 👥 User Roles

- **admin**: Full access to all endpoints
- **user**: Standard user access

## 🛡️ Security Features

- Password hashing with bcrypt
- JWT token authentication
- Token expiration (12 hours)
- Input validation
- File upload security
- CORS protection

## 🧪 Testing

Run the authentication test suite:
```bash
node test_auth.js
```

## 🔧 Environment Variables

```env
# Database
MONGO_DB=mongodb://localhost:27017/certificate-verification

# JWT
JWT_SECRET=your_super_secret_jwt_key

# Admin Credentials
ADMIN_USER=admin
ADMIN_PASS=admin123

# Server
PORT=3000

# OCR Service
PY_API_URL=http://localhost:8001
```

## 📊 Database Models

### User Model
- username (unique)
- email (unique)
- password (hashed)
- role (admin/user)
- isActive
- lastLogin
- timestamps

### VerifiedDatabase Model
- id
- fetchedFrom
- verified
- refid
- attachments
- content

### UsableDatabase Model
- id
- institute
- type
- year
- attachments
- content
- verifiedStatus
- timestamps

## 🔄 Integration with OCR Service

The backend integrates with the Python OCR service:

1. User uploads certificate
2. Backend calls OCR service
3. OCR service performs verification
4. Backend checks verified database
5. Results stored in usable database

## 🚨 Error Handling

All endpoints return consistent error responses:
```json
{
  "success": false,
  "message": "Error description",
  "data": null
}
```

## 📝 Usage Examples

### Frontend Integration
```javascript
// Login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'admin123' })
});
const { data } = await loginResponse.json();
const token = data.token;

// Verify Certificate
const formData = new FormData();
formData.append('certificate', fileInput.files[0]);

const verifyResponse = await fetch('/api/certificates/verify', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});
```

## 🎯 Next Steps

1. Start the backend: `npm run dev`
2. Start the OCR service: `python OCR/start_service.py`
3. Test the authentication: `node test_auth.js`
4. Integrate with your frontend

The authentication system is now complete and ready for production use!
