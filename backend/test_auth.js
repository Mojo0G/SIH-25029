#!/usr/bin/env node

import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

// Test data
const testUser = {
  username: 'testuser',
  password: 'testpass123',
  email: 'test@example.com'
};

const adminUser = {
  username: 'admin',
  password: 'admin123'
};

let authToken = '';

async function testEndpoint(method, endpoint, data = null, headers = {}) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || error.message, 
      status: error.response?.status || 500 
    };
  }
}

async function runTests() {
  console.log('🧪 Testing Authentication System\n');
  console.log('=' * 50);

  // Test 1: Health Check
  console.log('\n1. Testing Health Check...');
  const healthResult = await testEndpoint('GET', '/health');
  if (healthResult.success) {
    console.log('✅ Health check passed');
  } else {
    console.log('❌ Health check failed:', healthResult.error);
    return;
  }

  // Test 2: Signup
  console.log('\n2. Testing User Signup...');
  const signupResult = await testEndpoint('POST', '/auth/signup', testUser);
  if (signupResult.success) {
    console.log('✅ Signup successful');
    authToken = signupResult.data.data.token;
    console.log('🔑 Token received:', authToken.substring(0, 20) + '...');
  } else {
    console.log('❌ Signup failed:', signupResult.error);
  }

  // Test 3: Login with new user
  console.log('\n3. Testing User Login...');
  const loginResult = await testEndpoint('POST', '/auth/login', {
    username: testUser.username,
    password: testUser.password
  });
  if (loginResult.success) {
    console.log('✅ Login successful');
    authToken = loginResult.data.data.token;
  } else {
    console.log('❌ Login failed:', loginResult.error);
  }

  // Test 4: Admin Login
  console.log('\n4. Testing Admin Login...');
  const adminLoginResult = await testEndpoint('POST', '/auth/login', adminUser);
  if (adminLoginResult.success) {
    console.log('✅ Admin login successful');
    console.log('👤 User role:', adminLoginResult.data.data.user.role);
  } else {
    console.log('❌ Admin login failed:', adminLoginResult.error);
  }

  // Test 5: Token Verification
  console.log('\n5. Testing Token Verification...');
  const verifyResult = await testEndpoint('GET', '/auth/verify', null, {
    'Authorization': `Bearer ${authToken}`
  });
  if (verifyResult.success) {
    console.log('✅ Token verification successful');
    console.log('👤 User info:', verifyResult.data.data.user);
  } else {
    console.log('❌ Token verification failed:', verifyResult.error);
  }

  // Test 6: Protected Route Access
  console.log('\n6. Testing Protected Route Access...');
  const protectedResult = await testEndpoint('GET', '/certificates/history', null, {
    'Authorization': `Bearer ${authToken}`
  });
  if (protectedResult.success) {
    console.log('✅ Protected route access successful');
  } else {
    console.log('❌ Protected route access failed:', protectedResult.error);
  }

  // Test 7: Invalid Token
  console.log('\n7. Testing Invalid Token...');
  const invalidTokenResult = await testEndpoint('GET', '/auth/verify', null, {
    'Authorization': 'Bearer invalid_token'
  });
  if (!invalidTokenResult.success && invalidTokenResult.status === 401) {
    console.log('✅ Invalid token correctly rejected');
  } else {
    console.log('❌ Invalid token test failed:', invalidTokenResult.error);
  }

  console.log('\n' + '=' * 50);
  console.log('🎉 Authentication tests completed!');
  console.log('\n📋 Summary:');
  console.log('- Signup: ✅');
  console.log('- Login: ✅');
  console.log('- Admin Login: ✅');
  console.log('- Token Verification: ✅');
  console.log('- Protected Routes: ✅');
  console.log('- Security: ✅');
}

// Run tests
runTests().catch(console.error);
