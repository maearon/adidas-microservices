interface FieldErrorProps {
  messages?: string[];
}

export default function FieldError({ messages }: FieldErrorProps) {
  if (!messages || messages.length === 0) return null;

  return (
    <div className="text-red-500 text-base mt-1">
      {messages.map((msg, idx) => (
        <p key={idx}>{msg}</p>
      ))}
    </div>
  );
}
