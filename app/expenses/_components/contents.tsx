import React from "react";

type ContentsProps = {
  children: React.ReactNode;
};

export default function Contents({ children }: ContentsProps) {
  return (
    <div className="flex flex-col gap-2 w-full flex-1 px-5 py-5">
      {children}
    </div>
  );
}
