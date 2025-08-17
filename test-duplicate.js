// Test duplicate registration
const API_BASE = 'http://localhost:3002/api/v1';

async function testDuplicate() {
  console.log('Testing duplicate username registration...\n');
  
  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'testuser',  // This already exists
        email: 'newemail@example.com',
        password: 'TestPassword123!@#',
        firstName: 'Test',
        lastName: 'User'
      })
    });
    
    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testDuplicate();