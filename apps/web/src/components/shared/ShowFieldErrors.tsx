// components/shared/ShowFieldErrors.tsx
interface ShowFieldErrorsProps {
  errors: string[]
}

const ShowFieldErrors = ({ errors }: ShowFieldErrorsProps) => (
  <ul className="text-base text-red-600 mt-1 space-y-1">
    {errors.map((error, idx) => (
      <li key={idx}>• {error}</li>
    ))}
  </ul>
)

export default ShowFieldErrors
