"use client";

import { Upload, Button, Image, Space, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import React, { useState } from "react";
import { useFileStore } from "@/store/fileStore";
import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client";

const UPLOAD_FILE = gql`
  mutation UploadFile($input: UploadFileInput!, $file: Upload!) {
    uploadFile(input: $input, file: $file) {
      _id
      name
      url
      type
      size
    }
  }
`;

const FileUpload: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const { addFile } = useFileStore();

  const [uploadFileMutation, { loading }] = useMutation(UPLOAD_FILE);

  const handlePreviewGeneration = (files: File[]) => {
    const readers = files.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(setPreviews);
  };

  const handleFileChange = (info: any) => {
    const files = info.fileList;
    setFileList(files);
    const rawFiles = files.map((f: any) => f.originFileObj).filter(Boolean);
    handlePreviewGeneration(rawFiles);
  };

  const handleUpload = async () => {
    for (const file of fileList) {
      const raw = file.originFileObj;
      if (!raw) continue;

      try {
        const { data } = await uploadFileMutation({
          variables: {
            input: {
              name: raw.name,
              size: raw.size,
              type: raw.type,
            },
            file: raw,
          },
        });

        if (data?.uploadFile) {
          addFile(data.uploadFile);
        }
      } catch (err) {
        console.error(err);
        message.error(`Ошибка загрузки: ${file.name}`);
      }
    }

    message.success("Все файлы загружены!");
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
        <>
          <Space wrap style={{ marginTop: 16 }}>
            {previews.map((src, idx) => (
              <Image key={idx} src={src} width={120} />
            ))}
          </Space>

          <Button
            type="primary"
            onClick={handleUpload}
            style={{ marginTop: 16 }}
            loading={loading}
          >
            Загрузить на сервер
          </Button>
        </>
      )}
    </div>
  );
};

export default FileUpload;
