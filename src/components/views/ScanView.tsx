import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Scan, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";

interface Props {
  onStudentIdDetected: (studentId: string) => void;
}

const AVAILABLE_QR_IDS = [
  "2021001",
  "2021002",
  "2021003",
  "2021004",
  "2021005",
  "2024050",
  "1591622",
];

export default function ScanView({ onStudentIdDetected }: Props) {
  const [scanned, setScanned] = useState<string | null>(null);
  const [manualId, setManualId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    try {
      scannerRef.current = new Html5QrcodeScanner(
        "qr-scanner",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false,
      );

      scannerRef.current.render(
        (decodedText) => {
          // El QR puede contener solo el ID o una URL
          const studentId = decodedText.split("/").pop() || decodedText;
          setScanned(studentId);
          setError(null);
          scannerRef.current?.pause();
          setTimeout(() => onStudentIdDetected(studentId), 500);
        },
        (error) => {
          // Ignorar errores de escaneo
          console.debug("Scan error:", error);
        },
      );

      return () => {
        if (scannerRef.current) {
          scannerRef.current.clear().catch(() => {});
        }
      };
    } catch (err) {
      setError(
        "No se pudo acceder a la cámara. Intenta ingresar el ID manualmente.",
      );
    }
  }, [onStudentIdDetected]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualId.trim()) {
      setError("Por favor ingresa el ID del estudiante");
      return;
    }
    setScanned(manualId);
    setError(null);
    setTimeout(() => onStudentIdDetected(manualId), 300);
  };

  const handleQRClick = (studentId: string) => {
    setScanned(studentId);
    setError(null);
    setTimeout(() => onStudentIdDetected(studentId), 300);
  };

  return (
    <div className="container max-w-2xl py-8 sm:py-12">
      <div className="mb-8 animate-fade-in">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-3 py-1 text-xs text-muted-foreground">
          <Scan className="h-3.5 w-3.5" />
          Escanear QR
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Registro rápido
        </h1>
        <p className="mt-2 text-muted-foreground">
          Escanea el código QR de tu carnet o ingresa tu ID manualmente.
        </p>
      </div>

      <div className="grid gap-6">
        {/* QR Scanner */}
        <Card className="border-border/60 shadow-elegant animate-scale-in overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">Escanear código QR</CardTitle>
            <CardDescription>Apunta tu cámara al código QR</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              id="qr-scanner"
              className="w-full rounded-lg overflow-hidden bg-muted"
              style={{ minHeight: "300px" }}
            />
            {error && (
              <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Manual Entry */}
        <Card className="border-border/60 shadow-elegant">
          <CardHeader>
            <CardTitle className="text-lg">Ingreso manual</CardTitle>
            <CardDescription>O escribe tu ID directamente</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleManualSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="student-id">ID del estudiante</Label>
                <Input
                  id="student-id"
                  placeholder="Ej. 2024050"
                  value={manualId}
                  onChange={(e) => setManualId(e.target.value)}
                  disabled={!!scanned}
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="bg-gradient-primary shadow-glow"
                disabled={!!scanned}
              >
                <ArrowRight className="h-4 w-4" />
                Continuar
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* QR Gallery */}
        <Card className="border-border/60 shadow-elegant">
          <CardHeader>
            <CardTitle className="text-lg">Códigos QR disponibles</CardTitle>
            <CardDescription>
              Haz clic en un código para simular el escaneo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {AVAILABLE_QR_IDS.map((id) => (
                <button
                  key={id}
                  onClick={() => handleQRClick(id)}
                  disabled={!!scanned}
                  className="group relative rounded-lg border border-border/60 overflow-hidden hover:shadow-md transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="aspect-square bg-muted flex items-center justify-center">
                    <img
                      src={`/qr-codes/${id}.png`}
                      alt={`QR ${id}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <p className="text-xs font-mono font-medium text-white">
                      {id}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Success State */}
        {scanned && (
          <div className="rounded-lg border border-success/30 bg-success/5 p-4 flex items-start gap-3 animate-fade-in">
            <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-foreground">
                ID detectado: <span className="font-mono">{scanned}</span>
              </p>
              <p className="text-muted-foreground mt-1">
                Redirigiendo al formulario de registro...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
