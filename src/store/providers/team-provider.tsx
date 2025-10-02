"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import { type TeamStore, createTeamStore, defaultInitState } from "../teamStore";

export type TeamStoreApi = ReturnType<typeof createTeamStore>;

export const TeamStoreContext = createContext<TeamStoreApi | undefined>(undefined);

export interface TeamStoreProviderProps {
  children: ReactNode;
}

export const TeamStoreProvider = ({ children }: TeamStoreProviderProps) => {
  const storeRef = useRef<TeamStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createTeamStore(defaultInitState);
  }

  return <TeamStoreContext.Provider value={storeRef.current}>{children}</TeamStoreContext.Provider>;
};

export const useTeamStore = <T,>(selector: (store: TeamStore) => T): T => {
  const teamStoreContext = useContext(TeamStoreContext);

  if (!teamStoreContext) {
    throw new Error(`useTeamStore must be used within TeamStoreProvider`);
  }

  return useStore(teamStoreContext, selector);
};

export const useTeamActions = () => {
  const createTeam = useTeamStore((state) => state.createTeam);
  const updateTeam = useTeamStore((state) => state.updateTeam);
  const deleteTeam = useTeamStore((state) => state.deleteTeam);
  const getTeam = useTeamStore((state) => state.getTeam);
  const getAllTeams = useTeamStore((state) => state.getAllTeams);
  const setError = useTeamStore((state) => state.setError);
  const clearError = useTeamStore((state) => state.clearError);
  const loading = useTeamStore((state) => state.loading);
  const error = useTeamStore((state) => state.error);
  const teams = useTeamStore((state) => state.teams);
  const isSubmitting = useTeamStore((state) => state.isSubmitting);

  return {
    createTeam,
    updateTeam,
    deleteTeam,
    getTeam,
    getAllTeams,
    setError,
    clearError,
    loading,
    error,
    teams,
    isSubmitting,
  };
};
