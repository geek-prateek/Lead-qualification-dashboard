import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export default function AddCallModal({ onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    agent_id: "",
    call_status: "completed",
    transcript: "",
    summary: "",
    intent: "",
    call_duration: "",
    call_date: new Date().toISOString().slice(0, 16),
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    booking_date: "",
    booking_time: "",
    service_type: "",
    notes: "",
    failure_reason: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const callData = {
        agent_id: formData.agent_id,
        call_status: formData.call_status,
        transcript: formData.transcript || undefined,
        summary: formData.summary || undefined,
        intent: formData.intent || undefined,
        call_duration: formData.call_duration ? parseInt(formData.call_duration) : undefined,
        call_date: formData.call_date,
        failure_reason: formData.call_status === "failed" ? formData.failure_reason : undefined,
        extracted_data: {
          customer_name: formData.customer_name || undefined,
          customer_phone: formData.customer_phone || undefined,
          customer_email: formData.customer_email || undefined,
          booking_date: formData.booking_date || undefined,
          booking_time: formData.booking_time || undefined,
          service_type: formData.service_type || undefined,
          notes: formData.notes || undefined
        }
      };

      await base44.entities.CallRecord.create(callData);
      onSuccess();
    } catch (error) {
      console.error("Error creating call:", error);
    }
    
    setLoading(false);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#141414] border-gray-200 dark:border-[#2a2a2a]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Add Call Record
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Agent ID *</Label>
              <Input
                required
                value={formData.agent_id}
                onChange={(e) => setFormData({...formData, agent_id: e.target.value})}
                placeholder="agent_123"
                className="bg-gray-50 dark:bg-[#0a0a0a] border-gray-300 dark:border-[#2a2a2a]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Status *</Label>
              <Select value={formData.call_status} onValueChange={(value) => setFormData({...formData, call_status: value})}>
                <SelectTrigger className="bg-gray-50 dark:bg-[#0a0a0a] border-gray-300 dark:border-[#2a2a2a]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Call Date & Time</Label>
              <Input
                type="datetime-local"
                value={formData.call_date}
                onChange={(e) => setFormData({...formData, call_date: e.target.value})}
                className="bg-gray-50 dark:bg-[#0a0a0a] border-gray-300 dark:border-[#2a2a2a]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Duration (seconds)</Label>
              <Input
                type="number"
                value={formData.call_duration}
                onChange={(e) => setFormData({...formData, call_duration: e.target.value})}
                placeholder="180"
                className="bg-gray-50 dark:bg-[#0a0a0a] border-gray-300 dark:border-[#2a2a2a]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Intent</Label>
              <Input
                value={formData.intent}
                onChange={(e) => setFormData({...formData, intent: e.target.value})}
                placeholder="booking, inquiry, support"
                className="bg-gray-50 dark:bg-[#0a0a0a] border-gray-300 dark:border-[#2a2a2a]"
              />
            </div>
          </div>

          {formData.call_status === "failed" && (
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Failure Reason</Label>
              <Input
                value={formData.failure_reason}
                onChange={(e) => setFormData({...formData, failure_reason: e.target.value})}
                placeholder="Connection timeout, no answer, etc."
                className="bg-gray-50 dark:bg-[#0a0a0a] border-gray-300 dark:border-[#2a2a2a]"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300">Summary</Label>
            <Textarea
              value={formData.summary}
              onChange={(e) => setFormData({...formData, summary: e.target.value})}
              placeholder="Brief summary of the call..."
              rows={3}
              className="bg-gray-50 dark:bg-[#0a0a0a] border-gray-300 dark:border-[#2a2a2a]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300">Transcript</Label>
            <Textarea
              value={formData.transcript}
              onChange={(e) => setFormData({...formData, transcript: e.target.value})}
              placeholder="Full conversation transcript..."
              rows={5}
              className="bg-gray-50 dark:bg-[#0a0a0a] border-gray-300 dark:border-[#2a2a2a]"
            />
          </div>

          <div className="border-t border-gray-200 dark:border-[#2a2a2a] pt-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Customer Information</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Customer Name</Label>
                <Input
                  value={formData.customer_name}
                  onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                  placeholder="John Doe"
                  className="bg-gray-50 dark:bg-[#0a0a0a] border-gray-300 dark:border-[#2a2a2a]"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Phone</Label>
                <Input
                  value={formData.customer_phone}
                  onChange={(e) => setFormData({...formData, customer_phone: e.target.value})}
                  placeholder="+1234567890"
                  className="bg-gray-50 dark:bg-[#0a0a0a] border-gray-300 dark:border-[#2a2a2a]"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Email</Label>
                <Input
                  type="email"
                  value={formData.customer_email}
                  onChange={(e) => setFormData({...formData, customer_email: e.target.value})}
                  placeholder="john@example.com"
                  className="bg-gray-50 dark:bg-[#0a0a0a] border-gray-300 dark:border-[#2a2a2a]"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Service Type</Label>
                <Input
                  value={formData.service_type}
                  onChange={(e) => setFormData({...formData, service_type: e.target.value})}
                  placeholder="Consultation, Appointment, etc."
                  className="bg-gray-50 dark:bg-[#0a0a0a] border-gray-300 dark:border-[#2a2a2a]"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Booking Date</Label>
                <Input
                  type="date"
                  value={formData.booking_date}
                  onChange={(e) => setFormData({...formData, booking_date: e.target.value})}
                  className="bg-gray-50 dark:bg-[#0a0a0a] border-gray-300 dark:border-[#2a2a2a]"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Booking Time</Label>
                <Input
                  type="time"
                  value={formData.booking_time}
                  onChange={(e) => setFormData({...formData, booking_time: e.target.value})}
                  className="bg-gray-50 dark:bg-[#0a0a0a] border-gray-300 dark:border-[#2a2a2a]"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className="text-gray-700 dark:text-gray-300">Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Additional notes..."
                  rows={2}
                  className="bg-gray-50 dark:bg-[#0a0a0a] border-gray-300 dark:border-[#2a2a2a]"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Call Record
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}