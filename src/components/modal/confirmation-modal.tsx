"use client";

import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface ConfirmationModalProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "default" | "danger";
  isLoading?: boolean;
}

// Custom Warning Icon Component
const WarningIcon = ({ isDanger }: { isDanger: boolean }) => {
  const fillColor = isDanger ? "#E43A39" : "#1659E6";
  const strokeColor = isDanger ? "#E43A39" : "#1659E6";

  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12.0242 3.22894C12.5606 2.77069 13.4713 2.77074 14.0076 3.22894L14.0086 3.22992L15.6932 4.66937L15.699 4.67328C15.9207 4.85796 16.2124 5.00789 16.4949 5.11078C16.7775 5.21364 17.0998 5.28748 17.3943 5.28754H19.2078C20.0438 5.28754 20.733 5.97699 20.7332 6.81293V8.6264C20.7332 8.92167 20.8086 9.24224 20.9119 9.52289C21.0153 9.8037 21.1641 10.0918 21.3475 10.312L21.3524 10.3168L22.7918 12.0024C23.2535 12.5531 23.2451 13.4574 22.7791 13.977L22.7703 13.9868L21.3309 15.6723L21.326 15.6772C21.1426 15.8973 20.9938 16.1855 20.8904 16.4662C20.7871 16.7469 20.7117 17.0675 20.7117 17.3627V19.1762C20.7116 20.0122 20.0224 20.7016 19.1863 20.7016H17.3729C17.0778 20.7017 16.7578 20.7761 16.4774 20.8793C16.1965 20.9827 15.9084 21.1324 15.6883 21.3159L15.6824 21.3198L13.9979 22.7602C13.4615 23.2188 12.55 23.2187 12.0135 22.7602L10.3279 21.3198L10.3231 21.3159L10.1443 21.184C9.95585 21.0596 9.73945 20.9564 9.52911 20.8793C9.24881 20.7767 8.9281 20.7016 8.63751 20.7016H6.78107C5.94515 20.7014 5.2558 20.0121 5.25568 19.1762V17.352C5.25568 17.0652 5.18499 16.7469 5.08478 16.4662C4.98545 16.1881 4.8381 15.8944 4.64825 15.6733H4.64923L3.2088 13.977L3.1297 13.8745C2.76298 13.342 2.78374 12.5133 3.21271 11.9955L4.64923 10.3051L4.65216 10.3012C4.83757 10.0787 4.98457 9.78825 5.08478 9.50922C5.185 9.23003 5.25568 8.91379 5.25568 8.6264V6.81293C5.25589 5.97709 5.94521 5.28769 6.78107 5.28754H8.62677C8.92201 5.28752 9.24263 5.21311 9.52325 5.1098C9.80408 5.00639 10.0922 4.85668 10.3123 4.67328L10.3143 4.67133L12.0213 3.23187L12.0242 3.22894ZM12.9998 15.5278C12.1046 15.5279 11.4002 16.2507 11.4002 17.1284C11.4004 18.0093 12.1188 18.7279 12.9998 18.728C13.8951 18.728 14.6002 18.0059 14.6004 17.1284C14.6004 16.2471 13.881 15.5278 12.9998 15.5278ZM12.9998 7.53851C12.2682 7.53862 11.6671 8.13991 11.6668 8.87152V14.0239C11.6668 14.7557 12.268 15.3568 12.9998 15.3569C13.7317 15.3569 14.3338 14.7557 14.3338 14.0239V8.87152C14.3335 8.13985 13.7315 7.53851 12.9998 7.53851Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1.06667"
      />
    </svg>
  );
};

export function ConfirmationModal({
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "default",
  isLoading = false,
}: ConfirmationModalProps) {
  const isDanger = variant === "danger";

  return (
    <div className="flex flex-col items-center space-y-6 p-2">
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center ${
          isDanger ? "bg-red-100" : "bg-blue-100"
        }`}
      >
        <WarningIcon isDanger={isDanger} />
      </div>

      <h3 className="text-xl font-semibold text-gray-900 text-center">{title}</h3>

      <p className="text-gray-600 text-center max-w-sm">{message}</p>

      <div className="flex gap-3 w-full max-w-xs">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 w-full"
        >
          {cancelText}
        </Button>
        <Button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          className={cn(
            "flex-1 w-full",
            isDanger && "bg-[#E43A39] hover:bg-[#D32F2F] text-white",
            !isDanger && "bg-blue-600 hover:bg-blue-700 text-white"
          )}
        >
          {isLoading ? "Processing..." : confirmText}
        </Button>
      </div>
    </div>
  );
}
