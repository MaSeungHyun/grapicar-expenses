"use client";

import { Button } from "@/components/ui/button";
import userStore from "@/store/user";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const name = userStore((state) => state.name);
  const resetName = userStore((state) => state.resetName);

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
