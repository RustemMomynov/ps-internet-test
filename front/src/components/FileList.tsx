"use client";

import React from "react";
import { Table, Image, Button, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useFileStore } from "@/store/fileStore";

const FileList: React.FC = () => {
  const { files, setFiles } = useFileStore();

  const handleDelete = (id: string) => {
    setFiles(files.filter((file) => file.id !== id));
  };

  const columns: ColumnsType<(typeof files)[0]> = [
    {
      title: "Превью",
      dataIndex: "url",
      key: "preview",
      render: (url: string, record) => {
        if (record.type?.startsWith("image/")) {
          return (
            <Image
              src={url}
              width={80}
              height={80}
              style={{ objectFit: "cover" }}
            />
          );
        }
        return "—";
      },
    },
    {
      title: "Имя",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Размер (KB)",
      dataIndex: "size",
      key: "size",
      render: (size: number) => (size / 1024).toFixed(1),
    },
    {
      title: "Тип",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Действия",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="Удалить файл?"
          onConfirm={() => handleDelete(record.id)}
          okText="Да"
          cancelText="Нет"
        >
          <Button danger size="small">
            Удалить
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      dataSource={files}
      columns={columns}
      pagination={{ pageSize: 5 }}
    />
  );
};

export default FileList;
