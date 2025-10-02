"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { SuccessModal } from "../../components/modal/success-modal";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Team, CreateTeamData } from "@/types/team.type";
import {
  createTeamValidationSchema,
  updateTeamValidationSchema,
  TeamFormData,
} from "@/schema/team.schema";
import { useTeamActions } from "@/store/providers/team-provider";
import { Textarea } from "../../components/ui/textarea";
import FormError from "../../components/ui/form-error";
import { ConfirmationModal } from "../../components/modal/confirmation-modal";

import { generateTeamCode } from "@/data/teams";

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  team?: Team | null;
  mode: "create" | "edit";
  uniqueEntities: string[];
  uniqueManagers: string[];
}

enum Stages {
  FILL_DETAILS = "FILL_DETAILS",
  CONFIRMATION = "CONFIRMATION",
  SUCCESS = "SUCCESS",
}

export function TeamModal({
  isOpen,
  onClose,
  team,
  mode,
  uniqueEntities,
  uniqueManagers,
}: TeamModalProps) {
  const { createTeam, updateTeam, teams, isSubmitting } = useTeamActions();
  const [stage, setStage] = useState<Stages>(Stages.FILL_DETAILS);

  const validationSchema =
    mode === "edit" && team
      ? updateTeamValidationSchema(teams, team.id)
      : createTeamValidationSchema(teams);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<TeamFormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      name: team?.name || "",
      description: team?.description || "",
      code: team?.code || "",
      email: team?.email || "",
      entity: team?.entity || "",
      manager: team?.manager || "",
      status: team?.status || "Active",
    },
    mode: "all",
  });

  const onSubmit = async (data: TeamFormData) => {
    try {
      if (mode === "create") {
        await createTeam(data as CreateTeamData);
      } else if (mode === "edit" && team) {
        await updateTeam({ ...data, id: team.id });
      }
      setStage(Stages.SUCCESS);
    } catch (error) {
      console.error("Error submitting team:", error);
      setStage(Stages.FILL_DETAILS);
    }
  };

  const handleConfirm = async () => {
    const formData = watch();
    await onSubmit(formData);
  };

  const handleSuccess = () => {
    onClose();
    reset();
    setStage(Stages.FILL_DETAILS);
  };

  const handleCancel = () => {
    setStage(Stages.FILL_DETAILS);
  };

  const handleFormSubmit = () => {
    setStage(Stages.CONFIRMATION);
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  const renderStages = {
    [Stages.FILL_DETAILS]: (
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="space-y-1">
          <Label htmlFor="entity" className="text-sm font-medium">
            Entity <span className="text-red-500">*</span>
          </Label>
          <Select
            value={watch("entity")}
            onValueChange={(value) => setValue("entity", value, { shouldValidate: true })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select entity" />
            </SelectTrigger>
            <SelectContent>
              {uniqueEntities.map((entity) => (
                <SelectItem key={entity} value={entity}>
                  {entity}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {errors.entity && <FormError error={errors.entity?.message} />}
        </div>

        <div className="space-y-1">
          <Label htmlFor="name" className="text-sm font-medium">
            Team Name <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="name"
              placeholder="Enter team name"
              {...register("name")}
              className={errors.name ? "border-red-500" : ""}
            />
            {!errors.name && watch("name") && (
              <Check className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
            )}
          </div>
          {errors.name && <FormError error={errors.name?.message} />}
        </div>

        <div className="space-y-1">
          <Label htmlFor="code" className="text-sm font-medium">
            Code <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="code"
              placeholder="Enter team code here"
              {...register("code")}
              className={errors.code ? "border-red-500" : ""}
              onChange={(e) => {
                setValue("code", e.target.value.toUpperCase());
              }}
              maxLength={5}
              disabled={mode === "edit"}
            />

            {mode === "create" && watch("name") && (
              <button
                type="button"
                className="absolute right-10 top-1/2 -translate-y-1/2 text-brand cursor-pointer text-xs"
                onClick={() => {
                  setValue("code", generateTeamCode(watch("name"), 1), {
                    shouldValidate: true,
                  });
                }}
              >
                Auto Generate
              </button>
            )}

            {!errors.code && watch("code") && (
              <Check className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
            )}
          </div>

          {errors.code && <FormError error={errors.code?.message} />}
          <p className="text-xs text-gray-500">Min.: 3 and Max.: 5 characters</p>
        </div>

        <div className="space-y-1">
          <Label htmlFor="manager" className="text-sm font-medium">
            Team Manager <span className="text-red-500">*</span>
          </Label>
          <Select
            value={watch("manager")}
            onValueChange={(value) => setValue("manager", value, { shouldValidate: true })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select manager" />
            </SelectTrigger>
            <SelectContent>
              {uniqueManagers.map((manager) => (
                <SelectItem key={manager} value={manager}>
                  {manager}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {errors.manager && <FormError error={errors.manager?.message} />}
        </div>

        <div className="space-y-1">
          <Label htmlFor="description" className="text-sm font-medium">
            Description <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="description"
            placeholder="Enter the description of this Team"
            {...register("description")}
            className={errors.description ? "border-red-500" : ""}
          />

          {errors.description && <FormError error={errors.description?.message} />}
        </div>

        <div className="space-y-1">
          <Label htmlFor="email" className="text-sm font-medium">
            Team Email Address <span className="text-red-500">*</span>
          </Label>

          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="Enter team email address"
              {...register("email")}
              className={`${
                errors.email ? "border-red-500" : ""
              } border-purple-300 focus:border-purple-500 focus:ring-purple-500`}
            />

            {!errors.email && watch("email") && (
              <Check className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
            )}
          </div>
          {errors.email && <FormError error={errors.email?.message} />}

          <p className="text-sm text-gray-600 py-1 rounded-md">
            Everyone in this Team receives an email whenever a message is sent to this email
            address.
          </p>
        </div>

        <DialogFooter className="flex gap-2">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Close
          </Button>

          <Button type="submit" variant="brand" disabled={isSubmitting}>
            {mode === "create" ? "Create" : "Update"}
          </Button>
        </DialogFooter>
      </form>
    ),
    [Stages.CONFIRMATION]: (
      <ConfirmationModal
        title={mode === "create" ? "Create Team" : "Update Team"}
        message={
          mode === "create"
            ? "Are you sure you want to create this team?"
            : "Are you sure you want to update this team?"
        }
        confirmText={mode === "create" ? "Yes, Create" : "Yes, Update"}
        cancelText="Close"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        isLoading={isSubmitting}
      />
    ),
    [Stages.SUCCESS]: (
      <SuccessModal
        title={mode === "create" ? "Team Created" : "Team Updated"}
        message={`You have ${mode === "create" ? "created" : "updated"} this team successfully.`}
        buttonText="Done"
        onDone={handleSuccess}
      />
    ),
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto">
        {stage === Stages.FILL_DETAILS && (
          <DialogHeader>
            <DialogTitle>{mode === "create" ? "New Team" : "Edit Team"}</DialogTitle>
          </DialogHeader>
        )}

        {renderStages[stage]}
      </DialogContent>
    </Dialog>
  );
}
