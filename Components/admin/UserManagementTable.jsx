import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Settings, Shield, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserManagementTable({ users, agentMappings, isLoading, onAssignAgents }) {
  if (isLoading) {
    return (
      <Card className="border-none shadow-lg bg-white dark:bg-[#141414]">
        <CardContent className="p-6">
          <div className="space-y-3">
            {Array(5).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-lg bg-white dark:bg-[#141414]">
      <CardContent className="p-6">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">
          User Management
        </h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-[#2a2a2a]">
                <TableHead className="text-gray-700 dark:text-gray-300">User</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Email</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Role</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Assigned Agents</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const mapping = agentMappings.find(m => m.user_email === user.email);
                return (
                  <TableRow 
                    key={user.id}
                    className="border-b border-gray-100 dark:border-[#1e1e1e] hover:bg-gray-50 dark:hover:bg-[#1a1a1a]"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {user.full_name?.[0]?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {user.full_name || 'User'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      {user.role === "admin" ? (
                        <Badge className="bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 border border-purple-300 dark:border-purple-700">
                          <Shield className="w-3 h-3 mr-1" />
                          Admin
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400 border border-gray-300 dark:border-gray-700">
                          <User className="w-3 h-3 mr-1" />
                          Client
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {mapping?.agent_ids?.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {mapping.agent_ids.map((agentId, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400">
                              {agentId}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400 text-sm">No agents assigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onAssignAgents(user)}
                        className="hover:bg-blue-50 dark:hover:bg-blue-500/10 text-blue-600 dark:text-blue-400"
                      >
                        <Settings className="w-4 h-4 mr-1" />
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}