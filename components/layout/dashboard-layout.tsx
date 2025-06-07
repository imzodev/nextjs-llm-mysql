"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="h-full relative">
      <div
        className={`fixed inset-y-0 z-50 flex-col md:flex w-72 bg-gray-900 ${
          sidebarOpen ? "flex" : "hidden md:flex"
        }`}
      >
        <Sidebar />
      </div>
      <div className={`md:pl-72 pb-10 ${sidebarOpen ? "ml-72" : ""}`}>
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
