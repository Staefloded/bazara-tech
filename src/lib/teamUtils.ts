import { Team, TeamFilters, TeamSortConfig } from "@/types/team.type";
import { PaginationState } from "@tanstack/react-table";

export const filterTeams = (teams: Team[], filters: TeamFilters): Team[] => {
  return teams.filter((team) => {
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesName = team.name.toLowerCase().includes(searchTerm);
      const matchesCode = team.code.toLowerCase().includes(searchTerm);

      if (!matchesName && !matchesCode) {
        return false;
      }
    }

    if (filters.status && team.status !== filters.status) {
      return false;
    }

    if (filters.entity && team.entity !== filters.entity) {
      return false;
    }

    if (filters.manager && team.manager !== filters.manager) {
      return false;
    }

    return true;
  });
};

export const sortTeams = (teams: Team[], sortConfig: TeamSortConfig): Team[] => {
  return [...teams].sort((a, b) => {
    const aValue = a[sortConfig.field];
    const bValue = b[sortConfig.field];

    // Handle different data types
    if (aValue instanceof Date && bValue instanceof Date) {
      const comparison = aValue.getTime() - bValue.getTime();
      return sortConfig.direction === "asc" ? comparison : -comparison;
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      const comparison = aValue.localeCompare(bValue);
      return sortConfig.direction === "asc" ? comparison : -comparison;
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      const comparison = aValue - bValue;
      return sortConfig.direction === "asc" ? comparison : -comparison;
    }

    // Fallback to string comparison
    const aStr = String(aValue);
    const bStr = String(bValue);
    const comparison = aStr.localeCompare(bStr);
    return sortConfig.direction === "asc" ? comparison : -comparison;
  });
};

export const paginateTeams = (teams: Team[], pagination: PaginationState): Team[] => {
  const startIndex = pagination.pageIndex * pagination.pageSize;
  const endIndex = startIndex + pagination.pageSize;

  return teams.slice(startIndex, endIndex);
};

export const getTotalPages = (totalItems: number, pageSize: number): number => {
  return Math.ceil(totalItems / pageSize);
};

export const validateTeamCode = (
  code: string,
  existingTeams: Team[],
  excludeId?: string
): boolean => {
  const trimmedCode = code.trim().toUpperCase();

  // Check if code is empty
  if (!trimmedCode) {
    return false;
  }

  // Check if code already exists (excluding current team if editing)
  const existingTeam = existingTeams.find(
    (team) => team.code.toUpperCase() === trimmedCode && team.id !== excludeId
  );

  return !existingTeam;
};

export const validateTeamEmail = (
  email: string,
  existingTeams: Team[],
  excludeId?: string
): boolean => {
  const trimmedEmail = email.trim().toLowerCase();

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return false;
  }

  // Check if email already exists (excluding current team if editing)
  const existingTeam = existingTeams.find(
    (team) => team.email.toLowerCase() === trimmedEmail && team.id !== excludeId
  );

  return !existingTeam;
};
