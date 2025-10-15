import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, CheckCircle, XCircle, Calendar, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function CallsTable({ calls, isLoading, onSelectCall }) {
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

  if (calls.length === 0) {
    return (
      <Card className="border-none shadow-lg bg-white dark:bg-[#141414]">
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-[#1e1e1e] flex items-center justify-center">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No calls found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your filters or add a new call record
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-lg bg-white dark:bg-[#141414] overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-[#2a2a2a]">
                <TableHead className="text-gray-700 dark:text-gray-300">Date & Time</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Agent ID</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Status</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Intent</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Customer</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Duration</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calls.map((call) => (
                <TableRow 
                  key={call.id}
                  className="border-b border-gray-100 dark:border-[#1e1e1e] hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors cursor-pointer"
                  onClick={() => onSelectCall(call)}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white font-medium">
                        {call.call_date ? format(new Date(call.call_date), "MMM d, yyyy") : "-"}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        {call.call_date ? format(new Date(call.call_date), "HH:mm") : ""}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400">
                      {call.agent_id}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {call.call_status === "completed" ? (
                      <Badge className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Completed
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-700">
                        <XCircle className="w-3 h-3 mr-1" />
                        Failed
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-900 dark:text-white capitalize">
                      {call.intent || "-"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {call.extracted_data?.customer_name || "-"}
                      </p>
                      {call.extracted_data?.customer_phone && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {call.extracted_data.customer_phone}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {call.call_duration ? `${Math.floor(call.call_duration / 60)}m ${call.call_duration % 60}s` : "-"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCall(call);
                      }}
                      className="hover:bg-blue-50 dark:hover:bg-blue-500/10 text-blue-600 dark:text-blue-400"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}