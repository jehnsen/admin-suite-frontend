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
import { personnelService } from "@/lib/api/services";
import { Loader2 } from "lucide-react";

interface ServiceRecordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeId: number;
  employeeName: string;
  onSuccess?: () => void;
}

export function ServiceRecordModal({
  open,
  onOpenChange,
  employeeId,
  employeeName,
  onSuccess,
}: ServiceRecordModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    designation: "",
    station_place_of_assignment: "",
    department: "",
    salary_grade: "",
    step_increment: "",
    monthly_salary: "",
    date_from: "",
    date_to: "",
    action_type: "",
    status_of_appointment: "",
    office_entity: "",
    government_service: "Yes",
    remarks: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const serviceRecordData = {
        employee_id: employeeId,
        designation: formData.designation,
        station_place_of_assignment: formData.station_place_of_assignment,
        department: formData.department,
        salary_grade: Number(formData.salary_grade),
        step_increment: Number(formData.step_increment),
        monthly_salary: Number(formData.monthly_salary),
        date_from: formData.date_from,
        date_to: formData.date_to || undefined,
        action_type: formData.action_type,
        status_of_appointment: formData.status_of_appointment,
        office_entity: formData.office_entity,
        government_service: formData.government_service,
        remarks: formData.remarks || undefined,
        // Add these fields for backward compatibility with backend
        position: formData.designation,
        from_date: formData.date_from,
        to_date: formData.date_to || undefined,
      };

      await personnelService.createServiceRecord(serviceRecordData);

      // Reset form and close
      setFormData({
        designation: "",
        station_place_of_assignment: "",
        department: "",
        salary_grade: "",
        step_increment: "",
        monthly_salary: "",
        date_from: "",
        date_to: "",
        action_type: "",
        status_of_appointment: "",
        office_entity: "",
        government_service: "Yes",
        remarks: "",
      });
      onOpenChange(false);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error("Failed to create service record:", err);
      setError(err.message || "Failed to submit service record");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Service Record</DialogTitle>
          <DialogDescription>
            Add a new service record for {employeeName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="designation">Designation/Position *</Label>
              <Input
                id="designation"
                placeholder="Enter position title"
                value={formData.designation}
                onChange={(e) =>
                  setFormData({ ...formData, designation: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Input
                id="department"
                placeholder="Enter department"
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="station_place_of_assignment">
              Station/Place of Assignment *
            </Label>
            <Input
              id="station_place_of_assignment"
              placeholder="Enter station or place of assignment"
              value={formData.station_place_of_assignment}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  station_place_of_assignment: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salary_grade">Salary Grade *</Label>
              <Input
                id="salary_grade"
                type="number"
                min="1"
                max="33"
                placeholder="1-33"
                value={formData.salary_grade}
                onChange={(e) =>
                  setFormData({ ...formData, salary_grade: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="step_increment">Step Increment *</Label>
              <Input
                id="step_increment"
                type="number"
                min="1"
                max="8"
                placeholder="1-8"
                value={formData.step_increment}
                onChange={(e) =>
                  setFormData({ ...formData, step_increment: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthly_salary">Monthly Salary *</Label>
              <Input
                id="monthly_salary"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={formData.monthly_salary}
                onChange={(e) =>
                  setFormData({ ...formData, monthly_salary: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date_from">Date From *</Label>
              <Input
                id="date_from"
                type="date"
                value={formData.date_from}
                onChange={(e) =>
                  setFormData({ ...formData, date_from: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_to">Date To</Label>
              <Input
                id="date_to"
                type="date"
                value={formData.date_to}
                onChange={(e) =>
                  setFormData({ ...formData, date_to: e.target.value })
                }
                min={formData.date_from}
              />
              <p className="text-xs text-muted-foreground">
                Leave blank if currently assigned
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status_of_appointment">Status of Appointment *</Label>
              <Select
                value={formData.status_of_appointment}
                onValueChange={(value) =>
                  setFormData({ ...formData, status_of_appointment: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Permanent">Permanent</SelectItem>
                  <SelectItem value="Temporary">Temporary</SelectItem>
                  <SelectItem value="Casual">Casual</SelectItem>
                  <SelectItem value="Contractual">Contractual</SelectItem>
                  <SelectItem value="Substitute">Substitute</SelectItem>
                  <SelectItem value="Co-terminus">Co-terminus</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="government_service">Government Service *</Label>
              <Select
                value={formData.government_service}
                onValueChange={(value) =>
                  setFormData({ ...formData, government_service: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="office_entity">Office/Entity *</Label>
            <Input
              id="office_entity"
              placeholder="Enter office or entity name"
              value={formData.office_entity}
              onChange={(e) =>
                setFormData({ ...formData, office_entity: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="action_type">Action Type *</Label>
            <Select
              value={formData.action_type}
              onValueChange={(value) =>
                setFormData({ ...formData, action_type: value })
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select action type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New Appointment">
                  New Appointment
                </SelectItem>
                <SelectItem value="Promotion">Promotion</SelectItem>
                <SelectItem value="Transfer">Transfer</SelectItem>
                <SelectItem value="Reclassification">
                  Reclassification
                </SelectItem>
                <SelectItem value="Reinstatement">Reinstatement</SelectItem>
                <SelectItem value="Detail">Detail</SelectItem>
                <SelectItem value="Reassignment">Reassignment</SelectItem>
                <SelectItem value="Reappointment">Reappointment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              placeholder="Enter any additional remarks or notes"
              value={formData.remarks}
              onChange={(e) =>
                setFormData({ ...formData, remarks: e.target.value })
              }
              rows={3}
            />
          </div>

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
                "Add Service Record"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
