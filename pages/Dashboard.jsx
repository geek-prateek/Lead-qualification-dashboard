import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";

import DashboardStats from "../components/dashboard/DashboardStats";
import DashboardFilters from "../components/dashboard/DashboardFilters";
import CallsTable from "../components/dashboard/CallsTable";
import CallDetailsModal from "../components/dashboard/CallDetailsModal";
import AddCallModal from "../components/dashboard/AddCallModal";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [userAgents, setUserAgents] = useState([]);
  const [filters, setFilters] = useState({
    agent: "all",
    dateFrom: "",
    dateTo: "",
    intent: "all",
    status: "all"
  });
  const [selectedCall, setSelectedCall] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const currentUser = await base44.auth.me();
    setUser(currentUser);
    
    if (currentUser.role === "user") {
      const mappings = await base44.entities.UserAgentMapping.filter({
        user_email: currentUser.email
      });
      if (mappings.length > 0) {
        setUserAgents(mappings[0].agent_ids || []);
      }
    }
  };

  const { data: calls = [], isLoading, refetch } = useQuery({
    queryKey: ['calls'],
    queryFn: async () => {
      const allCalls = await base44.entities.CallRecord.list("-call_date");
      
      if (user?.role === "user" && userAgents.length > 0) {
        return allCalls.filter(call => userAgents.includes(call.agent_id));
      }
      
      return allCalls;
    },
    enabled: !!user
  });

  const filteredCalls = calls.filter(call => {
    if (filters.agent !== "all" && call.agent_id !== filters.agent) return false;
    if (filters.status !== "all" && call.call_status !== filters.status) return false;
    if (filters.intent !== "all" && call.intent !== filters.intent) return false;
    
    if (filters.dateFrom) {
      const callDate = new Date(call.call_date);
      const fromDate = new Date(filters.dateFrom);
      if (callDate < fromDate) return false;
    }
    
    if (filters.dateTo) {
      const callDate = new Date(call.call_date);
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59);
      if (callDate > toDate) return false;
    }
    
    return true;
  });

  const exportToCSV = () => {
    const headers = ['Date', 'Agent ID', 'Status', 'Intent', 'Duration', 'Customer', 'Summary'];
    const rows = filteredCalls.map(call => [
      new Date(call.call_date).toLocaleString(),
      call.agent_id,
      call.call_status,
      call.intent || '-',
      call.call_duration ? `${Math.round(call.call_duration / 60)}m` : '-',
      call.extracted_data?.customer_name || '-',
      call.summary?.substring(0, 100) || '-'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bolna-calls-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Call Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Monitor and analyze your AI call interactions
            </p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Button
              variant="outline"
              onClick={exportToCSV}
              disabled={filteredCalls.length === 0}
              className="flex-1 md:flex-none border-gray-300 dark:border-[#2a2a2a] hover:bg-gray-100 dark:hover:bg-[#1e1e1e] text-gray-700 dark:text-gray-300"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            {user?.role === "admin" && (
              <Button
                onClick={() => setShowAddModal(true)}
                className="flex-1 md:flex-none bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/30"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Call
              </Button>
            )}
          </div>
        </div>

        <DashboardStats calls={filteredCalls} isLoading={isLoading} />

        <DashboardFilters 
          filters={filters}
          setFilters={setFilters}
          calls={calls}
        />

        <CallsTable 
          calls={filteredCalls}
          isLoading={isLoading}
          onSelectCall={setSelectedCall}
        />

        {selectedCall && (
          <CallDetailsModal
            call={selectedCall}
            onClose={() => setSelectedCall(null)}
          />
        )}

        {showAddModal && (
          <AddCallModal
            onClose={() => setShowAddModal(false)}
            onSuccess={() => {
              setShowAddModal(false);
              refetch();
            }}
          />
        )}
      </div>
    </div>
  );
}