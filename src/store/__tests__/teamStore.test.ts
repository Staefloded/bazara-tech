import { createTeamStore } from "../teamStore";
import { CreateTeamData, UpdateTeamData } from "@/types/team.type";

// Mock the data module
jest.mock("@/data/teams", () => ({
  mockTeams: [
    {
      id: "team-1",
      name: "Test Team 1",
      code: "TEST1",
      email: "test1@company.com",
      entity: "Test Entity",
      manager: "Test Manager",
      status: "Active" as const,
      description: "Test description",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
  ],
}));

describe("Team Store", () => {
  let store: ReturnType<typeof createTeamStore>;

  beforeEach(() => {
    store = createTeamStore();
  });

  describe("initial state", () => {
    it("should have correct initial state", () => {
      const state = store.getState();
      expect(state.teams).toEqual([]);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
      expect(state.isSubmitting).toBe(false);
    });
  });

  describe("createTeam", () => {
    it("should add a new team", async () => {
      const newTeamData: CreateTeamData = {
        name: "New Team",
        description: "New Description",
        code: "NEW01",
        email: "new@company.com",
        entity: "New Entity",
        manager: "New Manager",
        status: "Active",
      };

      const createdTeam = await store.getState().createTeam(newTeamData);

      expect(createdTeam).toMatchObject({
        name: "New Team",
        code: "NEW01",
      });
      expect(store.getState().teams).toHaveLength(1);
      expect(store.getState().teams[0]).toMatchObject(newTeamData);
    });
  });

  describe("updateTeam", () => {
    beforeEach(async () => {
      await store.getState().createTeam({
        name: "Initial Team",
        description: "Initial Description",
        code: "INIT1",
        email: "initial@company.com",
        entity: "Initial Entity",
        manager: "Initial Manager",
        status: "Active",
      });
    });

    it("should update an existing team", async () => {
      const teamToUpdate = store.getState().teams[0];
      const updatedTeamData: UpdateTeamData = {
        id: teamToUpdate.id,
        name: "Updated Team Name",
        status: "Inactive",
      };

      const updatedTeam = await store.getState().updateTeam(updatedTeamData);

      expect(updatedTeam).toMatchObject({
        id: teamToUpdate.id,
        name: "Updated Team Name",
        status: "Inactive",
      });
      expect(store.getState().teams[0].name).toBe("Updated Team Name");
    });
  });

  describe("deleteTeam", () => {
    beforeEach(async () => {
      await store.getState().createTeam({
        name: "Team to Delete",
        description: "Desc",
        code: "DEL01",
        email: "del@company.com",
        entity: "Entity",
        manager: "Manager",
        status: "Active",
      });
    });

    it("should remove a team", async () => {
      const teamToDelete = store.getState().teams[0];
      await store.getState().deleteTeam(teamToDelete.id);
      expect(store.getState().teams).toHaveLength(0);
    });
  });

  describe("getAllTeams", () => {
    it("should load all teams successfully", async () => {
      const result = await store.getState().getAllTeams();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("team-1");

      const state = store.getState();
      expect(state.teams).toHaveLength(1);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(null);
    });
  });

  describe("getTeam", () => {
    beforeEach(async () => {
      await store.getState().getAllTeams();
    });

    it("should get existing team", async () => {
      const team = await store.getState().getTeam("team-1");

      expect(team).toBeDefined();
      expect(team?.id).toBe("team-1");
      expect(team?.name).toBe("Test Team 1");
    });

    it("should return undefined for non-existent team", async () => {
      const team = await store.getState().getTeam("non-existent");
      expect(team).toBeUndefined();
    });
  });

  describe("setError and clearError", () => {
    it("should set an error message", () => {
      store.getState().setError("Test error message");
      expect(store.getState().error).toBe("Test error message");
    });

    it("should clear the error message", () => {
      store.getState().setError("Test error message");
      store.getState().clearError();
      expect(store.getState().error).toBe(null);
    });
  });
});
