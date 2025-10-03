import {
  filterTeams,
  sortTeams,
  paginateTeams,
  getTotalPages,
  validateTeamCode,
} from "../teamUtils";
import { Team } from "@/types/team.type";

const mockTeams: Team[] = [
  {
    id: "1",
    name: "Development Team",
    code: "DEV01",
    email: "dev@company.com",
    entity: "Engineering",
    manager: "John Doe",
    status: "Active",
    description: "Frontend team",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "Marketing Team",
    code: "MKT01",
    email: "marketing@company.com",
    entity: "Marketing",
    manager: "Jane Smith",
    status: "Active",
    description: "Digital marketing",
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02"),
  },
  {
    id: "3",
    name: "Sales Team",
    code: "SALES01",
    email: "sales@company.com",
    entity: "Sales",
    manager: "Bob Johnson",
    status: "Inactive",
    description: "Sales team",
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-03"),
  },
];

const edgeCaseTeams: Team[] = [
  {
    id: "team-1",
    name: "Alpha Team",
    code: "ALPHA",
    email: "alpha@company.com",
    entity: "Entity A",
    manager: "Manager A",
    status: "Active",
    description: "First team",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-02"),
  },
  {
    id: "team-2",
    name: "Beta Team",
    code: "BETA",
    email: "beta@company.com",
    entity: "Entity B",
    manager: "Manager B",
    status: "Inactive",
    description: "Second team",
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-04"),
  },
];

describe("teamUtils", () => {
  describe("filterTeams", () => {
    it("should filter by search term", () => {
      const result = filterTeams(mockTeams, { search: "Development" });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Development Team");
    });

    it("should filter by status", () => {
      const result = filterTeams(mockTeams, { status: "Active" });
      expect(result).toHaveLength(2);
    });

    it("should apply multiple filters", () => {
      const result = filterTeams(mockTeams, { status: "Active", entity: "Engineering" });
      expect(result).toHaveLength(1);
    });

    it("should handle empty teams array", () => {
      const result = filterTeams([], { search: "test" });
      expect(result).toEqual([]);
    });

    it("should handle empty filters", () => {
      const result = filterTeams(edgeCaseTeams, {});
      expect(result).toEqual(edgeCaseTeams);
    });

    it("should handle case-insensitive search", () => {
      const result = filterTeams(edgeCaseTeams, { search: "ALPHA" });
      expect(result).toHaveLength(1);
    });
  });

  describe("sortTeams", () => {
    it("should sort by name ascending", () => {
      const result = sortTeams(mockTeams, { field: "name", direction: "asc" });
      expect(result[0].name).toBe("Development Team");
    });

    it("should sort by name descending", () => {
      const result = sortTeams(mockTeams, { field: "name", direction: "desc" });
      expect(result[0].name).toBe("Sales Team");
    });

    it("should handle empty teams array", () => {
      const result = sortTeams([], { field: "name", direction: "asc" });
      expect(result).toEqual([]);
    });

    it("should handle date sorting", () => {
      const result = sortTeams(edgeCaseTeams, { field: "createdAt", direction: "desc" });
      expect(result[0].name).toBe("Beta Team");
    });
  });

  describe("paginateTeams", () => {
    it("should return first page", () => {
      const result = paginateTeams(mockTeams, { pageIndex: 0, pageSize: 2 });
      expect(result).toHaveLength(2);
    });

    it("should return second page", () => {
      const result = paginateTeams(mockTeams, { pageIndex: 1, pageSize: 2 });
      expect(result).toHaveLength(1);
    });

    it("should handle empty teams array", () => {
      const result = paginateTeams([], { pageIndex: 0, pageSize: 10 });
      expect(result).toEqual([]);
    });

    it("should handle page beyond available data", () => {
      const result = paginateTeams(edgeCaseTeams, { pageIndex: 10, pageSize: 10 });
      expect(result).toEqual([]);
    });
  });

  describe("getTotalPages", () => {
    it("should calculate pages correctly", () => {
      expect(getTotalPages(10, 3)).toBe(4);
      expect(getTotalPages(10, 5)).toBe(2);
    });

    it("should handle zero total items", () => {
      expect(getTotalPages(0, 10)).toBe(0);
    });

    it("should handle zero page size", () => {
      expect(getTotalPages(10, 0)).toBe(Infinity);
    });
  });

  describe("validateTeamCode", () => {
    it("should return true for unique code", () => {
      expect(validateTeamCode("NEW01", mockTeams)).toBe(true);
    });

    it("should return false for existing code", () => {
      expect(validateTeamCode("DEV01", mockTeams)).toBe(false);
    });

    it("should handle empty code", () => {
      expect(validateTeamCode("", edgeCaseTeams)).toBe(false);
    });

    it("should handle whitespace only code", () => {
      expect(validateTeamCode("   ", edgeCaseTeams)).toBe(false);
    });

    it("should trim whitespace", () => {
      expect(validateTeamCode(" NEW01 ", edgeCaseTeams)).toBe(true);
    });
  });
});
