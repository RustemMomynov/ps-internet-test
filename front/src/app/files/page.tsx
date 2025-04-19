"use client";

import FileUpload from "@/components/FileUpload";
import FileList from "@/components/FileList";
import { Button } from "antd";
import { useRouter } from "next/navigation";

export default function Files() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/delete-token", {
      method: "POST",
    });
    router.push("/files");
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Управление файлами</h1>
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
