// Manual test for contact form
console.log('Contact Form Test Results');
console.log('==========================');

// Test 1: Check if contact page loads
console.log('\n1. Contact Page Access:');
try {
  const response = await fetch('http://localhost:3000/contact');
  console.log('Status:', response.status, response.status === 200 ? '✅' : '❌');
} catch (error) {
  console.log('Error:', error.message, '❌');
}

// Test 2: Check if API endpoint exists
console.log('\n2. API Endpoint Access:');
try {
  const response = await fetch('http://localhost:3000/api/contact', {
    method: 'OPTIONS'
  });
  console.log('OPTIONS Status:', response.status, response.status === 200 ? '✅' : '❌');
} catch (error) {
  console.log('Error:', error.message, '❌');
}

// Test 3: Test form submission with invalid data
console.log('\n3. Invalid Form Submission:');
try {
  const response = await fetch('http://localhost:3000/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: '',
      email: 'invalid',
      subject: '',
      message: ''
    })
  });
  console.log('Status:', response.status);
  const data = await response.text();
  console.log('Response length:', data.length);
  console.log('Has error:', data.includes('error') ? '✅' : '❌');
} catch (error) {
  console.log('Error:', error.message, '❌');
}

// Test 4: Test form submission with valid data
console.log('\n4. Valid Form Submission:');
try {
  const response = await fetch('http://localhost:3000/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'This is a test message.'
    })
  });
  console.log('Status:', response.status);
  const data = await response.text();
  console.log('Response length:', data.length);
  console.log('Has success:', data.includes('success') ? '✅' : '❌');
} catch (error) {
  console.log('Error:', error.message, '❌');
}

// Test 5: Check honeypot protection
console.log('\n5. Honeypot Protection:');
try {
  const response = await fetch('http://localhost:3000/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Spammer',
      email: 'spammer@example.com',
      subject: 'Spam',
      message: 'Spam message',
      honeypot: 'not empty'
    })
  });
  console.log('Status:', response.status);
  const data = await response.text();
  console.log('Response length:', data.length);
  console.log('Bot response (should be success):', data.includes('success') ? '✅' : '❌');
} catch (error) {
  console.log('Error:', error.message, '❌');
}

console.log('\nTest Summary:');
console.log('- If API endpoints return 500, there are server-side errors');
console.log('- If API endpoints return HTML instead of JSON, there are compilation errors');
console.log('- Contact page should return 200 for proper functionality');