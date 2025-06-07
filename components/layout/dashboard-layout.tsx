"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="h-full relative">
      <div
        className={`fixed inset-y-0 z-50 flex-col md:flex bg-gray-900 transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-64'} hidden md:flex`}
      >
        <Sidebar collapsed={sidebarCollapsed} toggleSidebar={() => setSidebarCollapsed((c) => !c)} />
      </div>
      <div className={
        `transition-all duration-300 pb-10 ` +
        (sidebarCollapsed ? "md:pl-20" : "md:pl-64")
      }>
        <Header toggleSidebar={() => setSidebarCollapsed((c) => !c)} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
