export type ErrorMessages = Record<string, string[]>;

import type { FormikErrors } from "formik";

export function normalizeFormikErrors<T extends object>(
  errors: FormikErrors<T>
): ErrorMessages {
  const result: ErrorMessages = {};
  for (const key in errors) {
    const value = errors[key];
    if (!value) continue;
    if (Array.isArray(value)) {
      result[key] = value.map(String);
    } else if (typeof value === "string") {
      result[key] = [value];
    } else {
      // Nếu có nested object, có thể đệ quy (tùy yêu cầu)
      result[key] = [JSON.stringify(value)];
    }
  }
  return result;
}

interface ShowErrorsProps {
  errorMessage: ErrorMessages | null | undefined;
}

const ShowErrors = ({ errorMessage }: ShowErrorsProps) => {
  if (!errorMessage) return null;

  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded space-y-1 text-base">
      {Object.entries(errorMessage).map(([field, messages]) =>
        messages.map((msg, idx) => (
          <p key={`${field}-${idx}`}>
            {field !== "general" ? `${field}: ${msg}` : msg}
          </p>
        ))
      )}
    </div>
  );
};

export default ShowErrors;
