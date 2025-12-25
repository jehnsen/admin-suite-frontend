"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LeaveRequest } from "@/lib/api/services/personnel.service";

interface LeaveCalendarProps {
  leaveRequests: LeaveRequest[];
}

export function LeaveCalendar({ leaveRequests }: LeaveCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const isDateInLeave = (day: number) => {
    const checkDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );

    return leaveRequests.filter((leave) => {
      if (leave.status !== "Approved") return false;

      const startDate = new Date(leave.start_date);
      const endDate = new Date(leave.end_date);

      return checkDate >= startDate && checkDate <= endDate;
    });
  };

  const renderCalendarDays = () => {
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="aspect-square p-2 border border-gray-100"></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const leavesOnDay = isDateInLeave(day);
      const isToday =
        new Date().getDate() === day &&
        new Date().getMonth() === currentDate.getMonth() &&
        new Date().getFullYear() === currentDate.getFullYear();

      days.push(
        <div
          key={day}
          className={`aspect-square p-2 border border-gray-100 ${
            isToday ? "bg-blue-50 border-primary" : ""
          } ${leavesOnDay.length > 0 ? "bg-yellow-50" : ""}`}
        >
          <div className="flex flex-col h-full">
            <span
              className={`text-sm font-medium ${
                isToday ? "text-primary" : "text-gray-900"
              }`}
            >
              {day}
            </span>
            {leavesOnDay.length > 0 && (
              <div className="mt-1 space-y-1">
                {leavesOnDay.slice(0, 2).map((leave) => (
                  <div
                    key={leave.id}
                    className="text-xs bg-yellow-200 text-yellow-900 rounded px-1 py-0.5 truncate"
                    title={`${leave.employee_name} - ${leave.leave_type}`}
                  >
                    {leave.employee_name.split(" ")[0]}
                  </div>
                ))}
                {leavesOnDay.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{leavesOnDay.length - 2} more
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-0">
          {/* Days of week header */}
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="aspect-square p-2 text-center font-medium text-sm text-gray-600 bg-gray-50"
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {renderCalendarDays()}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-50 border border-primary"></div>
            <span className="text-gray-600">Today</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-50 border border-gray-100"></div>
            <span className="text-gray-600">On Leave</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
