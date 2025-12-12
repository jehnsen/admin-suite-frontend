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

interface TrainingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeId: number;
  employeeName: string;
  onSuccess?: () => void;
}

export function TrainingModal({
  open,
  onOpenChange,
  employeeId,
  employeeName,
  onSuccess,
}: TrainingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    training_title: "",
    training_type: "",
    organizer: "",
    venue: "",
    date_from: "",
    date_to: "",
    hours: "",
    status: "Completed",
    certificate_url: "",
    remarks: "",
    conducted_by: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const trainingData = {
        employee_id: employeeId,
        employee_name: employeeName,
        training_title: formData.training_title,
        training_type: formData.training_type,
        organizer: formData.organizer,
        venue: formData.venue,
        date_from: formData.date_from,
        date_to: formData.date_to,
        hours: Number(formData.hours),
        status: formData.status,
        certificate_url: formData.certificate_url || undefined,
        remarks: formData.remarks || undefined,
      };

      await personnelService.createTraining(trainingData);

      // Reset form and close
      setFormData({
        training_title: "",
        training_type: "",
        organizer: "",
        venue: "",
        date_from: "",
        date_to: "",
        hours: "",
        status: "Completed",
        certificate_url: "",
        remarks: "",
        conducted_by: "",
      });
      onOpenChange(false);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error("Failed to create training record:", err);
      setError(err.message || "Failed to submit training record");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Training Record</DialogTitle>
          <DialogDescription>
            Add a new training/seminar record for {employeeName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="training_title">Training Title *</Label>
            <Input
              id="training_title"
              placeholder="Enter training/seminar title"
              value={formData.training_title}
              onChange={(e) =>
                setFormData({ ...formData, training_title: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="training_type">Training Type *</Label>
              <Select
                value={formData.training_type}
                onValueChange={(value) =>
                  setFormData({ ...formData, training_type: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select training type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Seminar">Seminar</SelectItem>
                  <SelectItem value="Workshop">Workshop</SelectItem>
                  <SelectItem value="Conference">Conference</SelectItem>
                  <SelectItem value="Webinar">Webinar</SelectItem>
                  <SelectItem value="Training Course">
                    Training Course
                  </SelectItem>
                  <SelectItem value="Leadership Training">
                    Leadership Training
                  </SelectItem>
                  <SelectItem value="Technical Training">
                    Technical Training
                  </SelectItem>
                  <SelectItem value="Professional Development">
                    Professional Development
                  </SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Ongoing">Ongoing</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="organizer">Organizer/Sponsor *</Label>
            <Input
              id="organizer"
              placeholder="Enter organizing institution or agency"
              value={formData.organizer}
              onChange={(e) =>
                setFormData({ ...formData, organizer: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="venue">Venue *</Label>
            <Input
              id="venue"
              placeholder="Enter training venue or location"
              value={formData.venue}
              onChange={(e) =>
                setFormData({ ...formData, venue: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date_from">Start Date *</Label>
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
              <Label htmlFor="date_to">End Date *</Label>
              <Input
                id="date_to"
                type="date"
                value={formData.date_to}
                onChange={(e) =>
                  setFormData({ ...formData, date_to: e.target.value })
                }
                min={formData.date_from}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hours">Training Hours *</Label>
              <Input
                id="hours"
                type="number"
                min="0"
                step="0.5"
                placeholder="0"
                value={formData.hours}
                onChange={(e) =>
                  setFormData({ ...formData, hours: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="certificate_url">Certificate URL</Label>
            <Input
              id="certificate_url"
              type="url"
              placeholder="https://example.com/certificate.pdf"
              value={formData.certificate_url}
              onChange={(e) =>
                setFormData({ ...formData, certificate_url: e.target.value })
              }
            />
            <p className="text-xs text-muted-foreground">
              Optional: Link to certificate or supporting document
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks/Notes</Label>
            <Textarea
              id="remarks"
              placeholder="Enter any additional remarks or notes about the training"
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
                "Add Training Record"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
