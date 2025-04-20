"use client";
import React from "react";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "@/lib/apolloClient";
import { ConfigProvider, Layout } from "antd";
import "./globals.css";
import { ProgressPreloader } from "@/components/ProgressPreloader";
import { CustomHeader } from "@/components/CustomHeader";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Layout>
          <CustomHeader />
          <ProgressPreloader />
          <ApolloProvider client={apolloClient}>
            <ConfigProvider>{children}</ConfigProvider>
          </ApolloProvider>
        </Layout>
      </body>
    </html>
  );
}
