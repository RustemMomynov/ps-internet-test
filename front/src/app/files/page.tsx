"use client";

import FileUpload from "@/features/fIles/ui/FileUpload";
import FileList from "@/features/fIles/ui/FileList";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import useLoadingStore from "@/bll/LoadingStore";

export default function Files() {
  const router = useRouter();
  const { setIsLoading } = useLoadingStore();

  const handleLogout = async () => {
    setIsLoading(true);
    await fetch("/api/auth/delete-token", {
      method: "POST",
    });
    router.push("/files");
    setIsLoading(false);
  };

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ margin: "0 0 20px 0" }}>Управление файлами</h1>
      <FileUpload />
      <div style={{ marginTop: 32 }}>
        <FileList />
      </div>
      <div style={{ margin: "20px 0" }}>
        <Button onClick={handleLogout} danger>
          Выйти
        </Button>
      </div>
    </div>
  );
}
