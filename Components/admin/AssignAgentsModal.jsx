import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, X } from "lucide-react";

export default function AssignAgentsModal({ user, currentMapping, onClose, onSuccess }) {
  const [agentIds, setAgentIds] = useState(currentMapping?.agent_ids || []);
  const [newAgentId, setNewAgentId] = useState("");
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (currentMapping) {
        await base44.entities.UserAgentMapping.update(currentMapping.id, {
          agent_ids: agentIds,
          user_full_name: user.full_name
        });
      } else {
        await base44.entities.UserAgentMapping.create({
          user_email: user.email,
          agent_ids: agentIds,
          user_full_name: user.full_name
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['agentMappings']);
      onSuccess();
    }
  });

  const addAgent = () => {
    if (newAgentId && !agentIds.includes(newAgentId)) {
      setAgentIds([...agentIds, newAgentId]);
      setNewAgentId("");
    }
  };

  const removeAgent = (agentId) => {
    setAgentIds(agentIds.filter(id => id !== agentId));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white dark:bg-[#141414] border-gray-200 dark:border-[#2a2a2a]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Assign Agents
          </DialogTitle>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            {user.full_name} ({user.email})
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300">Add Agent ID</Label>
            <div className="flex gap-2">
              <Input
                value={newAgentId}
                onChange={(e) => setNewAgentId(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addAgent()}
                placeholder="agent_123"
                className="bg-gray-50 dark:bg-[#0a0a0a] border-gray-300 dark:border-[#2a2a2a]"
              />
              <Button
                type="button"
                onClick={addAgent}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300">Assigned Agents</Label>
            {agentIds.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm py-4 text-center">
                No agents assigned yet
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {agentIds.map((agentId) => (
                  <Badge 
                    key={agentId}
                    className="bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-700 px-3 py-1"
                  >
                    {agentId}
                    <button
                      onClick={() => removeAgent(agentId)}
                      className="ml-2 hover:text-red-600 dark:hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            {saveMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Assignments
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}