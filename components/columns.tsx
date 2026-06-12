'use client';

import * as React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { type ColumnDef } from '@tanstack/react-table';

declare module '@tanstack/react-table' {
  interface TableMeta<TData> {
    sessionUserId: string;
    updateRowStatus: (jobId: string, status: string) => void;
    updateRowInterviewDate: (jobId: string, interviewDate: Date | null) => void;
    removeRow: (jobId: string) => void;
  }
}

import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GripVerticalIcon, LoaderIcon, MoreHorizontal } from 'lucide-react';
import { Job, Company } from '@/generated/prisma/client';
import { ArrowUpDown } from 'lucide-react';
import {
  deleteJobAction,
  updateJobStatus,
} from '@/actions/dashboard/table.action';
import { DatePicker } from '@/components/date-picker';
import Link from 'next/link';

export type JobWithCompany = Job & {
  company: Company | null;
};

export const STATUS = [
  'SAVED',
  'APPLIED',
  'SHORTLISTED',
  'INTERVIEW',
  'ASSESSMENT',
  'OFFER',
  'REJECTED',
  'WITHDRAWN',
] as const;

function DragHandle({ id }: { id: string }) {
  const { attributes, listeners } = useSortable({ id });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:bg-transparent"
    >
      <GripVerticalIcon className="size-3 text-muted-foreground" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

export const columns: ColumnDef<JobWithCompany>[] = [
  {
    id: 'drag',
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    id: 'select',
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected()
              ? true
              : table.getIsSomePageRowsSelected()
                ? 'indeterminate'
                : false
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Job Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'companyId',
    id: 'companyName',
    accessorFn: (row) => row.company?.name || 'N/A',
    header: 'Company',
  },
  {
    accessorKey: 'jobType',
    header: 'Job Type',
    cell: ({ row }) => {
      const type = row.getValue('jobType') as string | null;
      if (!type) return <span className="text-muted-foreground">-</span>;
      return <Badge variant="outline">{type.replace('_', ' ')}</Badge>;
    },
  },
  {
    accessorKey: 'workMode',
    header: 'Work Mode',
    cell: ({ row }) => {
      const mode = row.getValue('workMode') as string | null;
      if (!mode) return <span className="text-muted-foreground">-</span>;
      return <Badge variant="secondary">{mode.replace('_', ' ')}</Badge>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const variant =
        status === 'APPLIED' || status === 'INTERVIEW'
          ? 'default'
          : 'secondary';
      return <Badge variant={variant}>{status.replace('_', ' ')}</Badge>;
    },
  },
  {
    accessorKey: 'applicationDeadline',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Deadline
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue('applicationDeadline') as
        | Date
        | null
        | undefined;
      return date ? (
        new Date(date).toLocaleDateString()
      ) : (
        <span className="text-muted-foreground">No deadline</span>
      );
    },
  },
  {
    accessorKey: 'interviewDate',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Interview
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue('interviewDate') as Date | null | undefined;
      return date ? (
        new Date(date).toLocaleDateString()
      ) : (
        <span className="text-muted-foreground">Not Scheduled</span>
      );
    },
  },
  {
    id: 'changeStatusAction',
    header: 'Status',
    cell: (props) => {
      const meta = props.table.options.meta as {
        sessionUserId: string;
        updateRowStatus: (jobId: string, status: string) => void;
      };
      return (
        <StatusSelect
          job={props.row.original}
          onUpdate={meta.updateRowStatus}
        />
      );
    },
  },
  {
    id: 'actions',
    cell: (props) => {
      const meta = props.table.options.meta as {
        removeRow: (jobId: string) => void;
        updateRowInterviewDate: (
          jobId: string,
          interviewDate: Date | null
        ) => void;
      };
      return (
        <JobActions
          job={props.row.original}
          onRemove={meta.removeRow}
          onUpdateInterviewDate={meta.updateRowInterviewDate}
        />
      );
    },
  },
];

function StatusSelect({
  job,
  onUpdate,
}: {
  job: JobWithCompany;
  onUpdate: (jobId: string, newStatus: string) => void;
}) {
  const [updating, setUpdating] = React.useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true);
    onUpdate(job.id, newStatus);
    const res = await updateJobStatus(job.userId, job.id, newStatus);
    setUpdating(false);
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <Select
      defaultValue={job.status}
      onValueChange={handleStatusChange}
      disabled={updating}
    >
      <SelectTrigger
        className="w-36 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
        size="sm"
        id={`${job.id}-status`}
      >
        {updating ? (
          <span className="flex items-center gap-2">
            <LoaderIcon className="size-3 animate-spin" />
            Saving...
          </span>
        ) : (
          <SelectValue placeholder="Change status" />
        )}
      </SelectTrigger>
      <SelectContent align="end">
        <SelectGroup>
          {STATUS.map((status) => (
            <SelectItem key={status} value={status}>
              {status.replace('_', ' ')}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

function JobActions({
  job,
  onRemove,
  onUpdateInterviewDate,
}: {
  job: JobWithCompany;
  onRemove: (jobId: string) => void;
  onUpdateInterviewDate: (jobId: string, interviewDate: Date | null) => void;
}) {
  const [deleting, setDeleting] = React.useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    onRemove(job.id);
    const res = await deleteJobAction(job.userId, job.id);
    setDeleting(false);
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-35">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem>
          <Link href={`/dashboard/manage-jobs/${job.id}`}>View Details</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} disabled={deleting}>
          {deleting ? 'Deleting...' : 'Delete'}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DatePicker
          userId={job.userId}
          jobId={job.id}
          onUpdate={onUpdateInterviewDate}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
