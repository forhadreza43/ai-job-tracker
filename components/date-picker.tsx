'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';

import { updateInterviewDate } from '@/actions/dashboard/table.action';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DatePickerProps {
  userId: string;
  jobId: string;
  onUpdate?: (jobId: string, interviewDate: Date | null) => void;
}

export function DatePicker({ userId, jobId, onUpdate }: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [updating, setUpdating] = React.useState(false);

  const handleDateSelect = async (newDate: Date | undefined) => {
    const selectedDate = newDate ?? null;
    setDate(newDate);
    if (onUpdate) onUpdate(jobId, selectedDate);
    setUpdating(true);
    // const result = await updateInterviewDate(userId, jobId, selectedDate);
    toast.promise(updateInterviewDate(userId, jobId, selectedDate), {
      loading: 'Updating interview date...',
      success: 'Interview date updated successfully!',
      error: 'Failed to update interview date.',
    });
    setUpdating(false);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className="w-full border-none"
          disabled={updating}
        >
          {date ? format(date, 'PPP') : <span>Set Interview Date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={handleDateSelect} />
      </PopoverContent>
    </Popover>
  );
}
