'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import DashboardStats from '@/components/dashboard/DashboardStats';
import WebhookEndpoint from '@/components/dashboard/WebhookEndpoint';

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

export default function Dashboard() {
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
    
    // Set up polling to refresh data every 30 seconds
    const interval = setInterval(fetchWebhookData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Bolna AI Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Real-time monitoring of webhook data from Bolna AI
            </p>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleTimeString()}
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
          <>
            <DashboardStats data={webhookData} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WebhookEndpoint />
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {webhookData.slice(0, 5).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          item.status === 'completed' ? 'bg-green-500' :
                          item.status === 'failed' ? 'bg-red-500' :
                          'bg-yellow-500'
                        }`}></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Call {item.call_id || item.id.slice(-8)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(item.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-900 dark:text-white capitalize">
                          {item.status || 'Unknown'}
                        </p>
                        {item.duration && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, '0')}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {webhookData.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400">
                        No webhook data received yet. Configure your webhook URL to start receiving data.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
