"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTeamActions } from "@/store/providers/team-provider";
import { Team } from "@/types/team.type";
import { ConfirmationModal } from "@/components/modal/confirmation-modal";
import { SuccessModal } from "@/components/modal/success-modal";

interface DeleteTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team | null;
}

enum DeleteStages {
  CONFIRMATION = "CONFIRMATION",
  SUCCESS = "SUCCESS",
}

export function DeleteTeamModal({ isOpen, onClose, team }: DeleteTeamModalProps) {
  const { deleteTeam, isSubmitting } = useTeamActions();
  const [stage, setStage] = useState<DeleteStages>(DeleteStages.CONFIRMATION);

  const handleConfirm = async () => {
    try {
      if (team) {
        await deleteTeam(team.id);
        setStage(DeleteStages.SUCCESS);
      }
    } catch (error) {
      console.error("Error deleting team:", error);
    }
  };

  const handleSuccess = () => {
    onClose();
    setStage(DeleteStages.CONFIRMATION);
  };

  const handleCancel = () => {
    onClose();
  };

  const handleClose = () => {
    onClose();
    setStage(DeleteStages.CONFIRMATION);
  };

  const renderStages = {
    [DeleteStages.CONFIRMATION]: (
      <ConfirmationModal
        title="Delete Team"
        message="Are you sure you want to deactivate this team?"
        confirmText="Delete"
        cancelText="Close"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        variant="danger"
        isLoading={isSubmitting}
      />
    ),
    [DeleteStages.SUCCESS]: (
      <SuccessModal
        title="Team Deleted"
        message="You have deleted this team successfully."
        buttonText="Done"
        onDone={handleSuccess}
      />
    ),
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="sr-only">
            {stage === DeleteStages.CONFIRMATION ? "Delete Team" : "Team Deleted"}
          </DialogTitle>
        </DialogHeader>
        {renderStages[stage]}
      </DialogContent>
    </Dialog>
  );
}
