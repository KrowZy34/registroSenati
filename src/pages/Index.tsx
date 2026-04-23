import { useEffect, useState } from "react";
import AppHeader from "@/components/AppHeader";
import StudentView from "@/components/views/StudentView";
import EmployeeView from "@/components/views/EmployeeView";
import AdminView from "@/components/views/AdminView";
import LoginView from "@/components/views/LoginView";
import { seedIfEmpty } from "@/lib/store";
import { useAuth } from "@/hooks/useAuth";

type Tab = "student" | "login";

const Index = () => {
  const [tab, setTab] = useState<Tab>("student");
  const { account } = useAuth();

  useEffect(() => {
    seedIfEmpty();
    document.title = "Atención Estudiantil · Sistema simulado";
  }, []);

  const renderContent = () => {
    if (account) {
      return account.role === "admin" ? (
        <AdminView />
      ) : (
        <EmployeeView employeeName={account.name} />
      );
    }
    return tab === "student" ? <StudentView /> : <LoginView />;
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <AppHeader tab={tab} onChange={setTab} />
      <main>{renderContent()}</main>
      <footer className="container py-8 text-center text-xs text-muted-foreground">
        Prueba inicial de diseño
      </footer>
    </div>
  );
};

export default Index;
