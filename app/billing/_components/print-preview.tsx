"use client";

import { useEffect, useState } from "react";
import type { ReceiptRow } from "../_lib/types";
import ReceiptCard from "./receipt-card";

type Props = {
  title: string;
  rows: ReceiptRow[];
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

export default function PrintPreview({
  title,
  rows,
  onPlaceholderClick,
  onRemoveImage,
  onDropImage,
}: Props) {
  const [hoveredItemId, setHoveredItemId] = useState<number | null>(null);

  useEffect(() => {
    if (!onDropImage) return;

    const handlePaste = (e: ClipboardEvent) => {
      if (hoveredItemId == null) return;
      const file = getImageFileFromClipboard(e.clipboardData);
      if (!file) return;
      e.preventDefault();
      onDropImage(hoveredItemId, file);
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [hoveredItemId, onDropImage]);

  return (
    <div id="print-area" className="flex w-full min-w-[700px] flex-col gap-6">
      {rows.map((row) => (
        <section
          key={row.id}
          className="print-page flex min-h-[297mm] flex-col rounded-[14px] bg-white p-8 shadow-[0_2px_16px_rgba(0,0,0,0.07)] box-border"
        >
          <h1 className="shrink-0 text-base font-bold leading-snug text-neutral-900">
            {title}
          </h1>
          <div
            className="mt-5 grid min-h-0 flex-1 gap-4"
            style={{
              gridTemplateColumns: `repeat(${row.items.length}, 1fr)`,
            }}
          >
            {row.items.map((item) => (
              <ReceiptCard
                key={item.id}
                item={item}
                isHovered={hoveredItemId === item.id}
                onHoverChange={(hovered) => {
                  if (hovered) setHoveredItemId(item.id);
                  else
                    setHoveredItemId((prev) =>
                      prev === item.id ? null : prev,
                    );
                }}
                onPlaceholderClick={onPlaceholderClick}
                onRemoveImage={onRemoveImage}
                onDropImage={onDropImage}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
