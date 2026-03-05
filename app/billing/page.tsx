"use client";

import expenseStore from "@/store/expense";
import userStore from "@/store/user";
import { useState, useRef, useEffect } from "react";
import {
  type ReceiptItem,
  type ReceiptRow,
  newItem,
  newRow,
  PRINT_STYLE,
} from "./_lib/types";
import EditorPanel from "./_components/editor-panel";
import PrintPreview from "./_components/print-preview";
import { cn } from "@/lib/utils";

const MAX_ITEMS_PER_ROW = 3;

function buildRowsFromNotes(noteLabels: string[]): ReceiptRow[] {
  if (noteLabels.length === 0) {
    return [{ id: Date.now(), items: [newItem()] }];
  }
  const baseId = Date.now();
  const allItems: ReceiptItem[] = noteLabels.map((label, i) => ({
    id: baseId + i,
    label: label.trim() || "항목명",
    image: null,
  }));
  const rows: ReceiptRow[] = [];
  for (let i = 0; i < allItems.length; i += MAX_ITEMS_PER_ROW) {
    const chunk = allItems.slice(i, i + MAX_ITEMS_PER_ROW);
    rows.push({ id: baseId + 1000 + rows.length, items: chunk });
  }
  return rows;
}

function getInitialBillingRows(): ReceiptRow[] {
  const labels = expenseStore.getState().noteLabels;
  return buildRowsFromNotes(labels);
}

export default function ReceiptPDF() {
  const year = new Date().getFullYear();
  const { month, totalAmount } = expenseStore();
  const { name } = userStore();

  const [title, setTitle] = useState(
    `${year}-${month.toString().padStart(2, "0")}월 개인경비 사용내역 영수증(${name} / ${totalAmount.toLocaleString()}원)`,
  );
  const [rows, setRows] = useState<ReceiptRow[]>(getInitialBillingRows);
  const [panelOpen, setPanelOpen] = useState(true);
  const fileRefs = useRef<Record<number, HTMLInputElement | null>>({});

  useEffect(() => {
    setTitle(
      `${year}-${month.toString().padStart(2, "0")}월 개인경비 사용내역 영수증(${name} / ${totalAmount.toLocaleString()}원)`,
    );
  }, [year, month, name, totalAmount]);

  const updateItem = (
    rowId: number,
    itemId: number,
    patch: { label?: string; image?: string | null },
  ) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === rowId
          ? {
              ...row,
              items: row.items.map((it) =>
                it.id === itemId ? { ...it, ...patch } : it,
              ),
            }
          : row,
      ),
    );
  };

  const handleImage = (rowId: number, itemId: number, file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      updateItem(rowId, itemId, {
        image: typeof result === "string" ? result : null,
      });
      const input = fileRefs.current[itemId];
      if (input) input.value = "";
    };
    reader.readAsDataURL(file);
  };

  const addItemToRow = (rowId: number) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === rowId && row.items.length < 3
          ? { ...row, items: [...row.items, newItem()] }
          : row,
      ),
    );
  };

  const removeItem = (rowId: number, itemId: number) => {
    setRows((prev) =>
      prev.flatMap((row) => {
        if (row.id !== rowId) return [row];
        const items = row.items.filter((it) => it.id !== itemId);
        return items.length === 0 ? [] : [{ ...row, items }];
      }),
    );
  };

  const removeRow = (rowId: number) => {
    if (rows.length === 1) return;
    setRows((prev) => prev.filter((r) => r.id !== rowId));
  };

  const removeImage = (itemId: number) => {
    const row = rows.find((r) => r.items.some((it) => it.id === itemId));
    if (row) updateItem(row.id, itemId, { image: null });
    const input = fileRefs.current[itemId];
    if (input) input.value = "";
  };

  const handleDropImage = (itemId: number, file: File) => {
    const row = rows.find((r) => r.items.some((it) => it.id === itemId));
    if (!row) return;
    handleImage(row.id, itemId, file);
  };

  return (
    <div className="min-h-screen w-full min-w-0 bg-[#f2f2ef] font-sans box-border">
      <style>{PRINT_STYLE}</style>
      <EditorPanel
        isOpen={panelOpen}
        onToggle={() => setPanelOpen((o) => !o)}
        title={title}
        rows={rows}
        fileRefs={fileRefs}
        onTitleChange={setTitle}
        onAddRow={() => setRows((prev) => [...prev, newRow()])}
        onAddItem={addItemToRow}
        onRemoveRow={removeRow}
        onUpdateItem={updateItem}
        onRemoveItem={removeItem}
        onImage={handleImage}
        onPrint={() => window.print()}
      />
      <main
        className={cn(
          "min-h-screen transition-all duration-200",
          panelOpen ? "pl-[300px]" : "pl-0",
        )}
      >
        <div className="mx-auto flex w-full max-w-4xl gap-6 p-8">
          <PrintPreview
            title={title}
            rows={rows}
            onPlaceholderClick={(itemId) => fileRefs.current[itemId]?.click()}
            onRemoveImage={removeImage}
            onDropImage={handleDropImage}
          />
        </div>
      </main>
    </div>
  );
}
