export type ReceiptItem = {
  id: number;
  label: string;
  image: string | null;
};

export type ReceiptRow = { id: number; items: ReceiptItem[] };

export const newItem = (): ReceiptItem => ({
  id: Date.now() + Math.random(),
  label: "항목명",
  image: null,
});

export const newRow = (): ReceiptRow => ({
  id: Date.now(),
  items: [newItem()],
});

export const PRINT_STYLE = `
  @media print {
    body * { visibility: hidden; }
    #print-area, #print-area * { visibility: visible; }
    #print-area {
      position: fixed;
      top: 0; left: 0;
      width: 100%;
      padding: 24px 32px;
      box-sizing: border-box;
    }
    .print-preview-rows { gap: 24px !important; }
  }
`;
