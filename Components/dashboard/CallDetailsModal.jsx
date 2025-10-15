import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Phone, 
  User, 
  Mail, 
  Calendar, 
  Clock,
  MessageSquare,
  FileText,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";

export default function CallDetailsModal({ call, onClose }) {
  return (
    <Dialog open={!!call} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#141414] border-gray-200 dark:border-[#2a2a2a]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Phone className="w-6 h-6 text-blue-500" />
            Call Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Badge 
              className={`${
                call.call_status === "completed" 
                  ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700" 
                  : "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-300 dark:border-red-700"
              } border px-3 py-1`}
            >
              {call.call_status}
            </Badge>
            <Badge variant="outline" className="border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 px-3 py-1">
              {call.agent_id}
            </Badge>
            {call.intent && (
              <Badge variant="outline" className="border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400 px-3 py-1">
                {call.intent}
              </Badge>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-[#1a1a1a]">
              <Calendar className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Call Date</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {call.call_date ? format(new Date(call.call_date), "PPP") : "-"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-[#1a1a1a]">
              <Clock className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {call.call_duration ? `${Math.floor(call.call_duration / 60)}m ${call.call_duration % 60}s` : "-"}
                </p>
              </div>
            </div>
          </div>

          {call.call_status === "failed" && call.failure_reason && (
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-800">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900 dark:text-red-400 mb-1">Failure Reason</p>
                  <p className="text-red-700 dark:text-red-300">{call.failure_reason}</p>
                </div>
              </div>
            </div>
          )}

          {call.extracted_data && Object.keys(call.extracted_data).length > 0 && (
            <>
              <Separator className="bg-gray-200 dark:bg-[#2a2a2a]" />
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-500" />
                  Customer Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {call.extracted_data.customer_name && (
                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#1a1a1a]">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Name</p>
                      <p className="font-medium text-gray-900 dark:text-white">{call.extracted_data.customer_name}</p>
                    </div>
                  )}
                  {call.extracted_data.customer_phone && (
                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#1a1a1a]">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> Phone
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">{call.extracted_data.customer_phone}</p>
                    </div>
                  )}
                  {call.extracted_data.customer_email && (
                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#1a1a1a]">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
                        <Mail className="w-3 h-3" /> Email
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">{call.extracted_data.customer_email}</p>
                    </div>
                  )}
                  {call.extracted_data.service_type && (
                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#1a1a1a]">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Service</p>
                      <p className="font-medium text-gray-900 dark:text-white">{call.extracted_data.service_type}</p>
                    </div>
                  )}
                </div>

                {(call.extracted_data.booking_date || call.extracted_data.booking_time) && (
                  <div className="mt-4 p-4 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-800">
                    <p className="font-semibold text-amber-900 dark:text-amber-400 mb-2">📅 Booking Details</p>
                    <div className="grid grid-cols-2 gap-3">
                      {call.extracted_data.booking_date && (
                        <div>
                          <p className="text-xs text-amber-700 dark:text-amber-300">Date</p>
                          <p className="font-medium text-amber-900 dark:text-amber-200">{call.extracted_data.booking_date}</p>
                        </div>
                      )}
                      {call.extracted_data.booking_time && (
                        <div>
                          <p className="text-xs text-amber-700 dark:text-amber-300">Time</p>
                          <p className="font-medium text-amber-900 dark:text-amber-200">{call.extracted_data.booking_time}</p>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-amber-700 dark:text-amber-300 mt-3">
                      ⚠️ SMS functionality requires backend integration. Please follow up manually.
                    </p>
                  </div>
                )}

                {call.extracted_data.notes && (
                  <div className="mt-4 p-3 rounded-lg bg-gray-50 dark:bg-[#1a1a1a]">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Notes</p>
                    <p className="text-gray-900 dark:text-white">{call.extracted_data.notes}</p>
                  </div>
                )}
              </div>
            </>
          )}

          {call.summary && (
            <>
              <Separator className="bg-gray-200 dark:bg-[#2a2a2a]" />
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  Call Summary
                </h3>
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-800">
                  <p className="text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-wrap">
                    {call.summary}
                  </p>
                </div>
              </div>
            </>
          )}

          {call.transcript && (
            <>
              <Separator className="bg-gray-200 dark:bg-[#2a2a2a]" />
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                  Full Transcript
                </h3>
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] max-h-96 overflow-y-auto">
                  <p className="text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-wrap font-mono text-sm">
                    {call.transcript}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}