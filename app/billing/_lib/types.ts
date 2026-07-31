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
    @page {
      size: A4;
      margin: 12mm;
    }
    body * { visibility: hidden; }
    #print-area, #print-area * { visibility: visible; }
    #print-area {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      gap: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
    }
    .print-page {
      break-after: page;
      page-break-after: always;
      min-height: auto !important;
      height: 100vh;
      margin: 0 !important;
      padding: 0 !important;
      border-radius: 0 !important;
      box-shadow: none !important;
    }
    .print-page:last-child {
      break-after: auto;
      page-break-after: auto;
    }
  }
`;
