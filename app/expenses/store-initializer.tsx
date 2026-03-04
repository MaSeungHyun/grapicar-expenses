"use client";

import userStore from "@/store/user";
import { useEffect } from "react";

function getUserFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/\buser=([^;]*)/);

  return match ? decodeURIComponent(match[1].trim()) : null;
}

/**
 * 쿠키의 user 값을 Zustand 스토어에 한 번만 동기화합니다.
 */
export default function StoreInitializer() {
  useEffect(() => {
    const cookieUser = getUserFromCookie();
    if (cookieUser) {
      userStore.getState().setName(cookieUser);
    }
  }, []);

  return null;
}
