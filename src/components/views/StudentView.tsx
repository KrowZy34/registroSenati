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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { addSurvey } from "@/lib/store";
import { toast } from "sonner";
import { CheckCircle2, ClipboardList, Send } from "lucide-react";

export default function StudentView() {
  const [form, setForm] = useState({
    id: "",
    nombre: "",
    apellido: "",
    motivo: "",
  });
  const [done, setDone] = useState<null | typeof form>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id || !form.nombre || !form.apellido || !form.motivo) {
      toast.error("Completa todos los campos");
      return;
    }
    addSurvey(form);
    setDone(form);
    toast.success("Encuesta registrada", { description: `ID ${form.id}` });
    setForm({ id: "", nombre: "", apellido: "", motivo: "" });
  };

  return (
    <div className="container max-w-2xl py-8 sm:py-12">
      <div className="mb-8 animate-fade-in">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-3 py-1 text-xs text-muted-foreground">
          <ClipboardList className="h-3.5 w-3.5" />
          Paso 1 · Estudiante
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Encuesta de atención
        </h1>
        <p className="mt-2 text-muted-foreground">
          Completa tus datos antes de pasar con un empleado.
        </p>
      </div>

      <Card className="animate-scale-in border-border/60 shadow-elegant">
        <CardHeader>
          <CardTitle>Tus datos</CardTitle>
          <CardDescription>ingresa tus datos</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="id">ID del estudiante</Label>
              <Input
                id="id"
                placeholder="Ej. 2024050"
                value={form.id}
                onChange={(e) => setForm({ ...form, id: e.target.value })}
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="apellido">Apellido</Label>
                <Input
                  id="apellido"
                  value={form.apellido}
                  onChange={(e) =>
                    setForm({ ...form, apellido: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="motivo">Motivo de la visita</Label>
              <Textarea
                id="motivo"
                rows={4}
                placeholder="Describe brevemente el motivo de tu visita"
                value={form.motivo}
                onChange={(e) => setForm({ ...form, motivo: e.target.value })}
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="bg-gradient-primary shadow-glow hover:opacity-95"
            >
              <Send className="h-4 w-4" />
              Enviar encuesta
            </Button>
          </form>
        </CardContent>
      </Card>

      {done && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-success/30 bg-success/5 p-4 animate-fade-in">
          <CheckCircle2 className="mt-0.5 h-5 w-5 text-success" />
          <div className="text-sm">
            <p className="font-medium text-foreground">
              ¡Listo, {done.nombre}!
            </p>
            <p className="text-muted-foreground">
              Acércate al mostrador y proporciona tu ID{" "}
              <span className="font-mono font-semibold text-foreground">
                {done.id}
              </span>{" "}
              al empleado.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
