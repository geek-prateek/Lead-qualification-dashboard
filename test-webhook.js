// Test script for Bolna AI webhook
const testWebhook = async () => {
  const webhookUrl = 'http://localhost:3000/api/webhook';
  
  const testData = {
    call_id: `test_${Date.now()}`,
    status: 'completed',
    duration: 120,
    caller_number: '+1234567890',
    agent_name: 'Test AI Agent',
    extracted_data: {
      customer_name: 'John Doe',
      email: 'john@example.com',
      intent: 'support_request',
      sentiment: 'positive'
    },
    context_details: {
      language: 'en',
      confidence: 0.95,
      call_type: 'inbound'
    },
    conversation_transcript: `Customer: Hello, I need help with my order.
Agent: Hi! I'd be happy to help you with your order. Could you please provide your order number?
Customer: Sure, it's ORD-12345.
Agent: Thank you. Let me look that up for you. I can see your order was shipped yesterday and should arrive within 2-3 business days.
Customer: Great! Thank you for your help.
Agent: You're welcome! Is there anything else I can help you with today?`
  };

  try {
    console.log('Testing webhook endpoint...');
    console.log('URL:', webhookUrl);
    console.log('Data:', JSON.stringify(testData, null, 2));
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Webhook test successful!');
      console.log('Response:', result);
    } else {
      console.log('❌ Webhook test failed!');
      console.log('Status:', response.status);
      console.log('Response:', result);
    }
  } catch (error) {
    console.log('❌ Error testing webhook:', error.message);
    console.log('Make sure your Next.js server is running on http://localhost:3000');
  }
};

// Run the test
testWebhook();
