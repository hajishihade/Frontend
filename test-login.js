// Test login script
const API_BASE = 'http://localhost:3002/api/v1';

async function testLogin() {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emailOrUsername: 'testuser',
        password: 'TestPassword123!@#'
      })
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('✅ Login successful!');
      console.log('Token:', data.data.token);
      console.log('User:', data.data.user);
    } else {
      console.log('❌ Login failed:', data.error.message);
    }
  } catch (error) {
    console.error('❌ Fetch error:', error);
  }
}

testLogin();