"use client";

import { useState } from "react";
import { Upload, Button, message, Space, Image } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_PRESIGNED_POST, SAVE_FILES } from "../api/fileApi";

interface UploadFileData {
  file: File;
  url?: string;
  uploaded: boolean;
}

const FileUpload = () => {
  const [getPresignedPost] = useLazyQuery(GET_PRESIGNED_POST);
  const [saveFiles, { loading }] = useMutation(SAVE_FILES);
  const [fileList, setFileList] = useState<any[]>([]);

  const [uploads, setUploads] = useState<UploadFileData[]>([]);

  const handleCustomRequest = async (options: any) => {
    const { file, onSuccess, onError } = options;
    try {
      const { data } = await getPresignedPost({
        variables: { fileName: file.name },
      });

      const { url, fields } = data.getPresignedPost;

      const formData = new FormData();
      Object.entries(fields).forEach(([k, v]) => {
        formData.append(k, v as any);
      });
      formData.append("file", file);

      const res = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const fileUrl = new URL(fields.key, url).toString();
        setUploads((prev) => [...prev, { file, url: fileUrl, uploaded: true }]);

        message.success(`${file.name} uploaded successfully`);
        onSuccess?.({}, file);
      } else {
        throw new Error(`Upload failed with status ${res.status}`);
      }
    } catch (err) {
      console.error(err);
      message.error(`${file.name} upload failed`);
      onError?.(err);
    }
  };

  const handleUploadToServer = async () => {
    const filesToSave = uploads
      .filter((u) => u.uploaded && u.url)
      .map((u) => ({
        name: u.file.name,
        size: u.file.size,
        type: u.file.type || "unknown",
        url: u.url!,
      }));

    if (filesToSave.length === 0) {
      message.warning("Нет файлов для сохранения");
      return;
    }

    try {
      await saveFiles({
        variables: { files: filesToSave },
        refetchQueries: ["getFiles"],
      });

      message.success("Файлы сохранены в базе данных");
      setUploads([]);
      setFileList([]);
    } catch (err) {
      console.error(err);
      message.error("Ошибка при сохранении файлов");
    }
  };

  return (
    <div>
      <Upload
        multiple
        customRequest={handleCustomRequest}
        showUploadList={true}
        fileList={fileList}
        onChange={({ fileList }) => setFileList(fileList)}
      >
        <Button icon={<UploadOutlined />}>Выбрать файлы</Button>
      </Upload>

      {uploads.length > 0 && (
        <>
          <Space wrap style={{ marginTop: 16 }}>
            {uploads.map((u) => (
              <Image alt="" key={u.url} src={u.url} width={120} />
            ))}
          </Space>

          <div>
            <Button
              type="primary"
              onClick={handleUploadToServer}
              style={{ marginTop: 16 }}
              loading={loading}
            >
              Загрузить на сервер
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default FileUpload;
