import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";
import React, { useState } from "react";

type ValueProps = {
  valued: string;
};
export default function Value({ valued }: ValueProps) {
  const [value, setValue] = useState(valued);

  return (
    <div className="flex items-center justify-center relative">
      <Input
        className="w-full h-10 rounded-md border border-gray-500 px-4 flex items-center hover:bg-gray-100"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <div className="absolute right-2 cursor-pointer hover:text-gray-500 hover:bg-neutral-500/20 rounded-sm p-1">
        <Copy className="w-4 h-4" />
      </div>
    </div>
  );
}
