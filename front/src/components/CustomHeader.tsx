"use client";

import { Layout, Button } from "antd";
import { useRouter, usePathname } from "next/navigation";
import useLoadingStore from "@/bll/LoadingStore";

const { Header } = Layout;

export const CustomHeader = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { setIsLoading } = useLoadingStore();

  const handleLogout = async () => {
    setIsLoading(true);
    await fetch("/api/auth/delete-token", {
      method: "POST",
    });
    router.push("/files");
    setIsLoading(false);
  };

  const showLogoutButton = pathname === "/files";

  return (
    <Header
      style={{
        padding: "10px",
        display: "flex",
        justifyContent: "right",
        alignItems: "center",
      }}
    >
      {showLogoutButton && (
        <Button onClick={handleLogout} danger>
          Выйти
        </Button>
      )}
    </Header>
  );
};
