export function LocaleCountryRadio({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden
      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-black dark:border-white"
    >
      {checked && (
        <span className="h-2.5 w-2.5 rounded-full bg-black dark:bg-white" />
      )}
    </span>
  )
}
