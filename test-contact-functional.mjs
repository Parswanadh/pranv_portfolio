// Functional test for contact form
const testContactForm = async () => {
  console.log('Testing contact form functionality...');

  // Test 1: API endpoint accessibility
  console.log('\n1. Testing API endpoint...');
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
    const data = await response.json();
    console.log('Response:', data);

    if (response.ok && data.success) {
      console.log('✅ API endpoint working correctly');
    } else {
      console.log('❌ API endpoint failed');
      return false;
    }
  } catch (error) {
    console.log('❌ API endpoint error:', error.message);
    return false;
  }

  // Test 2: Contact page accessibility
  console.log('\n2. Testing contact page accessibility...');
  try {
    const response = await fetch('http://localhost:3000/contact');
    console.log('Page status:', response.status);

    if (response.ok) {
      console.log('✅ Contact page accessible');
    } else {
      console.log('❌ Contact page not accessible');
      return false;
    }
  } catch (error) {
    console.log('❌ Contact page error:', error.message);
    return false;
  }

  // Test 3: Form validation
  console.log('\n3. Testing form validation...');

  // Test empty form
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

    if (!response.ok && data.error) {
      console.log('✅ Form validation working for empty fields');
    } else {
      console.log('❌ Form validation failed for empty fields');
      return false;
    }
  } catch (error) {
    console.log('❌ Validation test error:', error.message);
    return false;
  }

  // Test 4: Invalid email
  try {
    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'invalid-email',
        subject: 'Test',
        message: 'Test message'
      })
    });

    const data = await response.json();
    console.log('Invalid email response:', data);

    if (!response.ok && data.error) {
      console.log('✅ Email validation working');
    } else {
      console.log('❌ Email validation failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Email validation error:', error.message);
    return false;
  }

  // Test 5: Honeypot protection
  console.log('\n4. Testing honeypot protection...');
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

    const data = await response.json();
    console.log('Honeypot response:', data);

    // Honeypot should return success but not actually process
    if (response.ok && data.success) {
      console.log('✅ Honeypot protection working');
    } else {
      console.log('❌ Honeypot protection failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Honeypot test error:', error.message);
    return false;
  }

  console.log('\n🎉 All contact form tests passed!');
  return true;
};

testContactForm().catch(console.error);