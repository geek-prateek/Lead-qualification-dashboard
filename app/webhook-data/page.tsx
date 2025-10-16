'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import WebhookDataTable from '@/components/dashboard/WebhookDataTable';

interface WebhookData {
  id: string;
  timestamp: string;
  call_id?: string;
  status?: string;
  extracted_data?: any;
  context_details?: any;
  conversation_transcript?: string;
  duration?: number;
  caller_number?: string;
  agent_name?: string;
  [key: string]: any;
}

export default function WebhookDataPage() {
  const [webhookData, setWebhookData] = useState<WebhookData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWebhookData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/webhook');
      const result = await response.json();
      
      if (result.success) {
        setWebhookData(result.data || []);
      } else {
        setError('Failed to fetch webhook data');
      }
    } catch (err) {
      setError('Error connecting to webhook API');
      console.error('Error fetching webhook data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebhookData();
    
    // Set up polling to refresh data every 10 seconds for more frequent updates
    const interval = setInterval(fetchWebhookData, 10000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Webhook Data
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Complete view of all webhook data received from Bolna AI
            </p>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {webhookData.length} total records
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-red-800 dark:text-red-200">{error}</span>
            </div>
          </div>
        )}

        {!loading && !error && (
          <WebhookDataTable 
            data={webhookData} 
            onRefresh={fetchWebhookData}
          />
        )}
      </div>
    </Layout>
  );
}
