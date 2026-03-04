import React from "react";
import StoreInitializer from "./store-initializer";

function layout(props: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen w-full max-w-4xl flex-col items-center justify-center sm:items-start gap-2 relative">
      {props.children}
    </main>
  );
}

export default layout;
