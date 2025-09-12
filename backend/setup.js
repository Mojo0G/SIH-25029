#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Setting up Certificate Verification Backend...\n');

// Check if .env exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, 'config', 'env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file...');
  
  if (fs.existsSync(envExamplePath)) {
    const envContent = fs.readFileSync(envExamplePath, 'utf8');
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created from template');
  } else {
    // Create basic .env file
    const basicEnv = `# Database Configuration
MONGO_DB=mongodb://localhost:27017/certificate-verification

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Admin Credentials
ADMIN_USER=admin
ADMIN_PASS=admin123

# Server Configuration
PORT=3000

# Python API Configuration
PY_API_URL=http://localhost:8001

# Certificates Directory
CERTIFICATES_DIR=./certificates
`;
    fs.writeFileSync(envPath, basicEnv);
    console.log('✅ Basic .env file created');
  }
} else {
  console.log('✅ .env file already exists');
}

// Create certificates directory
const certDir = path.join(__dirname, 'certificates');
if (!fs.existsSync(certDir)) {
  fs.mkdirSync(certDir, { recursive: true });
  console.log('✅ Certificates directory created');
} else {
  console.log('✅ Certificates directory already exists');
}

console.log('\n🎉 Setup completed!');
console.log('\n📋 Next steps:');
console.log('1. Update .env file with your MongoDB connection string');
console.log('2. Install dependencies: npm install');
console.log('3. Start MongoDB service');
console.log('4. Start the backend: npm run dev');
console.log('5. Start the OCR service: python OCR/start_service.py');
console.log('\n🔗 API Endpoints:');
console.log('- POST /api/auth/login - User login');
console.log('- POST /api/auth/signup - User registration');
console.log('- GET /api/auth/verify - Verify token');
console.log('- POST /api/certificates/verify - Verify certificate');
console.log('- GET /api/certificates/history - Get verification history');
console.log('\n📚 Documentation: http://localhost:3000/api/auth (after starting server)');
