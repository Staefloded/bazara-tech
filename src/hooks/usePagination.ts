import { PaginationState } from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const usePagination = (pageSize = 10) => {
  const search = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [pagination, setPagination] = useState<PaginationState>(() => {
    const pageParam = search.get("page");
    const pageSizeParam = search.get("pageSize");

    const pageIndex = pageParam ? Number(pageParam) - 1 : 0;
    const _pageSize = pageSizeParam ? Number(pageSizeParam) : pageSize;

    return {
      pageIndex: isNaN(pageIndex) ? 0 : pageIndex,
      pageSize: isNaN(_pageSize) ? pageSize : _pageSize,
    };
  });

  const handlePageChange = (page: number | null) => {
    if (page) {
      router.push(`${pathname}?page=${page}&pageSize=${pageSize}`);
    }
  };

  const handlePageSizeChange = (pageSize: number) => {
    if (pageSize) {
      router.push(`${pathname}?page=1&pageSize=${pageSize}`);
    }
  };

  return { pagination, setPagination, handlePageChange, handlePageSizeChange };
};

export default usePagination;
