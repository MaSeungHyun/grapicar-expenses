"use client";

import type { ReceiptRow } from "../_lib/types";
import ItemBlock from "./item-block";

type Props = {
  row: ReceiptRow;
  rowIndex: number;
  totalRows: number;
  fileRefs: React.MutableRefObject<Record<number, HTMLInputElement | null>>;
  onAddItem: (rowId: number) => void;
  onRemoveRow: (rowId: number) => void;
  onUpdateItem: (
    rowId: number,
    itemId: number,
    patch: { label?: string; image?: string | null },
  ) => void;
  onRemoveItem: (rowId: number, itemId: number) => void;
  onImage: (rowId: number, itemId: number, file: File) => void;
};

export default function RowBlock({
  row,
  rowIndex,
  totalRows,
  fileRefs,
  onAddItem,
  onRemoveRow,
  onUpdateItem,
  onRemoveItem,
  onImage,
}: Props) {
  return (
    <div className="overflow-hidden rounded-[10px] border border-neutral-200">
      <div className="flex items-center justify-between border-b border-neutral-200 bg-[#f7f7f5] px-2.5 py-1.5">
        <span className="text-[11px] font-bold text-neutral-600">
          행 {rowIndex + 1}
        </span>
        <div className="flex gap-1.5">
          {row.items.length < 3 && (
            <button
              type="button"
              onClick={() => onAddItem(row.id)}
              className="cursor-pointer rounded-md border-0 bg-neutral-900 px-2 py-1 text-[11px] font-semibold text-white"
            >
              + 항목
            </button>
          )}
          <button
            type="button"
            onClick={() => onRemoveRow(row.id)}
            className="cursor-pointer rounded-md border-0 bg-red-100 px-2 py-1 text-[11px] font-semibold text-red-600 disabled:opacity-50"
            disabled={totalRows === 1}
          >
            행 삭제
          </button>
        </div>
      </div>
      {row.items.map((item) => (
        <ItemBlock
          key={item.id}
          item={item}
          fileInputRef={(el) => {
            fileRefs.current[item.id] = el;
          }}
          onTriggerUpload={() => fileRefs.current[item.id]?.click()}
          onLabelChange={(label) => onUpdateItem(row.id, item.id, { label })}
          onImageChange={(file) => onImage(row.id, item.id, file)}
          onImageRemove={() => onUpdateItem(row.id, item.id, { image: null })}
          onRemove={() => onRemoveItem(row.id, item.id)}
        />
      ))}
    </div>
  );
}
