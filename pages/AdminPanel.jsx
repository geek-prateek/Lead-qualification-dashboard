import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Shield } from "lucide-react";

import UserManagementTable from "../components/admin/UserManagementTable";
import AddUserModal from "../components/admin/AddUserModal";
import AssignAgentsModal from "../components/admin/AssignAgentsModal";

export default function AdminPanel() {
  const [user, setUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUserForAgents, setSelectedUserForAgents] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const currentUser = await base44.auth.me();
    setUser(currentUser);
    
    if (currentUser.role !== "admin") {
      window.location.href = "/";
    }
  };

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.list(),
    enabled: !!user && user.role === "admin"
  });

  const { data: agentMappings = [] } = useQuery({
    queryKey: ['agentMappings'],
    queryFn: () => base44.entities.UserAgentMapping.list(),
    enabled: !!user && user.role === "admin"
  });

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="text-center">
          <Shield className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            You need admin privileges to access this page
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Admin Panel
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage users and agent assignments
            </p>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/30"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>

        <UserManagementTable
          users={users}
          agentMappings={agentMappings}
          isLoading={usersLoading}
          onAssignAgents={setSelectedUserForAgents}
        />

        {showAddModal && (
          <AddUserModal
            onClose={() => setShowAddModal(false)}
            onSuccess={() => {
              setShowAddModal(false);
              queryClient.invalidateQueries(['users']);
            }}
          />
        )}

        {selectedUserForAgents && (
          <AssignAgentsModal
            user={selectedUserForAgents}
            currentMapping={agentMappings.find(m => m.user_email === selectedUserForAgents.email)}
            onClose={() => setSelectedUserForAgents(null)}
            onSuccess={() => {
              setSelectedUserForAgents(null);
              queryClient.invalidateQueries(['agentMappings']);
            }}
          />
        )}
      </div>
    </div>
  );
}