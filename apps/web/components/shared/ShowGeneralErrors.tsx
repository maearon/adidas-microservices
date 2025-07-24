// components/shared/ShowGeneralErrors.tsx
interface ShowGeneralErrorsProps {
  messages: string[]
}

const ShowGeneralErrors = ({ messages }: ShowGeneralErrorsProps) => (
  <div className="text-red-600 text-base bg-red-50 p-2 border border-red-300 rounded">
    {messages.map((msg, index) => (
      <p key={index}>{msg}</p>
    ))}
  </div>
)

export default ShowGeneralErrors
