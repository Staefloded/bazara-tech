"use client";

import {
  ColumnDef,
  OnChangeFn,
  PaginationState,
  Row,
  RowSelectionState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/table/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  showPagination?: boolean;
  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string;
  totalPages?: number;
  maxPerPage?: number;
  isLoading: boolean;
  setPagination?: React.Dispatch<React.SetStateAction<PaginationState>>;
  pagination?: PaginationState;
  emptyState?: React.ReactNode;
  customSize?: boolean;
  manualPagination?: boolean;
  setRowSelection?: OnChangeFn<RowSelectionState>;
  rowSelection?: RowSelectionState;
  containerClassName?: string;
  addMinHeight?: boolean;
  getRowStyles?: (row: Row<TData>) => React.CSSProperties;
  addWidth?: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  showPagination = true,
  getRowId,
  maxPerPage = 10,
  isLoading = false,
  totalPages = 1,
  setPagination,
  pagination,
  emptyState,
  customSize = false,
  manualPagination = true,
  setRowSelection,
  rowSelection,
  containerClassName,
  addMinHeight,
  getRowStyles,
}: DataTableProps<TData, TValue>) {
  const tableData = isLoading ? Array(maxPerPage).fill({}) : data;

  const tableColumns = isLoading
    ? columns.map((column) => ({
        ...column,
        cell: () => <Skeleton className="h-2 w-24" />,
      }))
    : columns;

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getRowId,
    manualPagination,
    pageCount: totalPages,
    rowCount: maxPerPage,
    onPaginationChange: setPagination,
    enableRowSelection: !!rowSelection,
    onRowSelectionChange: setRowSelection,
    state: {
      pagination,
      rowSelection,
    },
  });

  return (
    <div
      className={cn(
        "rounded-xl overflow-hidden flex flex-col flex-grow bg-white",
        addMinHeight && "min-h-[600px]",
        containerClassName
      )}
    >
      <div
        className={cn("relative overflow-x-auto flex-1")}
        style={{
          maxWidth: customSize ? "calc(100vw + 320px)" : "",
        }}
      >
        <Table
          aria-label="Data table"
          style={{
            minWidth: data?.length && customSize ? table.getCenterTotalSize() : "100%",
            width: "100%",
          }}
        >
          <TableHeader className="bg-brand">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{
                        width: header.getSize(),
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                return (
                  <TableRow
                    key={row.id}
                    data-state={!!rowSelection && row?.getIsSelected() ? "selected" : null}
                    style={getRowStyles ? getRowStyles(row) : undefined}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} style={{ width: cell.column.getSize() }}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="bg-white text-center">
                  <div className="h-96 grid place-items-center">
                    {emptyState || "No data found"}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {showPagination && (
        <div className="my-5 w-full">
          {showPagination && <DataTablePagination table={table} totalPages={totalPages} />}
        </div>
      )}
    </div>
  );
}
