"use client";

import FileUpload from "@/features/fIles/ui/FileUpload";
import FileList from "@/features/fIles/ui/FileList";

export default function Files() {
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ margin: "0 0 20px 0" }}>Управление файлами</h1>
      <FileUpload />
      <div style={{ marginTop: 32 }}>
        <FileList />
      </div>
    </div>
  );
}
