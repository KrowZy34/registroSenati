import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addAttention, findSurveyById, type Survey } from "@/lib/store";
import { toast } from "sonner";
import { Search, UserCheck, User, Calendar, FileText, Headset, X, GraduationCap } from "lucide-react";

interface Props {
  employeeName: string;
}

export default function EmployeeView({ employeeName }: Props) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<Survey | null | "notfound">(null);
  const [notes, setNotes] = useState("");
  const [carrera, setCarrera] = useState("");

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const found = findSurveyById(query);
    setResult(found ?? "notfound");
    setNotes("");
    setCarrera(found?.carrera ?? "");
  };

  const cancel = () => {
    setResult(null);
    setQuery("");
    setNotes("");
    setCarrera("");
  };

  const completeAttention = () => {
    if (!result || result === "notfound") return;
    if (!carrera.trim()) {
      toast.error("Indica la carrera del estudiante");
      return;
    }
    addAttention({
      studentId: result.id,
      employee: employeeName,
      notes: notes || "Atención completada",
      carrera: carrera.trim(),
    });
    toast.success("Atención registrada", { description: `${result.nombre} ${result.apellido}` });
    cancel();
  };

  return (
    <div className="container max-w-3xl py-8 sm:py-12">
      <div className="mb-8 animate-fade-in">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-3 py-1 text-xs text-muted-foreground">
          <Headset className="h-3.5 w-3.5" />
          Atendiendo como <span className="font-medium text-foreground">{employeeName}</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Atender estudiante</h1>
        <p className="mt-2 text-muted-foreground">Busca por ID para ver los datos de la encuesta.</p>
      </div>

      <Card className="border-border/60 shadow-elegant">
        <CardHeader>
          <CardTitle className="text-lg">Buscar por ID</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={search} className="flex flex-col gap-3 sm:flex-row">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="search" className="sr-only">ID</Label>
              <Input
                id="search"
                placeholder="ID del estudiante (ej. 2021003)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Button type="submit" className="bg-gradient-primary">
              <Search className="h-4 w-4" />
              Buscar
            </Button>
          </form>
        </CardContent>
      </Card>

      {result === "notfound" && (
        <div className="mt-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive animate-fade-in">
          No se encontró ningún estudiante con ese ID. Pídele que llene la encuesta primero.
        </div>
      )}

      {result && result !== "notfound" && (
        <Card className="mt-6 border-primary/30 bg-gradient-card shadow-elegant animate-scale-in">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Datos del estudiante</CardTitle>
              {result.attended && (
                <span className="rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-success">
                  Ya atendido
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="grid gap-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field icon={<User className="h-4 w-4" />} label="Nombre completo" value={`${result.nombre} ${result.apellido}`} />
              <Field icon={<FileText className="h-4 w-4" />} label="ID" value={result.id} mono />
              <Field
                icon={<Calendar className="h-4 w-4" />}
                label="Fecha de encuesta"
                value={new Date(result.createdAt).toLocaleString()}
              />
            </div>
            <div className="rounded-lg border border-border/60 bg-card p-4">
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Motivo</p>
              <p className="text-sm">{result.motivo}</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="carrera" className="flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4" />
                Carrera del estudiante
              </Label>
              <Input
                id="carrera"
                value={carrera}
                onChange={(e) => setCarrera(e.target.value)}
                placeholder="Ej. Ingeniería en Sistemas"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notas de la atención (opcional)</Label>
              <Textarea
                id="notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Resumen de lo realizado..."
              />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button onClick={completeAttention} size="lg" className="flex-1 bg-gradient-primary shadow-glow">
                <UserCheck className="h-4 w-4" />
                Marcar atención completada
              </Button>
              <Button onClick={cancel} size="lg" variant="outline" className="sm:w-auto">
                <X className="h-4 w-4" />
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Field({ icon, label, value, mono }: { icon: React.ReactNode; label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-lg border border-border/60 bg-card p-3">
      <div className="mb-1 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className={`text-sm font-medium ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}
