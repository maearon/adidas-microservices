// components/shared/errorMessages.tsx
export type ErrorMessageType = {
  [field: string]: string[];
};

const ShowErrors = ({ errorMessage }: { errorMessage: ErrorMessageType }) => {
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
