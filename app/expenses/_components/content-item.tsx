"use client";

import userStore from "@/store/user";
import InputWithClipboard from "./input-with-clipboard";

type ContentItemProps = {
  title: string;
  value: string;
};
export default function ContentItem({ title, value }: ContentItemProps) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold">{title}</h1>
      <InputWithClipboard value={value} />
    </div>
  );
}
