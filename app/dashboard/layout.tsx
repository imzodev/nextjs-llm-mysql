import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ThemeProvider } from "@/components/theme-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </ThemeProvider>
  );
}
