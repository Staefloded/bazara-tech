import { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import usePagination from "@/hooks/usePagination";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  totalPages?: number;
}

export function DataTablePagination<TData>({
  table,
  totalPages: propTotalPages,
}: DataTablePaginationProps<TData>) {
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = propTotalPages || table.getPageCount();
  const pageSize = table.getState().pagination.pageSize;
  const { handlePageChange, handlePageSizeChange } = usePagination();

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 7; // Show up to 7 page numbers

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate the main range around current page
      let start = Math.max(2, currentPage - 2);
      let end = Math.min(totalPages - 1, currentPage + 2);

      // Adjust range if we're near the beginning
      if (currentPage <= 4) {
        start = 2;
        end = Math.min(6, totalPages - 1);
      }

      // Adjust range if we're near the end
      if (currentPage >= totalPages - 3) {
        start = Math.max(2, totalPages - 5);
        end = totalPages - 1;
      }

      // Add ellipsis after first page if there's a gap
      if (start > 2) {
        pages.push("...");
      }

      // Add the main range of pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if there's a gap
      if (end < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page (if more than 1 page total)
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-between px-6 py-4">
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-700">Page Size</span>
        <Select
          value={`${pageSize}`}
          onValueChange={(value) => {
            handlePageSizeChange(Number(value));
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="h-8 w-[80px] border-gray-300">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[10, 25, 50, 100].map((size) => (
              <SelectItem key={size} value={`${size}`}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Page Navigation */}
      <div className="flex items-center space-x-2">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => {
            handlePageChange(currentPage - 1);
            table.previousPage();
          }}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {pageNumbers.map((pageNum, index) => {
            if (pageNum === "...") {
              return (
                <span key={`ellipsis-${index}`} className="px-2 text-gray-500 text-sm">
                  ...
                </span>
              );
            }

            return (
              <Button
                key={pageNum}
                variant={pageNum === currentPage ? "default" : "outline"}
                size="sm"
                className={`h-8 w-8 ${
                  pageNum === currentPage
                    ? "text-white hover:opacity-90 bg-brand"
                    : "border-gray-300"
                }`}
                onClick={() => {
                  handlePageChange(Number(pageNum));
                  table.setPageIndex(Number(pageNum) - 1);
                }}
              >
                {pageNum}
              </Button>
            );
          })}
        </div>

        {/* Next Button */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => {
            handlePageChange(currentPage + 1);
            table.nextPage();
          }}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Page Info and Go to Page */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <span className="text-sm text-gray-700">Go to page</span>
        <Select
          value={`${currentPage}`}
          onValueChange={(value) => {
            handlePageChange(Number(value));
            table.setPageIndex(Number(value) - 1);
          }}
        >
          <SelectTrigger className="h-8 w-[70px] border-gray-300">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <SelectItem key={page} value={`${page}`}>
                {String(page)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
