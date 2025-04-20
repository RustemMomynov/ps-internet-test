"use client";
import React, { useState } from "react";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "@/lib/apolloClient";
import { ConfigProvider, Layout } from "antd";
import "./globals.css";
import { ProgressPreloader } from "@/components/ProgressPreloader";

const { Header } = Layout;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Layout>
          <Header style={{ padding: 0 }}></Header>
          <ProgressPreloader />
          <ApolloProvider client={apolloClient}>
            <ConfigProvider>{children}</ConfigProvider>
          </ApolloProvider>
        </Layout>
      </body>
    </html>
  );
}
