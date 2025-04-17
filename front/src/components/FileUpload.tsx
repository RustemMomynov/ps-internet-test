"use client";

import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useLazyQuery } from "@apollo/client";
import { gql } from "@apollo/client";

const GET_PRESIGNED_POST = gql`
  query GetPresignedPost($fileName: String!) {
    getPresignedPost(fileName: $fileName) {
      url
      fields
    }
  }
`;

const FileUpload = () => {
  const [getPresignedPost] = useLazyQuery(GET_PRESIGNED_POST);

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

  return (
    <div>
      <Upload
        multiple
        customRequest={handleCustomRequest}
        showUploadList={false}
      >
        <Button icon={<UploadOutlined />}>Выбрать файлы</Button>
      </Upload>

      {/* {previews.length > 0 && (
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
      )} */}
    </div>
  );
};

export default FileUpload;
