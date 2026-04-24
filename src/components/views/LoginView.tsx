import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { LogIn, Lock, User, Loader2 } from "lucide-react";

export default function LoginView() {
  const { login, loading, error } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      toast.success(`Bienvenido, ${username}`);
    } else {
      toast.error(error || "Credenciales incorrectas");
    }
  };

  return (
    <div className="container max-w-md py-12 sm:py-16">
      <div className="mb-8 text-center animate-fade-in">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-3 py-1 text-xs text-muted-foreground">
          <Lock className="h-3.5 w-3.5" />
          Acceso restringido
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Iniciar sesión
        </h1>
        <p className="mt-2 text-muted-foreground">
          Empleados y administradores.
        </p>
      </div>

      <Card className="border-border/60 shadow-elegant animate-scale-in">
        <CardHeader>
          <CardTitle>Credenciales</CardTitle>
          <CardDescription>Ingresa tu usuario y contraseña.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Usuario</Label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="username"
                  className="pl-9"
                  placeholder="ej. ana"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  disabled={loading}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  className="pl-9"
                  placeholder="••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  disabled={loading}
                />
              </div>
            </div>
            <Button
              type="submit"
              size="lg"
              className="bg-gradient-primary shadow-glow"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Entrar
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 rounded-lg border border-dashed border-border/70 bg-muted/40 p-3 text-xs text-muted-foreground">
            <p className="mb-1 font-medium text-foreground">
              Cuentas de prueba
            </p>
            <p>
              Empleado: <span className="font-mono">ana</span> /{" "}
              <span className="font-mono">1234</span>
            </p>
            <p>
              Admin: <span className="font-mono">admin</span> /{" "}
              <span className="font-mono">admin</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
