// Test script for contact form
const FormData = require('form-data');
const fetch = require('node-fetch');

async function testContactForm() {
  console.log('Testing contact form...');

  // Test 1: Empty form submission
  console.log('\n1. Testing empty form submission...');
  try {
    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
    });
    const data = await response.json();
    console.log('Empty form response:', data);
    console.log('Status:', response.status);
  } catch (error) {
    console.error('Empty form error:', error.message);
  }

  // Test 2: Invalid email
  console.log('\n2. Testing invalid email...');
  try {
    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'invalid-email',
        subject: 'Test',
        message: 'This is a test message'
      })
    });
    const data = await response.json();
    console.log('Invalid email response:', data);
    console.log('Status:', response.status);
  } catch (error) {
    console.error('Invalid email error:', error.message);
  }

  // Test 3: Valid form submission
  console.log('\n3. Testing valid form submission...');
  try {
    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Job Opportunity',
        message: 'This is a test message to see if the contact form works.'
      })
    });
    const data = await response.json();
    console.log('Valid form response:', data);
    console.log('Status:', response.status);
  } catch (error) {
    console.error('Valid form error:', error.message);
  }

  // Test 4: Honeypot field triggered
  console.log('\n4. Testing honeypot field...');
  try {
    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Spammer',
        email: 'spammer@example.com',
        subject: 'Spam',
        message: 'This is spam',
        honeypot: 'not empty'
      })
    });
    const data = await response.json();
    console.log('Honeypot response:', data);
    console.log('Status:', response.status);
  } catch (error) {
    console.error('Honeypot error:', error.message);
  }
}

testContactForm().catch(console.error);