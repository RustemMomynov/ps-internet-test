"use client";

import React, { useState } from "react";
import {
  Table,
  Image,
  Popconfirm,
  Button,
  Space,
  Input,
  Pagination,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useMutation, useQuery } from "@apollo/client";
import { DELETE_FILE, GET_FILES } from "@/features/fIles/api/fileApi";

const FileList = () => {
  const [page, setPage] = useState(1);
  const pageSize = 3;
  const [search, setSearch] = useState("");

  const { data, loading } = useQuery(GET_FILES, {
    variables: { page, pageSize, search },
  });
  const [deleteFile] = useMutation(DELETE_FILE);

  const files = data?.getFiles?.items || [];
  const total = data?.getFiles?.total || 0;

  const handleSearch = (value: string) => {
    setPage(1);
    setSearch(value);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteFile({
        variables: { id },
        refetchQueries: ["getFiles"],
      });
    } catch (err) {
      console.error(err);
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: "Превью",
      dataIndex: "url",
      key: "preview",
      render: (url: string, record) => {
        if (record.type?.startsWith("image/")) {
          return (
            <Image
              alt={record.name}
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
      title: "Размер",
      dataIndex: "size",
      key: "size",
      render: (bytes: number) => {
        const sizes = ["B", "KB", "MB", "GB", "TB"];
        if (bytes === 0) return "0 B";

        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        const size = bytes / Math.pow(1024, i);
        const rounded = size >= 10 ? Math.round(size) : size.toFixed(1);

        return `${rounded} ${sizes[i]}`;
      },
    },
    {
      title: "Тип",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Дата загрузки",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => {
        const date = new Date(createdAt);
        const day = date.toLocaleDateString("ru-RU");
        const time = date.toLocaleTimeString("ru-RU");

        return `${day}, ${time}`;
      },
    },
    {
      title: "Действия",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="Удалить файл?"
          onConfirm={() => handleDelete(record._id)}
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
    <>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          allowClear
          placeholder="Поиск по имени файла"
          onSearch={handleSearch}
          enterButton
          style={{ width: 300 }}
        />
      </Space>

      <Table
        rowKey="_id"
        dataSource={files}
        loading={loading}
        columns={columns}
        pagination={false}
      />

      <Pagination
        current={page}
        total={total}
        pageSize={pageSize}
        onChange={(p) => setPage(p)}
        style={{ margin: "0px auto" }}
      />
    </>
  );
};

export default FileList;
