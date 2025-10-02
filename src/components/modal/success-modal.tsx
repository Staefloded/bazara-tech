"use client";

import { CheckCircle } from "lucide-react";
import { Button } from "../ui/button";

interface SuccessModalProps {
  title: string;
  message: string;
  buttonText?: string;
  onDone: () => void;
}

export function SuccessModal({ title, message, buttonText = "Done", onDone }: SuccessModalProps) {
  return (
    <div
      className="flex flex-col items-center space-y-6 p-2"
      role="dialog"
      aria-labelledby="success-title"
      aria-describedby="success-message"
    >
      <div
        className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center"
        aria-hidden="true"
      >
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>

      <h3 id="success-title" className="text-xl font-semibold text-gray-900 text-center">
        {title}
      </h3>

      <p id="success-message" className="text-gray-600 text-center max-w-sm">
        {message}
      </p>

      <Button
        type="button"
        onClick={onDone}
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 w-full"
      >
        {buttonText}
      </Button>
    </div>
  );
}
