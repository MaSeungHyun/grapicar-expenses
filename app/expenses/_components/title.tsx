"use client";

import userStore from "@/store/user";
import Value from "./value";

export default function Title() {
  const date = new Date();

  const { name } = userStore();

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold">제목</h1>
      <Value
        valued={`[경비] ${name}-${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`}
      />
    </div>
  );
}
