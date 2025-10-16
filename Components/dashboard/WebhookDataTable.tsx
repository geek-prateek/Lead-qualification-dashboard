'use client';

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  Phone, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';

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

interface WebhookDataTableProps {
  data: WebhookData[];
  onRefresh: () => void;
}

export default function WebhookDataTable({ data, onRefresh }: WebhookDataTableProps) {
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof WebhookData>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filter, setFilter] = useState('');

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredData = sortedData.filter(item => 
    JSON.stringify(item).toLowerCase().includes(filter.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'in_progress':
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const exportData = () => {
    const csvContent = [
      ['Timestamp', 'Call ID', 'Status', 'Duration', 'Caller', 'Agent'].join(','),
      ...data.map(item => [
        format(new Date(item.timestamp), 'yyyy-MM-dd HH:mm:ss'),
        item.call_id || 'N/A',
        item.status || 'N/A',
        formatDuration(item.duration || 0),
        item.caller_number || 'N/A',
        item.agent_name || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bolna-webhook-data-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search webhook data..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Button onClick={onRefresh} variant="outline" size="sm">
            Refresh
          </Button>
        </div>
        <Button onClick={exportData} variant="outline" size="sm" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Call ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Caller
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {format(new Date(item.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {item.call_id || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(item.status || 'unknown')}
                      <span className="capitalize">{item.status || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {formatDuration(item.duration || 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {item.caller_number || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {item.agent_name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedRow(selectedRow === item.id ? null : item.id)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedRow && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-6">
            {(() => {
              const selectedData = data.find(item => item.id === selectedRow);
              if (!selectedData) return null;
              
              return (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Webhook Data Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Extracted Data</h4>
                      <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-auto max-h-40">
                        {JSON.stringify(selectedData.extracted_data, null, 2)}
                      </pre>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Context Details</h4>
                      <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-auto max-h-40">
                        {JSON.stringify(selectedData.context_details, null, 2)}
                      </pre>
                    </div>
                  </div>

                  {selectedData.conversation_transcript && (
                    <div>
                      <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Conversation Transcript</h4>
                      <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm max-h-40 overflow-auto">
                        {selectedData.conversation_transcript}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Raw Data</h4>
                    <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-auto max-h-60">
                      {JSON.stringify(selectedData, null, 2)}
                    </pre>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {filteredData.length === 0 && (
          <div className="text-center py-8">
            <Phone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {filter ? 'No webhook data matches your search.' : 'No webhook data received yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
