"use client";

import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";

export default function SearchField() {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const q = (form.q as HTMLInputElement).value.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <form onSubmit={handleSubmit} method="GET" action="/search" className="relative mb-1 mt-2">
      <div className="relative">
        <Input 
          name="q" 
          placeholder="Search" 
          className="
          w-full sm:w-40 md:w-44 lg:w-48
          pe-10 
          bg-[#ECEFF1] 
          rounded-none 
          placeholder-black
          focus:placeholder-transparent 
          text-sm 
          pl-2
          pr-10 
          py-1
          border 
          border-[#ECEFF1] 
          rounded-none 
          focus:outline-none 
          focus:ring-1 
          focus:ring-black" 
          />
        <SearchIcon className="absolute right-3 top-1/2 size-5 -translate-y-1/2 transform text-black" />
      </div>
    </form>
  );
}
