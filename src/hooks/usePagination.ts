import { PaginationState } from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const usePagination = (pageSize = 10) => {
  const search = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: search.get("page") ? Number(search.get("page")) - 1 : 0,
    pageSize: search.get("pageSize") ? Number(search.get("pageSize")) : pageSize,
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
