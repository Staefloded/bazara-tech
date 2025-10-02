export interface Team {
  id: string;
  name: string;
  description: string;
  code: string;
  email: string;
  entity: string;
  manager: string;
  status: "Active" | "Inactive";
  createdAt: Date;
  updatedAt: Date;
}

export type TeamStatus = Team["status"];

export interface CreateTeamData {
  name: string;
  description: string;
  code: string;
  email: string;
  entity: string;
  manager: string;
  status: TeamStatus;
}

export interface UpdateTeamData extends Partial<CreateTeamData> {
  id: string;
}

export interface TeamFilters {
  search?: string;
  status?: TeamStatus;
  entity?: string;
  manager?: string;
}

export interface TeamSortConfig {
  field: keyof Team;
  direction: "asc" | "desc";
}
