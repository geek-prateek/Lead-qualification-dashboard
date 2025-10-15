import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";

export default function DashboardFilters({ filters, setFilters, calls }) {
  const uniqueAgents = [...new Set(calls.map(c => c.agent_id))].filter(Boolean);
  const uniqueIntents = [...new Set(calls.map(c => c.intent))].filter(Boolean);

  return (
    <Card className="border-none shadow-lg bg-white dark:bg-[#141414]">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300">Agent</Label>
            <Select value={filters.agent} onValueChange={(value) => setFilters({...filters, agent: value})}>
              <SelectTrigger className="bg-gray-50 dark:bg-[#0a0a0a] border-gray-300 dark:border-[#2a2a2a]">
                <SelectValue placeholder="All Agents" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Agents</SelectItem>
                {uniqueAgents.map(agent => (
                  <SelectItem key={agent} value={agent}>{agent}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300">Status</Label>
            <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
              <SelectTrigger className="bg-gray-50 dark:bg-[#0a0a0a] border-gray-300 dark:border-[#2a2a2a]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300">Intent</Label>
            <Select value={filters.intent} onValueChange={(value) => setFilters({...filters, intent: value})}>
              <SelectTrigger className="bg-gray-50 dark:bg-[#0a0a0a] border-gray-300 dark:border-[#2a2a2a]">
                <SelectValue placeholder="All Intents" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Intents</SelectItem>
                {uniqueIntents.map(intent => (
                  <SelectItem key={intent} value={intent}>{intent}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300">Date From</Label>
            <Input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
              className="bg-gray-50 dark:bg-[#0a0a0a] border-gray-300 dark:border-[#2a2a2a]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300">Date To</Label>
            <Input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
              className="bg-gray-50 dark:bg-[#0a0a0a] border-gray-300 dark:border-[#2a2a2a]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}