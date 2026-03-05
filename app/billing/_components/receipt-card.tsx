"use client";

import { X } from "lucide-react";
import type { ReceiptItem } from "../_lib/types";

type Props = {
  item: ReceiptItem;
  onPlaceholderClick?: (itemId: number) => void;
  onRemoveImage?: (itemId: number) => void;
  onDropImage?: (itemId: number, file: File) => void;
};

export default function ReceiptCard({
  item,
  onPlaceholderClick,
  onRemoveImage,
  onDropImage,
}: Props) {
  return (
    <div className="flex h-full min-h-[320px] flex-col max-h-[320px]">
      <div className="flex h-12 shrink-0 items-center justify-center overflow-hidden border border-neutral-800 border-b-0 bg-white px-3 py-2 text-center text-sm leading-relaxed text-neutral-900 whitespace-pre-line">
        {item.label}
      </div>
      <div
        className={`flex min-h-[200px] flex-1 items-center justify-center overflow-hidden border border-neutral-800 bg-neutral-50 ${onPlaceholderClick && !item.image ? "cursor-pointer hover:bg-neutral-100" : ""}`}
        role={onPlaceholderClick && !item.image ? "button" : undefined}
        tabIndex={onPlaceholderClick && !item.image ? 0 : undefined}
        onClick={
          onPlaceholderClick && !item.image
            ? () => onPlaceholderClick(item.id)
            : undefined
        }
        onKeyDown={
          onPlaceholderClick && !item.image
            ? (e) => e.key === "Enter" && onPlaceholderClick(item.id)
            : undefined
        }
        onDragOver={(e) => {
          if (!onDropImage) return;
          e.preventDefault();
          e.dataTransfer.dropEffect = "copy";
        }}
        onDrop={(e) => {
          if (!onDropImage) return;
          e.preventDefault();
          const files = Array.from(e.dataTransfer.files);
          const file = files.find((f) =>
            ["image/png", "image/jpeg", "image/jpg"].includes(f.type),
          );
          if (file) {
            onDropImage(item.id, file);
          }
        }}
      >
        {item.image ? (
          <div className="group relative flex w-full flex-1 items-center justify-center h-full">
            {/* eslint-disable-next-line @next/next/no-img-element -- data URL from FileReader */}
            <img
              src={item.image}
              alt={item.label}
              className="block max-h-full max-w-full object-contain"
            />
            {onRemoveImage && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveImage(item.id);
                }}
                className="absolute right-1 top-1 z-10 rounded-full bg-white p-1 opacity-0 shadow transition-opacity hover:opacity-100 focus:opacity-100 group-hover:opacity-100 cursor-pointer hover:bg-neutral-100"
                aria-label="이미지 삭제"
              >
                <X className="h-5 w-5 text-neutral-600" />
              </button>
            )}
          </div>
        ) : (
          <span className="text-sm font-medium text-neutral-400">
            영수증 첨부
          </span>
        )}
      </div>
    </div>
  );
}
