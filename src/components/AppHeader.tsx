import { GraduationCap, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

type Tab = "student" | "login";

interface Props {
  tab: Tab;
  onChange: (t: Tab) => void;
}

const tabs: { key: Tab; label: string }[] = [
  { key: "student", label: "Estudiante" },
  { key: "login", label: "Iniciar sesión" },
];

export default function AppHeader({ tab, onChange }: Props) {
  const { account, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight">
              Atención Estudiantil
            </span>
            <span className="text-xs text-muted-foreground">SENATI</span>
          </div>
        </div>

        {account ? (
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium leading-tight">
                {account.name}
              </p>
              <p className="text-xs capitalize text-muted-foreground">
                {account.role === "admin" ? "Administrador" : "Empleado"}
              </p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary text-xs font-semibold text-primary-foreground shadow-md">
              {account.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </div>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Salir</span>
            </Button>
          </div>
        ) : (
          <nav className="flex items-center gap-1 rounded-full border border-border/70 bg-card p-1 shadow-sm">
            {tabs.map((t) => {
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => onChange(t.key)}
                  className={`relative rounded-full px-3 py-1.5 text-xs font-medium transition-all sm:px-4 sm:text-sm ${
                    active
                      ? "bg-gradient-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}
