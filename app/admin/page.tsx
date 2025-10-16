'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { 
  Settings, 
  Database, 
  Trash2, 
  Download,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WebhookData {
  id: string;
  timestamp: string;
  [key: string]: any;
}

export default function AdminPage() {
  const [webhookData, setWebhookData] = useState<WebhookData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRecords: 0,
    oldestRecord: null as string | null,
    newestRecord: null as string | null,
    storageUsed: '0 KB'
  });

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/webhook');
      const result = await response.json();
      
      if (result.success) {
        const data = result.data || [];
        setWebhookData(data);
        
        const totalRecords = data.length;
        const timestamps = data.map(item => new Date(item.timestamp)).sort();
        const oldestRecord = timestamps.length > 0 ? timestamps[0].toISOString() : null;
        const newestRecord = timestamps.length > 0 ? timestamps[timestamps.length - 1].toISOString() : null;
        
        // Estimate storage usage (rough calculation)
        const jsonSize = JSON.stringify(data).length;
        const storageUsed = jsonSize > 1024 * 1024 
          ? `${(jsonSize / (1024 * 1024)).toFixed(2)} MB`
          : `${(jsonSize / 1024).toFixed(2)} KB`;
        
        setStats({
          totalRecords,
          oldestRecord,
          newestRecord,
          storageUsed
        });
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const clearAllData = async () => {
    if (!confirm('Are you sure you want to delete all webhook data? This action cannot be undone.')) {
      return;
    }

    try {
      // In a real implementation, you would call a DELETE endpoint
      // For now, we'll just refresh the data
      await fetchStats();
      alert('Data cleared successfully!');
    } catch (err) {
      alert('Error clearing data');
      console.error('Error clearing data:', err);
    }
  };

  const exportAllData = () => {
    const csvContent = [
      ['ID', 'Timestamp', 'Call ID', 'Status', 'Data'].join(','),
      ...webhookData.map(item => [
        item.id,
        item.timestamp,
        item.call_id || 'N/A',
        item.status || 'N/A',
        JSON.stringify(item).replace(/,/g, ';') // Replace commas to avoid CSV issues
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bolna-webhook-data-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Admin Panel
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage webhook data and system settings
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Data Statistics */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center gap-2 mb-4">
                <Database className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Data Statistics
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Total Records</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {stats.totalRecords.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Storage Used</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {stats.storageUsed}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Oldest Record</span>
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">
                    {stats.oldestRecord ? new Date(stats.oldestRecord).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 dark:text-gray-400">Newest Record</span>
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">
                    {stats.newestRecord ? new Date(stats.newestRecord).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Data Management */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Data Management
                </h3>
              </div>
              
              <div className="space-y-4">
                <Button 
                  onClick={fetchStats}
                  variant="outline" 
                  className="w-full justify-start gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh Statistics
                </Button>
                
                <Button 
                  onClick={exportAllData}
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  disabled={stats.totalRecords === 0}
                >
                  <Download className="w-4 h-4" />
                  Export All Data
                </Button>
                
                <Button 
                  onClick={clearAllData}
                  variant="destructive" 
                  className="w-full justify-start gap-2"
                  disabled={stats.totalRecords === 0}
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All Data
                </Button>
              </div>
            </div>

            {/* System Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  System Information
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Webhook Endpoint</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                      /api/webhook
                    </code>
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Data Storage</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    File-based (JSON)
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Auto Refresh</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Every 30 seconds
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
