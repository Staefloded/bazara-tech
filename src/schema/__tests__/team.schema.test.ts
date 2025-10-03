import { teamSchema, createTeamValidationSchema, updateTeamValidationSchema } from "../team.schema";
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
];

const validTeamData = {
  name: "Test Team",
  description: "This is a test team description",
  code: "TEST1",
  email: "test@company.com",
  entity: "Test Entity",
  manager: "Test Manager",
  status: "Active" as const,
};

describe("teamSchema", () => {
  it("should validate correct team data", () => {
    const result = teamSchema.safeParse(validTeamData);
    expect(result.success).toBe(true);
  });

  it("should reject empty name", () => {
    const result = teamSchema.safeParse({ ...validTeamData, name: "" });
    expect(result.success).toBe(false);
  });

  it("should reject invalid email", () => {
    const result = teamSchema.safeParse({ ...validTeamData, email: "invalid-email" });
    expect(result.success).toBe(false);
  });

  it("should reject invalid status", () => {
    const result = teamSchema.safeParse({ ...validTeamData, status: "Pending" });
    expect(result.success).toBe(false);
  });
});

describe("createTeamValidationSchema", () => {
  it("should validate unique team code", () => {
    const result = createTeamValidationSchema(mockTeams).safeParse({
      ...validTeamData,
      code: "UNIQ1",
    });
    expect(result.success).toBe(true);
  });

  it("should reject duplicate team code", () => {
    const result = createTeamValidationSchema(mockTeams).safeParse({
      ...validTeamData,
      code: "DEV01",
    });
    expect(result.success).toBe(false);
  });
});

describe("updateTeamValidationSchema", () => {
  it("should allow same team to keep its code", () => {
    const result = updateTeamValidationSchema(mockTeams, "1").safeParse({
      ...validTeamData,
      code: "DEV01",
    });
    expect(result.success).toBe(true);
  });

  it("should reject duplicate code from other teams", () => {
    const result = updateTeamValidationSchema(mockTeams, "2").safeParse({
      ...validTeamData,
      code: "DEV01",
    });
    expect(result.success).toBe(false);
  });
});
