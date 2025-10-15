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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Mail } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AddUserModal({ onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    role: "user"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const inviteLink = `${window.location.origin}`;
      
      await base44.integrations.Core.SendEmail({
        from_name: "Bolna CRM",
        to: formData.email,
        subject: "Welcome to Bolna CRM - Setup Your Account",
        body: `
Hi ${formData.full_name},

You've been invited to join Bolna CRM as a ${formData.role === "admin" ? "Admin" : "Client"}.

Please use the following link to set up your account:
${inviteLink}

Your initial role is: ${formData.role === "admin" ? "Administrator" : "Client User"}

If you have any questions, please contact your administrator.

Best regards,
Bolna CRM Team
        `.trim()
      });

      setEmailSent(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (error) {
      console.error("Error sending invitation:", error);
    }
    
    setLoading(false);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white dark:bg-[#141414] border-gray-200 dark:border-[#2a2a2a]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Invite New User
          </DialogTitle>
        </DialogHeader>

        {emailSent ? (
          <Alert className="bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-800">
            <Mail className="w-4 h-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-300">
              Invitation email sent successfully to {formData.email}!
            </AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Full Name *</Label>
              <Input
                required
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                placeholder="John Doe"
                className="bg-gray-50 dark:bg-[#0a0a0a] border-gray-300 dark:border-[#2a2a2a]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Email *</Label>
              <Input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="john@example.com"
                className="bg-gray-50 dark:bg-[#0a0a0a] border-gray-300 dark:border-[#2a2a2a]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Role *</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                <SelectTrigger className="bg-gray-50 dark:bg-[#0a0a0a] border-gray-300 dark:border-[#2a2a2a]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Client</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Alert className="bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-800">
              <AlertDescription className="text-blue-800 dark:text-blue-300 text-sm">
                An invitation email will be sent to the user with setup instructions.
              </AlertDescription>
            </Alert>

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
                Send Invitation
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}