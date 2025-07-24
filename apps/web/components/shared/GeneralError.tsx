interface GeneralErrorProps {
  messages: string[];
}

export default function GeneralError({ messages }: GeneralErrorProps) {
  if (!messages || messages.length === 0) return null;

  return (
    <div className="text-red-600 text-base bg-red-50 p-2 border border-red-300 rounded">
      {messages.map((msg, idx) => (
        <p key={idx}>{msg}</p>
      ))}
    </div>
  );
}
