"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Input } from "./ui/input"
import { SearchIcon, X } from "lucide-react"
import { useEffect, useState } from "react"
import SearchAutocomplete from "./SearchAutocomplete"
import useDebounce from "@/hooks/useDebounce"

export default function SearchField() {
  const pathname = usePathname()
  const searchParams = useSearchParams();
  const router = useRouter()
  const [searchText, setSearchText] = useState("")
  const debouncedSearchText = useDebounce(searchText, 300);

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
          placeholder="Search"
          className="
            border-none
            pe-10 
            bg-[#ECEFF1] 
            rounded-none 
            placeholder-black
            focus:placeholder-transparent 
            text-base 
            pl-2
            pr-1 
            py-1
            rounded-none 
            focus:outline-hidden 
            focus:ring-1 
            focus:ring-black"
        />

        {searchText ? (
          <X
            className="absolute right-1 top-1/2 size-5 -translate-y-1/2 text-black cursor-pointer hover:opacity-70"
            onClick={clearInput}
          />
        ) : (
          <SearchIcon className="absolute right-1 top-1/2 size-5 -translate-y-1/2 text-black" />
        )}
      </div>

      {debouncedSearchText && (
        <SearchAutocomplete keyword={debouncedSearchText} />
      )}
    </form>
  )
}
