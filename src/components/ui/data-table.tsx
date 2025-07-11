import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';

export interface Column<T> {
  header: React.ReactNode;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
  cell?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  readonly columns: Column<T>[];
  readonly data: T[];
  readonly rowKey: (row: T) => string | number;
  readonly actions?: (row: T) => React.ReactNode;
  readonly loading?: boolean;
  readonly emptyText?: React.ReactNode;
  readonly caption?: React.ReactNode;
}

export function DataTable<T>({
  columns,
  data,
  rowKey,
  actions,
  loading,
  emptyText = 'No data',
  caption,
}: DataTableProps<T>) {
  return (
    <div className="border shadow-lg bg-card overflow-x-auto">
      <Table>
        {caption && <TableCaption>{caption}</TableCaption>}
        <TableHeader className="sticky top-0 z-10 bg-card/95 backdrop-blur border-b">
          <TableRow>
            {columns.map((col, idx) => (
              <TableHead key={idx} className={col.className}>{col.header}</TableHead>
            ))}
            {actions && <TableHead className="min-w-[220px] text-center">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-8">
                Loading...
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + (actions ? 1 : 0)} className="text-center text-muted-foreground py-8">
                {emptyText}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={rowKey(row)} className="hover:bg-accent/30 transition-colors group">
                {columns.map((col, idx) => (
                  <TableCell key={idx} className={col.className}>
                    {col.cell
                      ? col.cell(row)
                      : typeof col.accessor === 'function'
                        ? col.accessor(row)
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        : (row as any)[col.accessor]}
                  </TableCell>
                ))}
                {actions && (
                  <TableCell className="text-center">{actions(row)}</TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
} 