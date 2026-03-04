"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Combobox,
  ComboboxContent,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/ui/combobox";
import {
  CalendarIcon,
  Check,
  ChevronDownIcon,
  ChevronRightIcon,
  Copy,
  Minus,
  Plus,
  X,
} from "lucide-react";
import { toast } from "sonner";
import expenseStore, {
  type ExpenseTableRow,
  INITIAL_TABLE_ROW,
} from "@/store/expense";

type Row = ExpenseTableRow;

function formatNumber(value: string) {
  const num = parseInt(value.replace(/,/g, ""), 10);
  if (isNaN(num)) return "";
  return num.toLocaleString();
}

function parseNumber(value: string) {
  return parseInt(value.replace(/,/g, ""), 10) || 0;
}

/** 일자 값이 1자리(1–9)면 앞에 0을 붙여 2자리로 만듦. e.g. "4" → "04", "4(화)" → "04(화)". "14"는 그대로. */
function formatDateDay(value: string): string {
  if (!value.trim()) return value;
  // 맨 앞 한 자리(1–9) 뒤에 숫자가 오지 않을 때만 패딩 (2자리 일자 "14" 등은 제외)
  return value.replace(/^([1-9])($|[^\d])/, "0$1$2");
}

/** 인원 입력값에서 이름 목록 추출. "2名(홍길동, OOO)" 또는 "홍길동, OOO" 형식 지원 */
function parsePeople(value: string): string[] {
  if (!value.trim()) return [];
  const afterMing = value.indexOf("名(");
  if (afterMing !== -1) {
    const content = value.slice(afterMing + 2);
    const closeIdx = content.lastIndexOf(")");
    const inner = closeIdx >= 0 ? content.slice(0, closeIdx) : content;
    return inner
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** 이름 목록을 "N名(이름1, 이름2)" 형식으로 포맷 */
function formatPeople(names: string[]): string {
  if (names.length === 0) return "";
  return `${names.length}名 (${names.join(", ")})`;
}

const DATE_PREFIX_YEAR = 2026;

function generateHTML(rows: Row[], month: number) {
  const total = rows.reduce((sum, r) => sum + parseNumber(r.amount), 0);
  const monthStr = String(month).padStart(2, "0");

  const headerHTML = [
    `<div style="text-align: center; margin-bottom: 16px;">`,
    `  <div style="text-align: center;">`,
    `    <font size="3">`,
    `      <span style="font-size: 12pt;">`,
    `        <span style="font-size: 10pt;">${DATE_PREFIX_YEAR}년 ${month}월 개인 경비 처리 내역 입니다.</span>`,
    `      </span>`,
    `    </font>`,
    `  </div>`,
    `  <div style="text-align: center;">`,
    `    <font size="3">`,
    `      <span style="font-size: 12pt;">`,
    `        <span style="font-size: 10pt;">재가 부탁 드립니다. </span>`,
    `      </span>`,
    `    </font>`,
    `  </div>`,
    `  <div style="text-align: center;">`,
    `    <font size="3"><br /></font>`,
    `  </div>`,
    `  <div style="text-align: center;">`,
    `    <font size="3">`,
    `      <span style="font-size: 12pt;">`,
    `        <span style="font-size: 10pt;">Total : ${total.toLocaleString()}원</span>`,
    `      </span>`,
    `    </font>`,
    `  </div>`,
    `</div>`,
  ].join("\n");

  const dataRows = rows
    .map(
      (row, i) =>
        `  <tr>
    <td style="text-align:center">${i + 1}</td>
    <td style="text-align:center">${row.date ? `${DATE_PREFIX_YEAR}.${monthStr}.${row.date}` : ""}</td>
    <td style="text-align:right">${row.amount ? Number(row.amount.replace(/,/g, "")).toLocaleString() : ""}</td>
    <td style="text-align:center">${row.method}</td>
    <td>${row.note}</td>
    <td>${row.people}</td>
  </tr>`,
    )
    .join("\n");

  const tableHTML = [
    `<table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:600px">`,
    `  <thead>`,
    `    <tr style="background-color: #f0f0f0; font-size: 12px">`,
    `      <th style="text-align:center">no</th>`,
    `      <th style="text-align:center">일자(요일)</th>`,
    `      <th style="text-align:center">금액</th>`,
    `      <th style="text-align:center">카드/현금</th>`,
    `      <th style="text-align:center">적요</th>`,
    `      <th style="text-align:center">인원</th>`,
    `    </tr>`,
    `  </thead>`,
    `  <tbody>`,
    dataRows,
    `    <tr style="background-color: #f0f0f0">`,
    `      <td colspan="2" style="text-align:center;font-weight:bold">합계</td>`,
    `      <td style="text-align:right;font-weight:bold">${total.toLocaleString()}</td>`,
    `      <td colspan="3"></td>`,
    `    </tr>`,
    `  </tbody>`,
    `</table>`,
  ].join("\n");

  return headerHTML + "\n" + tableHTML;
}

const tableInputClass =
  "h-8 min-w-[80px] border-0 bg-transparent shadow-none rounded-none px-2 text-sm";

export default function ExpenseTable() {
  const today = new Date();
  const day = today.getDate();

  const rows = expenseStore((s) => s.tableRows);
  const setTableRows = expenseStore((s) => s.setTableRows);
  const month = expenseStore((s) => s.month);
  const setMonth = expenseStore((s) => s.setMonth);

  const [copied, setCopied] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const updateRow = (ri: number, field: keyof Row, value: string) => {
    setTableRows((prev) =>
      prev.map((row, i) => (i === ri ? { ...row, [field]: value } : row)),
    );
  };

  const handleAmountBlur = (ri: number, value: string) => {
    updateRow(ri, "amount", formatNumber(value));
  };

  const handleDateBlur = (ri: number, value: string) => {
    updateRow(ri, "date", formatDateDay(value));
  };

  const handlePeopleBlur = (ri: number, value: string) => {
    const names = parsePeople(value);
    updateRow(ri, "people", formatPeople(names));
  };

  const addRow = () =>
    setTableRows((prev) => [...prev, { ...INITIAL_TABLE_ROW }]);

  const deleteRow = (ri: number) => {
    if (rows.length === 1) return;
    setTableRows((prev) => prev.filter((_, i) => i !== ri));
  };

  const total = rows.reduce((sum, r) => sum + parseNumber(r.amount), 0);

  useEffect(() => {
    expenseStore.getState().setTotalAmount(total);
  }, [total, rows]);

  const hasEmptyFields = useCallback((rowsToCheck: Row[]) => {
    return rowsToCheck.some(
      (row) =>
        !row.date?.trim() ||
        !row.amount?.trim() ||
        !row.note?.trim() ||
        !row.people?.trim(),
    );
  }, []);

  const handleCopy = () => {
    if (hasEmptyFields(rows)) {
      toast.error("빈 칸이 있습니다.");
      return;
    }
    navigator.clipboard
      .writeText(generateHTML(rows, month))
      .then(() => {
        setCopied(true);
        toast.success(`복사에 성공했습니다.`);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        toast.error("복사에 실패했습니다.");
      });
  };

  const handleChangeMonth = (value: string) => {
    setMonth(parseInt(value, 10));
  };

  return (
    <div className="flex flex-col w-full max-w-[860px] gap-2">
      <h2 className="text-xl font-bold text-neutral-900 mt-3">경비 내역</h2>
      <div className="flex flex-col gap-5 rounded-2xl bg-white p-7 shadow-sm">
        {/* Top bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-2">
            <Combobox>
              <ComboboxTrigger
                className={cn(
                  buttonVariants({ variant: "outline", size: "default" }),
                  "gap-1.5",
                )}
              >
                <CalendarIcon />
                {month}월
                <ChevronDownIcon />
              </ComboboxTrigger>
              <ComboboxContent>
                <ComboboxList>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <ComboboxItem
                      key={m}
                      value={m.toString()}
                      onClick={() => handleChangeMonth(m.toString())}
                    >
                      {m}월
                    </ComboboxItem>
                  ))}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={handleCopy}
              variant={copied ? "default" : "default"}
              className={cn(
                "gap-1.5 min-w-30",
                copied && "bg-green-600 hover:bg-green-700",
              )}
            >
              {copied ? (
                <>
                  <Check size={16} /> 복사됨
                </>
              ) : (
                <>
                  <Copy size={16} /> HTML 복사
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-neutral-200">
          <table className="w-full table-fixed border-collapse">
            <colgroup>
              <col className="w-10" />
              <col className="w-28" />
              <col className="w-24" />
              <col className="w-24" />
              <col />
              <col />
              <col className="w-8" />
            </colgroup>
            <thead>
              <tr>
                {[
                  "no",
                  "일자(요일)",
                  "금액",
                  "카드/현금",
                  "적요",
                  "인원",
                  "",
                ].map((h, i) => (
                  <th
                    key={i}
                    className={cn(
                      "whitespace-nowrap border-b-2 border-neutral-200 bg-neutral-100/80 px-2.5 py-2 text-center text-xs font-bold text-neutral-600",
                      i === 6 && "w-10",
                    )}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} className="border-b border-neutral-100 group">
                  <td className="px-2.5 py-1.5 text-center text-xs text-neutral-500">
                    {ri + 1}
                  </td>
                  <td className="px-2.5 py-1.5 text-center align-middle">
                    <div className="flex items-baseline justify-center gap-0">
                      <span className="shrink-0 text-sm leading-8 text-neutral-600">
                        {DATE_PREFIX_YEAR}.{String(month).padStart(2, "0")}.
                      </span>
                      <Input
                        value={row.date}
                        onChange={(e) =>
                          updateRow(
                            ri,
                            "date",
                            e.target.value.replace(/\D/g, ""),
                          )
                        }
                        onBlur={(e) => handleDateBlur(ri, e.target.value)}
                        placeholder={day.toString().padStart(2, "0")}
                        className={cn(
                          tableInputClass,
                          "h-8 py-0 text-sm leading-8 text-left flex-1 min-w-0 px-0 placeholder:text-neutral-500/50 w-10 rounded-sm",
                        )}
                      />
                    </div>
                  </td>
                  <td className="px-2.5 py-1.5 text-right">
                    <Input
                      value={row.amount}
                      onChange={(e) =>
                        updateRow(
                          ri,
                          "amount",
                          e.target.value.replace(/[^0-9,]/g, ""),
                        )
                      }
                      onBlur={(e) => handleAmountBlur(ri, e.target.value)}
                      placeholder="0"
                      className={cn(
                        tableInputClass,
                        "text-right  rounded-sm placeholder:text-neutral-500/50",
                      )}
                    />
                  </td>
                  <td className="px-2.5 py-1.5 text-center">
                    <Combobox>
                      <ComboboxTrigger
                        className={cn(
                          buttonVariants({
                            variant: "outline",
                            size: "default",
                          }),
                          "gap-1.5",
                        )}
                      >
                        {row.method}
                        <ChevronDownIcon />
                      </ComboboxTrigger>
                      <ComboboxContent>
                        <ComboboxList>
                          <ComboboxItem
                            value="카드"
                            onClick={() => updateRow(ri, "method", "카드")}
                          >
                            카드
                          </ComboboxItem>
                          <ComboboxItem
                            value="현금"
                            onClick={() => updateRow(ri, "method", "현금")}
                          >
                            현금
                          </ComboboxItem>
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </td>
                  <td className="px-2.5 py-1.5">
                    <Input
                      value={row.note}
                      onChange={(e) => updateRow(ri, "note", e.target.value)}
                      placeholder="점심식사(장소)"
                      className={cn(
                        tableInputClass,
                        "placeholder:text-neutral-500/50  rounded-sm",
                      )}
                    />
                  </td>
                  <td className="px-2.5 py-1.5">
                    <Input
                      value={row.people}
                      onChange={(e) => updateRow(ri, "people", e.target.value)}
                      onBlur={(e) => handlePeopleBlur(ri, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          (e.target as HTMLInputElement).blur();
                        }
                      }}
                      onFocus={(e) => (e.target as HTMLInputElement).select()}
                      placeholder="홍길동, OOO"
                      className={cn(
                        tableInputClass,
                        "placeholder:text-neutral-500/50  rounded-sm",
                      )}
                    />
                  </td>
                  <td className="px-2.5 py-1.5 text-center">
                    {ri > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => deleteRow(ri)}
                        disabled={rows.length === 1}
                        className="text-neutral-400 hover:text-neutral-600 disabled:opacity-50 w-fit group-hover:block hidden cursor-pointer group hover:bg-transparent"
                      >
                        <X
                          size={16}
                          className="text-neutral-400 hover:text-neutral-600 disabled:opacity-50 w-fit group-hover:block hidden cursor-pointer"
                        />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}

              {/* 합계 행 */}
              <tr className="border-t-2 border-neutral-200 bg-neutral-50/80">
                <td
                  colSpan={2}
                  className="px-2.5 py-2 text-center text-sm font-bold"
                >
                  합계
                </td>
                <td className="px-2.5 py-2 text-right text-sm font-bold text-neutral-900">
                  {total.toLocaleString()}
                </td>
                <td colSpan={4} className="px-2.5 py-2" />
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex items-center gap-4 justify-end">
          <Button
            type="button"
            variant="secondary"
            //   size="sm"
            onClick={addRow}
            className="w-fit gap-1.5 text-neutral-700 bg-neutral-200 hover:bg-neutral-300 border-neutral-400/50 border-px"
          >
            <Plus size={16} /> 행 추가
          </Button>

          <Button
            type="button"
            variant="secondary"
            //   size="sm"
            onClick={() => deleteRow(rows.length - 1)}
            className="w-fit gap-1.5 text-neutral-700 bg-neutral-200 hover:bg-neutral-300 border-neutral-400/50 border-px"
            disabled={rows.length === 1}
          >
            <Minus size={16} /> 행 삭제
          </Button>
        </div>

        {/* HTML 미리보기 */}
        <Collapsible open={previewOpen} onOpenChange={setPreviewOpen}>
          <div className="rounded-xl bg-neutral-900 px-5 py-4">
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="mb-2.5 flex w-full items-center gap-2 text-left text-[10px] font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-400"
              >
                {previewOpen ? (
                  <ChevronDownIcon className="size-3.5 shrink-0" />
                ) : (
                  <ChevronRightIcon className="size-3.5 shrink-0" />
                )}
                HTML PREVIEW
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <pre className="m-0 overflow-x-auto font-mono text-[11px] leading-relaxed text-green-300 whitespace-pre-wrap break-all">
                {generateHTML(rows, month)}
              </pre>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </div>
    </div>
  );
}
