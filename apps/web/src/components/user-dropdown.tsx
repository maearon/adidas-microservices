"use client";

import { User } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { LogOutIcon, ShieldIcon, UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface UserDropdownProps {
  user: User;
}

export function UserDropdown({ user }: UserDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name}
              width={16}
              height={16}
              className="rounded-full object-cover"
            />
          ) : (
            <UserIcon />
          )}
          <span className="max-w-[12rem] truncate">{user.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <UserIcon className="size-4" /> <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        {user.role === "admin" && <AdminItem />}
        <SignOutItem />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AdminItem() {
  return (
    <DropdownMenuItem asChild>
      <Link href="/admin">
        <ShieldIcon className="size-4" /> <span>Admin</span>
      </Link>
    </DropdownMenuItem>
  );
}

function SignOutItem() {
  const router = useRouter();

  async function handleSignOut() {
    const { error } = await authClient.signOut();
    if (error) {
      toast.error(error.message || "Something went wrong");
    } else {
      toast.success("Signed out successfully");
      router.push("/sign-in");
    }
  }

  return (
    <DropdownMenuItem onClick={handleSignOut}>
      <LogOutIcon className="size-4" /> <span>Sign out</span>
    </DropdownMenuItem>
  );
}
