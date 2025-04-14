"use client";

import { Upload, Button, Image, Space } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { useState } from "react";
import { useFileStore } from "@/store/fileStore";

const FileUpload = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const { addFile } = useFileStore();

  const handlePreviewGeneration = (files: File[]) => {
    const readers = files.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((results) => {
      setPreviews(results);
    });
  };

  const handleFileChange = (info: any) => {
    const files = info.fileList;
    setFileList(files);

    const rawFiles = files.map((f: any) => f.originFileObj).filter(Boolean);
    handlePreviewGeneration(rawFiles);
  };

  const handleUpload = () => {
    fileList.forEach((f) => {
      const raw = f.originFileObj;
      if (!raw) return;

      addFile({
        id: `${Date.now()}-${raw.name}`,
        name: raw.name,
        size: raw.size,
        type: raw.type,
        url: URL.createObjectURL(raw),
      });
    });

    setFileList([]);
    setPreviews([]);
  };

  return (
    <div>
      <Upload
        multiple
        beforeUpload={() => false}
        fileList={fileList}
        onChange={handleFileChange}
        showUploadList={{ showPreviewIcon: false }}
      >
        <Button icon={<UploadOutlined />}>Выбрать файлы</Button>
      </Upload>

      {previews.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h4>Предпросмотр:</h4>
          <Space wrap>
            {previews.map((src, index) => (
              <Image
                key={index}
                src={src}
                width={120}
                height={120}
                style={{ objectFit: "cover", borderRadius: 8 }}
              />
            ))}
          </Space>

          <div style={{ marginTop: 16 }}>
            <Button type="primary" onClick={handleUpload}>
              Загрузить
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
