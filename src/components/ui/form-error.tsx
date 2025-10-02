import { InfoIcon } from "lucide-react";

const FormError = ({ error, id }: { error: string | undefined; id?: string }) => {
  return (
    error && (
      <span
        id={id}
        className="text-red-500 mt-1 text-xs flex items-start space-x-1"
        role="alert"
        aria-live="polite"
      >
        <InfoIcon className="w-4 h-4" aria-hidden="true" /> <span>{error}</span>
      </span>
    )
  );
};

export default FormError;
