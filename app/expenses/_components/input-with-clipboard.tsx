import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

type InputWithClipboardProps = {
  value: string;
};
export default function InputWithClipboard({ value }: InputWithClipboardProps) {
  const [inputValue, setInputValue] = useState(value);

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleCopyValue = () => {
    navigator.clipboard
      .writeText(inputValue)
      .then(() => {
        console.log("복사되었습니다.");
        toast.success("복사되었습니다.");
      })
      .catch(() => {
        toast.error("복사에 실패했습니다.");
      });
  };

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <div className="flex items-center justify-center relative">
      <Input
        className="w-full h-10 rounded-md border border-gray-500 px-4 flex items-center hover:bg-gray-100"
        value={inputValue}
        onChange={handleChangeValue}
      />

      <div
        className="absolute right-2 cursor-pointer hover:text-gray-500 hover:bg-neutral-500/15 rounded-sm p-1"
        onClick={handleCopyValue}
      >
        <Copy className="w-4 h-4" />
      </div>
    </div>
  );
}
