import { useEffect, useState } from "react";
import { useTeamActions } from "@/store/providers/team-provider";
import { TeamFilters, TeamSortConfig, Team } from "@/types/team.type";
import { filterTeams, sortTeams, paginateTeams, getTotalPages } from "@/lib/teamUtils";
import usePagination from "./usePagination";

export const useTeamManagement = () => {
  const { createTeam, updateTeam, deleteTeam, getTeam, getAllTeams, loading, teams } =
    useTeamActions();

  useEffect(() => {
    getAllTeams();
  }, []);

  const [filters, setFilters] = useState<TeamFilters>({});
  const [sortConfig, setSortConfig] = useState<TeamSortConfig>({
    field: "createdAt",
    direction: "desc",
  });
  const { pagination, setPagination, handlePageChange } = usePagination();
  const pageIndex = pagination.pageIndex;
  const pageSize = pagination.pageSize;

  const processedTeams = () => {
    let result = teams;

    if (Object.keys(filters).length > 0) {
      result = filterTeams(result, filters);
    }

    result = sortTeams(result, sortConfig);

    result = paginateTeams(result, { pageIndex, pageSize });

    return result;
  };

  const totalFilteredTeams = () => {
    if (loading) {
      return 10;
    }

    if (Object.keys(filters).length > 0) {
      return filterTeams(teams, filters).length;
    }

    return teams.length;
  };

  const totalPages = getTotalPages(totalFilteredTeams(), pageSize);
  const hasNextPage = pageIndex < totalPages - 1;
  const hasPreviousPage = pageIndex > 0;

  const handleSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search: search.trim() || undefined }));
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleStatusFilter = (status: Team["status"] | undefined) => {
    setFilters((prev) => ({ ...prev, status }));
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const clearFilters = () => {
    setFilters({});
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleSort = (field: keyof Team) => {
    setSortConfig((prev) => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleEntityFilter = (entity: string) => {
    setFilters((prev) => ({ ...prev, entity }));
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    handlePageChange(1);
  };

  const handleManagerFilter = (manager: string) => {
    setFilters((prev) => ({ ...prev, manager }));
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const uniqueEntities = Array.from(new Set(teams.map((team: Team) => team.entity))).sort();
  const uniqueManagers = Array.from(new Set(teams.map((team: Team) => team.manager))).sort();

  return {
    teams: processedTeams(),
    totalTeams: teams.length,
    totalFilteredTeams: totalFilteredTeams(),
    filters,
    sortConfig,
    pagination,
    loading,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    createTeam,
    updateTeam,
    deleteTeam,
    getTeam,
    handleSearch,
    handleStatusFilter,
    handleEntityFilter,
    clearFilters,
    handleSort,
    setPagination,
    uniqueEntities,
    uniqueManagers,
    handleManagerFilter,
  };
};
