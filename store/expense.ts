import { create } from "zustand";

/** 경비 내역 테이블 한 행 */
export type ExpenseTableRow = {
  date: string;
  amount: string;
  method: "카드" | "현금";
  note: string;
  people: string;
};

const INITIAL_TABLE_ROW: ExpenseTableRow = {
  date: "",
  amount: "",
  method: "카드",
  note: "",
  people: "",
};

interface ExpenseState {
  /** 선택된 월 (1–12) */
  month: number;
  /** 경비 전체 금액 합계 */
  totalAmount: number;
  /** 경비 내역 테이블의 적요 목록 (billing 페이지에서 행/열 생성용) */
  noteLabels: string[];
  /** 경비 내역 테이블 전체 행 (전역 상태로 뒤로가기 시 유지) */
  tableRows: ExpenseTableRow[];
  setMonth: (month: number) => void;
  setTotalAmount: (totalAmount: number) => void;
  setNoteLabels: (labels: string[]) => void;
  /** tableRows 갱신 시 noteLabels도 함께 동기화 */
  setTableRows: (
    arg:
      | ExpenseTableRow[]
      | ((prev: ExpenseTableRow[]) => ExpenseTableRow[]),
  ) => void;
}

const expenseStore = create<ExpenseState>((set) => ({
  month: new Date().getMonth() + 1,
  totalAmount: 0,
  noteLabels: [],
  tableRows: [{ ...INITIAL_TABLE_ROW }],
  setMonth: (month) => set({ month }),
  setTotalAmount: (totalAmount) => set({ totalAmount }),
  setNoteLabels: (noteLabels) => set({ noteLabels }),
  setTableRows: (arg) =>
    set((state) => {
      const nextRows =
        typeof arg === "function" ? arg(state.tableRows) : arg;
      return {
        tableRows: nextRows,
        noteLabels: nextRows.map((r) => r.note),
      };
    }),
}));

export { INITIAL_TABLE_ROW };

export default expenseStore;
