"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Input } from "./ui/input"
import { SearchIcon, X } from "lucide-react"
import { useEffect, useState } from "react"
import SearchAutocomplete from "./SearchAutocomplete"
import useDebounce from "@/hooks/useDebounce"
import { useTranslations } from "@/hooks/useTranslations"

export default function SearchField() {
  const pathname = usePathname()
  const searchParams = useSearchParams();
  const router = useRouter()
  const [searchText, setSearchText] = useState("")
  const debouncedSearchText = useDebounce(searchText, 300);
  const t = useTranslations("common")

  // ✅ Clear input nếu đang ở /search
  // Sync input với param q khi lịch sử thay đổi hoặc mount mới
  useEffect(() => {
    // if (pathname === "/search") {
    //   const qParam = searchParams.get("q") ?? "";
    //   setSearchText(qParam);
    // }
    setSearchText("");
  }, [pathname, searchParams]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const q = (form.q as HTMLInputElement).value.trim()
    if (!q) return
    setSearchText("");
    router.push(`/search?q=${encodeURIComponent(q)}`)
  }

  function clearInput() {
    setSearchText("")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative mb-1 mt-2 w-full sm:w-36 md:w-40 lg:w-44"
    >
      <div className="relative">
        <Input
          name="q"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder={t?.searchPlaceholder || "Search"}
          className="
            border-none
            pe-10 
            bg-[#ECEFF1] dark:bg-[#374151]
            placeholder-black dark:placeholder-white
            focus:placeholder-transparent 
            text-base
            text-black dark:text-white
            pl-2
            pr-1 
            py-1
            rounded-none
            focus:rounded-[1px]
            focus:outline-hidden 
            focus:ring-1 
            focus:ring-black
            dark:focus:ring-white"
        />

        {searchText ? (
          <X
            className="absolute right-1 top-1/2 size-5 -translate-y-1/2 text-black dark:text-white cursor-pointer hover:opacity-70"
            onClick={clearInput}
          />
        ) : (
          <SearchIcon className="absolute right-1 top-1/2 size-5 -translate-y-1/2 text-black dark:text-white" />
        )}
      </div>

      {debouncedSearchText && (
        <SearchAutocomplete keyword={debouncedSearchText} />
      )}
    </form>
  )
}
