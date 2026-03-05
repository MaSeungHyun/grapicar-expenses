"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import userStore from "@/store/user";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function User() {
  const router = useRouter();
  const { name, setName } = userStore();

  const [save, setSave] = useState(false);
  const [error, setError] = useState(false);

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setError(false);
    setName(value);
  };

  const isEmptyName = () => {
    return !name || name.trim() === "";
  };

  const saveUserCookie = () => {
    if (save && name) {
      document.cookie = `user=${encodeURIComponent(name)}; path=/; max-age=${60 * 60 * 24 * 30}`;
    }
  };

  const handleChangeSave = (checked: boolean) => {
    const willSave = Boolean(checked);
    setSave(willSave);
  };

  const handleSubmit = () => {
    if (isEmptyName()) {
      setError(true);
      return;
    }
    saveUserCookie();
    router.push("/expenses");
  };

  return (
    <div className="w-full flex flex-col flex-1 justify-center gap-2 px-16 lg:px-0">
      <h1>사원명을 입력해주세요</h1>
      <Input
        className="w-full placeholder:text-red-500"
        autoFocus
        value={name}
        onChange={handleChangeName}
        aria-invalid={error}
        placeholder={error ? "사원명을 입력해주세요" : undefined}
      />
      <div className="gap-2 flex items-center">
        <Checkbox id="save" checked={save} onCheckedChange={handleChangeSave} />
        <Label htmlFor="save" className="text-sm text-neutral-400">
          사용자 기억하기
        </Label>
      </div>
      <Button className="w-full mt-5" onClick={handleSubmit}>
        입력
      </Button>
    </div>
  );
}
