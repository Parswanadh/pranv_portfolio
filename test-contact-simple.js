// Simple test for contact form API
const https = require('https');

function makeRequest(method, url, data) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: url,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(data))
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: body
        });
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify(data));
    req.end();
  });
}

async function testContactForm() {
  console.log('Testing contact form API...');

  // Test 1: Empty form submission
  console.log('\n1. Testing empty form submission...');
  try {
    const response = await makeRequest('POST', '/api/contact', {
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    console.log('Empty form response:', response.body);
    console.log('Status:', response.status);
  } catch (error) {
    console.error('Empty form error:', error.message);
  }

  // Test 2: Valid form submission
  console.log('\n2. Testing valid form submission...');
  try {
    const response = await makeRequest('POST', '/api/contact', {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Job Opportunity',
      message: 'This is a test message to see if the contact form works.'
    });
    console.log('Valid form response:', response.body);
    console.log('Status:', response.status);
  } catch (error) {
    console.error('Valid form error:', error.message);
  }
}

testContactForm().catch(console.error);