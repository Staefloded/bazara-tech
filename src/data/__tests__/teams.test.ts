import { generateTeamCode, generateTeams, mockTeams } from "../teams";

describe("Teams Data Generation", () => {
  describe("generateTeamCode", () => {
    it("should generate code with padded index", () => {
      const code1 = generateTeamCode("Test Team", 1);
      const code2 = generateTeamCode("Test Team", 10);
      expect(code1).toBe("TT001");
      expect(code2).toBe("TT010");
    });

    it("should handle team names with special characters", () => {
      const code = generateTeamCode("R&D Team", 1);
      expect(code).toBe("RT001");
    });

    it("should handle empty team name", () => {
      const code = generateTeamCode("", 1);
      expect(code).toBe("001");
    });
  });

  describe("generateTeams", () => {
    it("should generate the correct number of teams", () => {
      const teams = generateTeams();
      expect(teams).toHaveLength(520);
    });

    it("should generate teams with all required properties", () => {
      const teams = generateTeams();
      teams.forEach((team) => {
        expect(team).toHaveProperty("id");
        expect(team).toHaveProperty("name");
        expect(team).toHaveProperty("code");
        expect(team).toHaveProperty("email");
        expect(team).toHaveProperty("status");
      });
    });

    it("should generate unique IDs for all teams", () => {
      const teams = generateTeams();
      const ids = teams.map((team) => team.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(teams.length);
    });

    it("should generate valid email addresses", () => {
      const teams = generateTeams();
      teams.forEach((team) => {
        expect(team.email).toMatch(/^[a-z0-9-]+@company\.com$/);
      });
    });

    it("should generate valid status values", () => {
      const teams = generateTeams();
      teams.forEach((team) => {
        expect(["Active", "Inactive"]).toContain(team.status);
      });
    });
  });

  describe("mockTeams", () => {
    it("should be defined and be an array", () => {
      expect(mockTeams).toBeDefined();
      expect(Array.isArray(mockTeams)).toBe(true);
    });

    it("should have unique IDs", () => {
      const ids = mockTeams.map((team) => team.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(mockTeams.length);
    });
  });
});
