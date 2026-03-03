"use client";

import { Button } from "@/components/ui/button";
import userStore from "@/store/user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function getUserFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/\buser=([^;]*)/);
  return match ? decodeURIComponent(match[1].trim()) : null;
}

export default function Header() {
  const router = useRouter();
  const { name, resetName, setName } = userStore();

  useEffect(() => {
    const cookieUser = getUserFromCookie();
    if (cookieUser && !name) {
      setName(cookieUser);
    }
  }, [name, setName]);

  const handleLogout = () => {
    resetName();
    document.cookie = "user=; path=/; max-age=0";
    router.push("/");
  };

  return (
    <div className="overflow-hidden px-4 py-2 ">
      <div className="flex justify-between items-center h-10">
        <h1>{name}님, 환영합니다.</h1>
        <Button onClick={handleLogout}>로그아웃</Button>
      </div>
    </div>
  );
}
