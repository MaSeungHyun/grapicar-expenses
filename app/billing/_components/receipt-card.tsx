"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { ReceiptItem } from "../_lib/types";

type Props = {
  item: ReceiptItem;
  onPlaceholderClick?: (itemId: number) => void;
  onRemoveImage?: (itemId: number) => void;
  onDropImage?: (itemId: number, file: File) => void;
};

function getImageFileFromClipboard(clipboardData: DataTransfer | null) {
  if (!clipboardData) return null;
  const items = Array.from(clipboardData.items);
  const imageItem = items.find((item) => item.type.startsWith("image/"));
  return imageItem?.getAsFile() ?? null;
}

export default function ReceiptCard({
  item,
  onPlaceholderClick,
  onRemoveImage,
  onDropImage,
}: Props) {
  const [isActive, setIsActive] = useState(false);
  const canAttach = Boolean(onDropImage);

  useEffect(() => {
    if (!isActive || !onDropImage) return;

    const handlePaste = (e: ClipboardEvent) => {
      const file = getImageFileFromClipboard(e.clipboardData);
      if (!file) return;
      e.preventDefault();
      onDropImage(item.id, file);
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [isActive, onDropImage, item.id]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex h-12 shrink-0 items-center justify-center overflow-hidden border border-neutral-800 border-b-0 bg-white px-3 py-2 text-center text-sm leading-relaxed text-neutral-900 whitespace-pre-line">
        {item.label}
      </div>
      <div
        className={`flex min-h-0 flex-1 items-center justify-center overflow-hidden border border-neutral-800 bg-neutral-50 outline-none ${canAttach ? "cursor-pointer hover:bg-neutral-100 focus:bg-neutral-100" : ""} ${isActive && canAttach ? "ring-2 ring-blue-400 ring-inset" : ""}`}
        role={canAttach ? "button" : undefined}
        tabIndex={canAttach ? 0 : undefined}
        onMouseEnter={() => setIsActive(true)}
        onMouseLeave={() => setIsActive(false)}
        onFocus={() => setIsActive(true)}
        onBlur={() => setIsActive(false)}
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
        onPaste={(e) => {
          if (!onDropImage) return;
          const file = getImageFileFromClipboard(e.clipboardData);
          if (!file) return;
          e.preventDefault();
          onDropImage(item.id, file);
        }}
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
            ["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(
              f.type,
            ),
          );
          if (file) {
            onDropImage(item.id, file);
          }
        }}
      >
        {item.image ? (
          <div className="group relative flex h-full w-full flex-1 items-center justify-center">
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
                className="absolute right-1 top-1 z-10 cursor-pointer rounded-full bg-white p-1 opacity-0 shadow transition-opacity hover:bg-neutral-100 hover:opacity-100 focus:opacity-100 group-hover:opacity-100"
                aria-label="이미지 삭제"
              >
                <X className="h-5 w-5 text-neutral-600" />
              </button>
            )}
          </div>
        ) : (
          <span className="text-center text-lg mb-5 font-medium text-neutral-800">
            영수증 첨부
            <br />
            <span className="text-sm text-blue-500 text-bold">
              클릭 : 파일 선택
            </span>
            <br />
            <span className="text-sm text-blue-500 text-bold">
              Ctlr + V (마우스 올린 상태로) : 복사한 이미지 붙여넣기
            </span>
          </span>
        )}
      </div>
    </div>
  );
}
