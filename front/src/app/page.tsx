import FileUpload from "@/components/FileUpload";
import FileList from "@/components/FileList";

export default function HomePage() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Управление файлами</h1>
      <FileUpload />
      <div style={{ marginTop: 32 }}>
        <FileList />
      </div>
    </div>
  );
}
