'use client';

import React from 'react';
import { 
  Phone, 
  Clock, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  Users,
  Activity
} from 'lucide-react';

interface WebhookData {
  id: string;
  timestamp: string;
  status?: string;
  duration?: number;
  caller_number?: string;
  agent_name?: string;
  [key: string]: any;
}

interface DashboardStatsProps {
  data: WebhookData[];
}

export default function DashboardStats({ data }: DashboardStatsProps) {
  const totalCalls = data.length;
  const completedCalls = data.filter(item => item.status?.toLowerCase() === 'completed').length;
  const failedCalls = data.filter(item => 
    item.status?.toLowerCase() === 'failed' || 
    item.status?.toLowerCase() === 'error'
  ).length;
  const inProgressCalls = data.filter(item => 
    item.status?.toLowerCase() === 'in_progress' ||
    item.status?.toLowerCase() === 'processing'
  ).length;

  const totalDuration = data.reduce((sum, item) => sum + (item.duration || 0), 0);
  const averageDuration = totalCalls > 0 ? Math.round(totalDuration / totalCalls) : 0;

  const uniqueCallers = new Set(data.map(item => item.caller_number).filter(Boolean)).size;
  const uniqueAgents = new Set(data.map(item => item.agent_name).filter(Boolean)).size;

  const formatDuration = (seconds: number) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const stats = [
    {
      title: 'Total Calls',
      value: totalCalls.toLocaleString(),
      icon: Phone,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      change: null
    },
    {
      title: 'Completed',
      value: completedCalls.toLocaleString(),
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      change: totalCalls > 0 ? Math.round((completedCalls / totalCalls) * 100) : 0
    },
    {
      title: 'Failed',
      value: failedCalls.toLocaleString(),
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900/20',
      change: totalCalls > 0 ? Math.round((failedCalls / totalCalls) * 100) : 0
    },
    {
      title: 'In Progress',
      value: inProgressCalls.toLocaleString(),
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
      change: totalCalls > 0 ? Math.round((inProgressCalls / totalCalls) * 100) : 0
    },
    {
      title: 'Avg Duration',
      value: formatDuration(averageDuration),
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      change: null
    },
    {
      title: 'Unique Callers',
      value: uniqueCallers.toLocaleString(),
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/20',
      change: null
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
              {stat.change !== null && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {stat.change}% of total
                </p>
              )}
            </div>
            <div className={`p-3 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
