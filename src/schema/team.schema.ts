import { z } from "zod";
import { Team } from "@/types/team.type";

const validateString = (
  fieldName: string,
  minLength: number,
  maxLength: number,
  additionalValidation?: (schema: z.ZodString) => z.ZodString
) => {
  const baseSchema = z
    .string()
    .min(1, `${fieldName} is required`)
    .min(minLength, `${fieldName} must be at least ${minLength} characters`)
    .max(maxLength, `${fieldName} must be less than ${maxLength} characters`)
    .trim();

  return additionalValidation ? additionalValidation(baseSchema) : baseSchema;
};

export const teamSchema = z.object({
  name: validateString("Team name", 2, 100),

  description: validateString("Description", 10, 500),

  code: validateString("Team code", 3, 5, (schema) =>
    schema.regex(/^[A-Z0-9]+$/, "Team code must contain only uppercase letters and numbers")
  ),

  email: validateString("Email", 1, 100, (schema) =>
    schema.email("Please enter a valid email address").toLowerCase()
  ),

  entity: validateString("Entity", 2, 50),

  manager: validateString("Manager", 2, 100),

  status: z.enum(["Active", "Inactive"], {
    required_error: "Status is required",
    invalid_type_error: "Status must be either Active or Inactive",
  }),
});

export type TeamFormData = z.infer<typeof teamSchema>;

// Generic function to create team validation schema with uniqueness checks
export const createTeamValidationSchema = (existingTeams: Team[], excludeId?: string) => {
  return teamSchema
    .refine(
      (data) => {
        const existingTeam = existingTeams.find(
          (team) => team.code.toUpperCase() === data.code.toUpperCase() && team.id !== excludeId
        );
        return !existingTeam;
      },
      {
        message: "Team code already exists",
        path: ["code"],
      }
    )
    .refine(
      (data) => {
        const existingTeam = existingTeams.find(
          (team) => team.email.toLowerCase() === data.email.toLowerCase() && team.id !== excludeId
        );
        return !existingTeam;
      },
      {
        message: "Email already exists",
        path: ["email"],
      }
    );
};

// Convenience function for update validation (excludes current team ID and email uniqueness)
export const updateTeamValidationSchema = (existingTeams: Team[], excludeId: string) => {
  return teamSchema.refine(
    (data) => {
      const existingTeam = existingTeams.find(
        (team) => team.code.toUpperCase() === data.code.toUpperCase() && team.id !== excludeId
      );
      return !existingTeam;
    },
    {
      message: "Team code already exists",
      path: ["code"],
    }
  );
};
