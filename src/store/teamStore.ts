import { createStore } from "zustand/vanilla";
import { devtools } from "zustand/middleware";
import { Team, CreateTeamData, UpdateTeamData } from "@/types/team.type";
import { mockTeams } from "@/data/teams";

export interface TeamState {
  teams: Team[];
  loading: boolean;
  error: string | null;
  isSubmitting: boolean;
}

export interface TeamActions {
  createTeam: (teamData: CreateTeamData) => Promise<Team>;
  updateTeam: (teamData: UpdateTeamData) => Promise<Team>;
  deleteTeam: (id: string) => Promise<void>;
  getTeam: (id: string) => Promise<Team | undefined>;
  getAllTeams: () => Promise<Team[]>;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export type TeamStore = TeamState & TeamActions;

const simulateDelay = (ms: number = 500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const defaultInitState: TeamState = {
  teams: [],
  loading: true,
  error: null,
  isSubmitting: false,
};

export const createTeamStore = (initState: TeamState = defaultInitState) => {
  return createStore<TeamStore>()(
    devtools(
      (set, get) => ({
        ...initState,

        createTeam: async (teamData: CreateTeamData): Promise<Team> => {
          set({ error: null, isSubmitting: true });

          try {
            await simulateDelay();

            const newTeam: Team = {
              id: `team-${Date.now()}`,
              ...teamData,
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            set((state) => ({
              teams: [newTeam, ...state.teams],
              isSubmitting: false,
            }));

            return newTeam;
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "An unexpected error occurred";
            set({ error: errorMessage, isSubmitting: false });
            throw error;
          }
        },

        updateTeam: async (teamData: UpdateTeamData): Promise<Team> => {
          set({ error: null, isSubmitting: true });

          try {
            await simulateDelay();

            const { id, ...updateData } = teamData;

            set((state) => ({
              teams: state.teams.map((team) =>
                team.id === id ? { ...team, ...updateData, updatedAt: new Date() } : team
              ),
              isSubmitting: false,
            }));

            const updatedTeam = get().teams.find((team) => team.id === id);
            if (!updatedTeam) {
              throw new Error("Team not found after update");
            }

            return updatedTeam;
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "An unexpected error occurred";
            set({ error: errorMessage, isSubmitting: false });
            throw error;
          }
        },

        deleteTeam: async (id: string): Promise<void> => {
          set({ error: null, isSubmitting: true });

          try {
            await simulateDelay();

            set((state) => ({
              teams: state.teams.filter((team) => team.id !== id),
              isSubmitting: false,
            }));
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "An unexpected error occurred";
            set({ error: errorMessage, isSubmitting: false });
            throw error;
          }
        },

        getTeam: async (id: string): Promise<Team | undefined> => {
          set({ loading: true, error: null });

          try {
            await simulateDelay();

            const team = mockTeams.find((team) => team.id === id);
            set({ loading: false });
            return team;
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "An unexpected error occurred";
            set({ error: errorMessage, loading: false });
            throw error;
          }
        },

        getAllTeams: async (): Promise<Team[]> => {
          set({ loading: true, error: null });

          try {
            await simulateDelay();

            set({ teams: mockTeams, loading: false });
            return mockTeams;
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "An unexpected error occurred";
            set({ error: errorMessage, loading: false });
            throw error;
          }
        },

        setError: (error: string | null) => set({ error }),
        clearError: () => set({ error: null }),
      }),
      {
        name: "team-store",
      }
    )
  );
};
