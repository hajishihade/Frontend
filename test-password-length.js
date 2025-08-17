// Test password length requirement
const API_BASE = 'http://localhost:3002/api/v1';

async function testPasswordLength() {
  console.log('Testing password length requirements...\n');
  
  const timestamp = Date.now();
  
  // Test with 6 character password
  console.log('1. Testing with 6 character password (Test1!)...');
  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: `user6char${timestamp}`,
        email: `user6char${timestamp}@example.com`,
        password: 'Test1!',  // 6 characters
        firstName: 'Test',
        lastName: 'User'
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ SUCCESS: 6 character password accepted!');
    } else {
      console.log('❌ FAILED: 6 character password rejected');
      console.log('Error:', data.error.message);
      if (data.error.details?.fields?.password) {
        console.log('Password error:', data.error.details.fields.password[0]);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  // Test with 12 character password
  console.log('\n2. Testing with 12 character password (TestPass123!)...');
  const timestamp2 = Date.now();
  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: `user12char${timestamp2}`,
        email: `user12char${timestamp2}@example.com`,
        password: 'TestPass123!',  // 12 characters
        firstName: 'Test',
        lastName: 'User'
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ SUCCESS: 12 character password accepted!');
    } else {
      console.log('❌ FAILED: 12 character password rejected');
      console.log('Error:', data.error.message);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  console.log('\n=== RESULT ===');
  console.log('The backend currently requires 12 characters minimum.');
  console.log('The frontend validation says 6 characters.');
  console.log('This mismatch needs to be fixed!');
}

testPasswordLength();