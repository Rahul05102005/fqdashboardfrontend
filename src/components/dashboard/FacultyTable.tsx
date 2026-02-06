import React from 'react';
import { FacultyProfile } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Eye, Edit, Star } from 'lucide-react';
import { getPerformanceBadge } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface FacultyTableProps {
  faculty: FacultyProfile[];
  onView?: (faculty: FacultyProfile) => void;
  onEdit?: (faculty: FacultyProfile) => void;
  className?: string;
}

const FacultyTable: React.FC<FacultyTableProps> = ({
  faculty,
  onView,
  onEdit,
  className,
}) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'on-leave':
        return 'secondary';
      case 'inactive':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className={cn('dashboard-card overflow-hidden p-0', className)}>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Faculty</TableHead>
              <TableHead className="hidden font-semibold md:table-cell">Department</TableHead>
              <TableHead className="hidden font-semibold lg:table-cell">Designation</TableHead>
              <TableHead className="font-semibold">Rating</TableHead>
              <TableHead className="hidden font-semibold sm:table-cell">Status</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faculty.map((f) => {
              const performance = getPerformanceBadge(f.averageRating);
              return (
                <TableRow key={f.id} className="transition-colors hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                        {f.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{f.name}</p>
                        <p className="text-xs text-muted-foreground md:hidden">{f.department}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-muted-foreground">{f.department}</span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className="text-muted-foreground">{f.designation}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-warning text-warning" />
                      <span className="font-semibold">{f.averageRating.toFixed(1)}</span>
                      <Badge
                        variant={performance.variant === 'success' ? 'default' : 'secondary'}
                        className={cn(
                          'hidden text-xs sm:inline-flex',
                          performance.variant === 'success' && 'bg-success text-success-foreground'
                        )}
                      >
                        {performance.label}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant={getStatusBadgeVariant(f.status)}>
                      {f.status.charAt(0).toUpperCase() + f.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView?.(f)}
                        className="h-8 w-8"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit?.(f)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FacultyTable;
