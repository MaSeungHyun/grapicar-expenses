"use client";

import type { ReceiptItem } from "../_lib/types";

type Props = {
  item: ReceiptItem;
  fileInputRef: (el: HTMLInputElement | null) => void;
  onTriggerUpload: () => void;
  onLabelChange: (label: string) => void;
  onImageChange: (file: File) => void;
  onImageRemove: () => void;
  onRemove: () => void;
};

export default function ItemBlock({
  item,
  fileInputRef,
  onTriggerUpload,
  onLabelChange,
  onImageChange,
  onImageRemove,
  onRemove,
}: Props) {
  return (
    <div className="flex flex-col gap-1.5 border-b border-neutral-100 p-2.5">
      <textarea
        value={item.label}
        onChange={(e) => onLabelChange(e.target.value)}
        className="w-full resize-none rounded-md border border-neutral-200 px-2.5 py-1.5 font-sans text-sm text-neutral-800 outline-none box-border"
        rows={2}
      />
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={onTriggerUpload}
          className="cursor-pointer rounded-md border-0 bg-neutral-900 px-2.5 py-1.5 text-xs font-semibold text-white"
        >
          {item.image ? "이미지 변경" : "이미지 첨부"}
        </button>
        {item.image && (
          <button
            type="button"
            onClick={onImageRemove}
            className="cursor-pointer rounded-md border-0 bg-red-100 px-2.5 py-1.5 text-xs font-semibold text-red-600"
          >
            제거
          </button>
        )}
        <button
          type="button"
          onClick={onRemove}
          className="ml-auto cursor-pointer rounded-md border-0 bg-[#f4f4f0] px-2.5 py-1.5 text-xs text-neutral-600"
        >
          삭제
        </button>
      </div>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onImageChange(file);
        }}
      />
    </div>
  );
}
