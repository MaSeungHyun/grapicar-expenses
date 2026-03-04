"use client";

import React from "react";
import ContentItem from "./_components/content-item";
import userStore from "@/store/user";
import ExpenseTable from "./_components/table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Contents() {
  const router = useRouter();
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const name = userStore((state) => state.name);
  const titleValue = `[경비] ${name}-${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

  const handleCreateReceipt = () => {
    router.push("/billing");
  };

  return (
    <div className="flex flex-col gap-5 w-full flex-1 px-5 py-5 ">
      <ContentItem title="제목" value={titleValue} />
      <ExpenseTable />
      <Button
        className="w-full absolute bottom-3 left-0 h-12"
        onClick={handleCreateReceipt}
      >
        영수증 PDF 만들기
      </Button>
    </div>
  );
}
