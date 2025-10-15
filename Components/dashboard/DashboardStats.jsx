import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, CheckCircle, XCircle, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardStats({ calls, isLoading }) {
  const stats = {
    total: calls.length,
    completed: calls.filter(c => c.call_status === "completed").length,
    failed: calls.filter(c => c.call_status === "failed").length,
    avgDuration: calls.length > 0 
      ? Math.round(calls.reduce((acc, c) => acc + (c.call_duration || 0), 0) / calls.length)
      : 0
  };

  const statCards = [
    {
      title: "Total Calls",
      value: stats.total,
      icon: Phone,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-500/10"
    },
    {
      title: "Failed",
      value: stats.failed,
      icon: XCircle,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-500/10"
    },
    {
      title: "Avg Duration",
      value: `${Math.floor(stats.avgDuration / 60)}m ${stats.avgDuration % 60}s`,
      icon: Clock,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-500/10"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <Card key={index} className="border-none shadow-lg bg-white dark:bg-[#141414] overflow-hidden group hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  {stat.title}
                </p>
                {isLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                )}
              </div>
              <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`w-6 h-6 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} style={{WebkitTextFillColor: 'transparent'}} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}