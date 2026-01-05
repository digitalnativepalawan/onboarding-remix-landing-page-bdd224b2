import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Import timesheet screenshots
import timesheetAdmin from "@/assets/timesheet-admin-panel.jpg";
import timesheetSchedule from "@/assets/timesheet-schedule.jpg";
import timesheetPayroll from "@/assets/timesheet-payroll.jpg";
import timesheetClockin from "@/assets/timesheet-clockin.jpg";

interface TimesheetDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TimesheetDetailModal = ({ open, onOpenChange }: TimesheetDetailModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[720px] w-[95vw] h-[100dvh] sm:h-auto sm:max-h-[90vh] overflow-y-auto p-0 gap-0 bg-card border-border/50 rounded-none sm:rounded-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom-4 data-[state=open]:slide-in-from-bottom-4 sm:data-[state=closed]:slide-out-to-bottom-0 sm:data-[state=open]:slide-in-from-bottom-0">
        {/* Sticky Header */}
        <DialogHeader className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b border-border/30 px-4 py-3 flex flex-row items-center justify-between">
          <DialogTitle className="text-base sm:text-lg font-medium pr-8">
            Employee Timesheet & Payroll System
          </DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-3 top-3 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </DialogHeader>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Subtitle */}
          <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
            Real-time staff tracking, scheduling, and payroll — built for small resorts in Palawan
          </p>

          {/* Image Gallery */}
          <div className="space-y-3">
            <div className="rounded-lg overflow-hidden border border-border/30 bg-muted/20 shadow-sm">
              <img
                src={timesheetClockin}
                alt="Employee Clock-In System"
                className="w-full h-auto object-contain"
              />
            </div>
            <div className="rounded-lg overflow-hidden border border-border/30 bg-muted/20 shadow-sm">
              <img
                src={timesheetAdmin}
                alt="Admin Panel & Task Assignment"
                className="w-full h-auto object-contain"
              />
            </div>
            <div className="rounded-lg overflow-hidden border border-border/30 bg-muted/20 shadow-sm">
              <img
                src={timesheetSchedule}
                alt="Weekly Schedule Management"
                className="w-full h-auto object-contain"
              />
            </div>
            <div className="rounded-lg overflow-hidden border border-border/30 bg-muted/20 shadow-sm">
              <img
                src={timesheetPayroll}
                alt="Payroll & Time Entries"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>

          {/* Explanation Content */}
          <div className="space-y-5">
            {/* What this system does */}
            <div className="space-y-2">
              <h3 className="text-sm sm:text-base font-medium text-foreground">
                What this system does
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground font-light">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Staff clock in → lunch → clock out from any device</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>All actions update instantly in the admin dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>No spreadsheets, no manual calculations</span>
                </li>
              </ul>
            </div>

            {/* Daily task & schedule management */}
            <div className="space-y-2">
              <h3 className="text-sm sm:text-base font-medium text-foreground">
                Daily task & schedule management
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground font-light">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Assign daily tasks per employee</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Create weekly schedules with time blocks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Tasks appear automatically when staff clock in</span>
                </li>
              </ul>
            </div>

            {/* Payroll & payments */}
            <div className="space-y-2">
              <h3 className="text-sm sm:text-base font-medium text-foreground">
                Payroll & payments
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground font-light">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Hourly rates stored per employee</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Hours calculated automatically from clock-ins</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Track paid vs unpaid wages</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Export timesheets and payroll records</span>
                </li>
              </ul>
            </div>

            {/* Why it matters for Palawan resorts */}
            <div className="space-y-2">
              <h3 className="text-sm sm:text-base font-medium text-foreground">
                Why it matters for Palawan resorts
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground font-light">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Designed for small teams</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Works even with unstable internet</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Reduces payroll errors and disputes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Clear audit trail for owners and accountants</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Empty State Guidance */}
          <div className="p-4 rounded-lg border border-border/30 bg-muted/10">
            <h3 className="text-sm sm:text-base font-medium text-foreground mb-2">
              When you first open this module
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground font-light">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Your timesheet will be empty until staff clock in for the first time.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Once employees are added and start clocking in, time entries and payroll will populate.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground/60 mt-1">→</span>
                <span className="text-muted-foreground/80 italic">Nothing is broken — this module activates when your team uses it.</span>
              </li>
            </ul>
          </div>

          {/* Footer Note */}
          <p className="text-xs text-muted-foreground/60 font-light text-center pt-2">
            This module is part of the Palawan Collective Operations Dashboard.
          </p>

          {/* Close Button for Mobile */}
          <div className="pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TimesheetDetailModal;
