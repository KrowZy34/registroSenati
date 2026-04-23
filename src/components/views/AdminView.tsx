import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStore } from "@/hooks/useStore";
import { Activity, ClipboardCheck, Clock, ShieldCheck, TrendingUp, Users, BarChart3, PieChart as PieIcon } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CHART_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--success))",
  "hsl(var(--warning))",
  "hsl(var(--destructive))",
];

export default function AdminView() {
  const { surveys, attentions } = useStore();

  const stats = useMemo(() => {
    const total = surveys.length;
    const attended = surveys.filter((s) => s.attended).length;
    const pending = total - attended;
    const today = new Date().toDateString();
    const todayCount = surveys.filter((s) => new Date(s.createdAt).toDateString() === today).length;
    return { total, attended, pending, todayCount };
  }, [surveys]);

  const ranking = useMemo(() => {
    const map = new Map<string, number>();
    attentions.forEach((a) => map.set(a.employee, (map.get(a.employee) ?? 0) + 1));
    return Array.from(map.entries())
      .map(([employee, count]) => ({ employee, count }))
      .sort((a, b) => b.count - a.count);
  }, [attentions]);

  const statusData = useMemo(
    () => [
      { name: "Atendidos", value: stats.attended },
      { name: "Pendientes", value: stats.pending },
    ],
    [stats],
  );

  const last7Days = useMemo(() => {
    const days: { day: string; encuestas: number; atenciones: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toDateString();
      const label = d.toLocaleDateString(undefined, { weekday: "short", day: "numeric" });
      const encuestas = surveys.filter((s) => new Date(s.createdAt).toDateString() === key).length;
      const ats = attentions.filter((a) => new Date(a.createdAt).toDateString() === key).length;
      days.push({ day: label, encuestas, atenciones: ats });
    }
    return days;
  }, [surveys, attentions]);

  const carreraData = useMemo(() => {
    const map = new Map<string, number>();
    surveys.forEach((s) => {
      const c = s.carrera?.trim();
      if (!c) return;
      map.set(c, (map.get(c) ?? 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [surveys]);

  const recent = useMemo(
    () => [...surveys].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 8),
    [surveys],
  );

  return (
    <div className="container max-w-6xl py-8 sm:py-12">
      <div className="mb-8 animate-fade-in">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-3 py-1 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5" />
          Panel de administrador
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Estadísticas y procesos</h1>
        <p className="mt-2 text-muted-foreground">Visión general del flujo de atención estudiantil.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<ClipboardCheck className="h-5 w-5" />} label="Encuestas totales" value={stats.total} tone="primary" />
        <StatCard icon={<Activity className="h-5 w-5" />} label="Atendidos" value={stats.attended} tone="success" />
        <StatCard icon={<Clock className="h-5 w-5" />} label="Pendientes" value={stats.pending} tone="warning" />
        <StatCard icon={<TrendingUp className="h-5 w-5" />} label="Hoy" value={stats.todayCount} tone="accent" />
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-4 w-4 text-primary" />
              Actividad últimos 7 días
            </CardTitle>
            <CardDescription>Encuestas vs atenciones</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="encuestas" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="atenciones" stroke="hsl(var(--accent))" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <PieIcon className="h-4 w-4 text-primary" />
              Estado de atención
            </CardTitle>
            <CardDescription>Proporción de encuestas atendidas</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={90} innerRadius={50} paddingAngle={2}>
                  <Cell fill="hsl(var(--success))" />
                  <Cell fill="hsl(var(--warning))" />
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-4 w-4 text-primary" />
              Empleados más activos
            </CardTitle>
            <CardDescription>Atenciones registradas por empleado</CardDescription>
          </CardHeader>
          <CardContent>
            {ranking.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aún no hay atenciones registradas.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={ranking} layout="vertical" margin={{ left: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
                  <YAxis type="category" dataKey="employee" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <PieIcon className="h-4 w-4 text-primary" />
              Distribución por carrera
            </CardTitle>
            <CardDescription>Estudiantes atendidos según carrera</CardDescription>
          </CardHeader>
          <CardContent>
            {carreraData.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aún no hay carreras registradas.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={carreraData} dataKey="value" nameKey="name" outerRadius={90} label>
                    {carreraData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Encuestas recientes</CardTitle>
          <CardDescription>Últimos estudiantes que llenaron la encuesta</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border border-border/60">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead>ID</TableHead>
                  <TableHead>Estudiante</TableHead>
                  <TableHead className="hidden sm:table-cell">Motivo</TableHead>
                  <TableHead className="hidden md:table-cell">Carrera</TableHead>
                  <TableHead className="text-right">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      Sin registros
                    </TableCell>
                  </TableRow>
                )}
                {recent.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-mono text-xs">{s.id}</TableCell>
                    <TableCell className="font-medium">
                      {s.nombre} {s.apellido}
                    </TableCell>
                    <TableCell className="hidden max-w-[200px] truncate text-muted-foreground sm:table-cell">
                      {s.motivo}
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">
                      {s.carrera ?? "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          s.attended
                            ? "bg-success/15 text-success"
                            : "bg-warning/15 text-warning"
                        }`}
                      >
                        {s.attended ? "Atendido" : "Pendiente"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone: "primary" | "success" | "warning" | "accent";
}) {
  const tones: Record<string, string> = {
    primary: "from-primary/15 to-primary/5 text-primary",
    success: "from-success/15 to-success/5 text-success",
    warning: "from-warning/15 to-warning/5 text-warning",
    accent: "from-accent/15 to-accent/5 text-accent",
  };
  return (
    <Card className="overflow-hidden border-border/60 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
          </div>
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${tones[tone]}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
