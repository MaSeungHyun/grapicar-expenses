"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, PanelLeftClose } from "lucide-react";
import type { ReceiptRow } from "../_lib/types";
import RowBlock from "./row-block";
import userStore from "@/store/user";
import { cn } from "@/lib/utils";


type Props = {
  isOpen: boolean;
  onToggle: () => void;
  title: string;
  rows: ReceiptRow[];
  fileRefs: React.MutableRefObject<Record<number, HTMLInputElement | null>>;
  onTitleChange: (v: string) => void;
  onAddRow: () => void;
  onAddItem: (rowId: number) => void;
  onRemoveRow: (rowId: number) => void;
  onUpdateItem: (
    rowId: number,
    itemId: number,
    patch: { label?: string; image?: string | null },
  ) => void;
  onRemoveItem: (rowId: number, itemId: number) => void;
  onImage: (rowId: number, itemId: number, file: File) => void;
  onPrint: () => void;
};

export default function EditorPanel({
  isOpen,
  onToggle,
  title,
  rows,
  fileRefs,
  onTitleChange,
  onAddRow,
  onAddItem,
  onRemoveRow,
  onUpdateItem,
  onRemoveItem,
  onImage,
  onPrint,
}: Props) {
  const resetName = userStore((state) => state.resetName);
  const router = useRouter();
  const handleLogout = () => {
    resetName();
    document.cookie = "user=; path=/; max-age=0";
    router.push("/");
  };
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-neutral-200 bg-white shadow-[2px_0_16px_rgba(0,0,0,0.06)] transition-[width] duration-200 ease-out",
        isOpen ? "w-[300px]" : "w-12",
      )}
    >
      {/* 토글 버튼 */}
      <button
        type="button"
        onClick={onToggle}
        className="absolute -right-3 top-6 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-neutral-200 bg-white shadow-md transition-colors hover:bg-neutral-50"
        aria-label={isOpen ? "패널 접기" : "패널 펼치기"}
      >
        {isOpen ? (
          <ChevronLeft className="h-3.5 w-3.5 text-neutral-600" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-neutral-600" />
        )}
      </button>

      {isOpen ? (
        <div className="flex h-full flex-col gap-5 overflow-y-auto p-6 pr-7">
          <h2 className="m-0 shrink-0 text-base font-bold text-[#111]">
            영수증 PDF 생성기
          </h2>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold tracking-wide text-neutral-500">
          문서 제목
        </label>
        <input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-800 outline-none box-border"
          placeholder="제목을 입력하세요"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold tracking-wide text-neutral-500">
          행 / 항목
        </label>
        <div className="flex flex-col gap-3">
          {rows.map((row, ri) => (
            <RowBlock
              key={row.id}
              row={row}
              rowIndex={ri}
              totalRows={rows.length}
              fileRefs={fileRefs}
              onAddItem={onAddItem}
              onRemoveRow={onRemoveRow}
              onUpdateItem={onUpdateItem}
              onRemoveItem={onRemoveItem}
              onImage={onImage}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={onAddRow}
          className="cursor-pointer rounded-lg border border-neutral-200 bg-[#f4f4f0] px-3 py-2 text-sm font-semibold text-neutral-700"
        >
          + 행 추가 (줄바꿈)
        </button>
      </div>

      <button
        type="button"
        onClick={onPrint}
        className="w-full cursor-pointer rounded-lg border-0 bg-blue-500 py-3 text-sm font-bold text-white"
      >
        🖨 PDF로 저장 / 인쇄
      </button>
      <button
        type="button"
        onClick={handleLogout}
        className="mt-auto w-full cursor-pointer rounded-lg border-0 bg-neutral-900 py-3 text-sm font-bold text-white"
      >
        로그아웃
      </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 pt-8">
          <button
            type="button"
            onClick={onToggle}
            className="flex flex-col items-center gap-1 text-neutral-500 hover:text-neutral-700"
            title="패널 펼치기"
          >
            <PanelLeftClose className="h-5 w-5" />
            <span className="text-[10px] font-medium">편집</span>
          </button>
        </div>
      )}
    </aside>
  );
}
