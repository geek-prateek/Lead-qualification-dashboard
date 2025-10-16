'use client';

import React, { useState, useEffect } from 'react';
import { 
  Copy, 
  Check, 
  ExternalLink,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function WebhookEndpoint() {
  const [copied, setCopied] = useState(false);
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    // Get the current URL for the webhook endpoint
    const url = typeof window !== 'undefined' ? window.location.origin : '';
    setBaseUrl(url);
  }, []);

  const webhookUrl = `${baseUrl}/api/webhook`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const webhookExample = {
    "call_id": "call_123456789",
    "status": "completed",
    "duration": 120,
    "caller_number": "+1234567890",
    "agent_name": "AI Agent",
    "extracted_data": {
      "customer_name": "John Doe",
      "email": "john@example.com",
      "intent": "support_request"
    },
    "context_details": {
      "language": "en",
      "confidence": 0.95
    },
    "conversation_transcript": "Customer: Hello, I need help with my order..."
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle className="w-5 h-5 text-green-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Webhook Endpoint Configuration
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your Webhook URL
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={webhookUrl}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button
              onClick={copyToClipboard}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                How to configure this webhook in Bolna AI:
              </h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
                <li>Copy the webhook URL above</li>
                <li>Go to your Bolna AI agent settings</li>
                <li>Add the URL to the <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">webhook_url</code> field</li>
                <li>Save your agent configuration</li>
                <li>Bolna will automatically send POST requests to this endpoint</li>
              </ol>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
            Expected Webhook Payload Format
          </h4>
          <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-sm overflow-auto">
            {JSON.stringify(webhookExample, null, 2)}
          </pre>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
                Webhook Features:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-green-800 dark:text-green-200">
                <li>Real-time call data reception</li>
                <li>Automatic data persistence</li>
                <li>Call status updates</li>
                <li>Extracted data and conversation transcripts</li>
                <li>Context details and metadata</li>
                <li>Dashboard visualization</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
