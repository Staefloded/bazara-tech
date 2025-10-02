import { InfoIcon } from "lucide-react";

const FormError = ({ error }: { error: string | undefined }) => {
  return (
    error && (
      <span className="text-red-500 mt-1 text-xs flex items-start space-x-1">
        <InfoIcon className="w-4 h-4" /> <span>{error}</span>
      </span>
    )
  );
};

export default FormError;
