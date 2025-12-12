"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { personnelService, CreateLeaveRequestData } from "@/lib/api/services";
import { Loader2 } from "lucide-react";

interface LeaveRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeId: number;
  employeeName: string;
  onSuccess?: () => void;
}

export function LeaveRequestModal({
  open,
  onOpenChange,
  employeeId,
  employeeName,
  onSuccess,
}: LeaveRequestModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    leave_type: "",
    start_date: "",
    end_date: "",
    reason: "",
    illness: "",
    hospital_name: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const leaveRequestData: CreateLeaveRequestData = {
        employee_id: employeeId,
        leave_type: formData.leave_type,
        start_date: formData.start_date,
        end_date: formData.end_date,
        reason: formData.reason,
      };

      // Add sick leave specific fields if applicable
      if (formData.leave_type === "Sick Leave") {
        if (formData.illness) leaveRequestData.illness = formData.illness;
        if (formData.hospital_name) leaveRequestData.hospital_name = formData.hospital_name;
      }

      await personnelService.createLeaveRequest(leaveRequestData);

      // Reset form and close
      setFormData({
        leave_type: "",
        start_date: "",
        end_date: "",
        reason: "",
        illness: "",
        hospital_name: "",
      });
      onOpenChange(false);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error("Failed to create leave request:", err);
      setError(err.message || "Failed to submit leave request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>File Leave Request</DialogTitle>
          <DialogDescription>
            Submit a leave request for {employeeName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="leave_type">Leave Type *</Label>
            <Select
              value={formData.leave_type}
              onValueChange={(value) =>
                setFormData({ ...formData, leave_type: value })
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Vacation Leave">Vacation Leave</SelectItem>
                <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                <SelectItem value="Special Leave">Special Leave</SelectItem>
                <SelectItem value="Maternity Leave">Maternity Leave</SelectItem>
                <SelectItem value="Paternity Leave">Paternity Leave</SelectItem>
                <SelectItem value="Solo Parent Leave">Solo Parent Leave</SelectItem>
                <SelectItem value="Study Leave">Study Leave</SelectItem>
                <SelectItem value="Emergency Leave">Emergency Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date *</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) =>
                  setFormData({ ...formData, start_date: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">End Date *</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) =>
                  setFormData({ ...formData, end_date: e.target.value })
                }
                min={formData.start_date}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason *</Label>
            <Textarea
              id="reason"
              placeholder="Enter reason for leave request"
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
              required
              rows={3}
            />
          </div>

          {formData.leave_type === "Sick Leave" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="illness">Illness/Medical Condition</Label>
                <Input
                  id="illness"
                  placeholder="Enter illness or medical condition"
                  value={formData.illness}
                  onChange={(e) =>
                    setFormData({ ...formData, illness: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hospital_name">Hospital/Clinic Name</Label>
                <Input
                  id="hospital_name"
                  placeholder="Enter hospital or clinic name"
                  value={formData.hospital_name}
                  onChange={(e) =>
                    setFormData({ ...formData, hospital_name: e.target.value })
                  }
                />
              </div>
            </>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Leave Request"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
