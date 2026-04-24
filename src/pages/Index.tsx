import { useEffect, useState } from "react";
import AppHeader from "@/components/AppHeader";
import StudentView from "@/components/views/StudentView";
import ScanView from "@/components/views/ScanView";
import EmployeeView from "@/components/views/EmployeeView";
import AdminView from "@/components/views/AdminView";
import LoginView from "@/components/views/LoginView";
import { useAuth } from "@/hooks/useAuth";

type Tab = "student" | "scan" | "login";

const Index = () => {
  const [tab, setTab] = useState<Tab>("scan");
  const [scannedId, setScannedId] = useState<string | null>(null);
  const { account } = useAuth();

  useEffect(() => {
    document.title = "Atención Estudiantil · Sistema";

    // Detectar si viene de un QR (parámetro ?student=ID)
    const params = new URLSearchParams(window.location.search);
    const studentIdFromUrl = params.get("student");

    if (studentIdFromUrl) {
      // Si viene del QR, ir directo al formulario con el ID pre-llenado
      setScannedId(studentIdFromUrl);
      setTab("student");
      // Limpiar la URL para que no se vea el parámetro
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleScannedId = (studentId: string) => {
    setScannedId(studentId);
    setTab("student");
  };

  const renderContent = () => {
    if (account) {
      return account.role === "admin" ? (
        <AdminView />
      ) : (
        <EmployeeView
          employeeUsername={account.username}
          employeeName={account.name}
        />
      );
    }

    if (tab === "scan") {
      return <ScanView onStudentIdDetected={handleScannedId} />;
    }
    if (tab === "student") {
      return <StudentView prefilledId={scannedId} />;
    }
    return <LoginView />;
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <AppHeader tab={tab} onChange={setTab} />
      <main>{renderContent()}</main>
      <footer className="container py-8 text-center text-xs text-muted-foreground">
        Conectado a Supabase
      </footer>
    </div>
  );
};

export default Index;
