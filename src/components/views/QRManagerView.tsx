import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QrCode, Download, RefreshCw, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface QRItem {
  id: string;
  exists: boolean;
}

export default function QRManagerView() {
  const [qrItems, setQrItems] = useState<QRItem[]>([]);
  const [newId, setNewId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadQRs();
  }, []);

  const loadQRs = () => {
    // Simular carga de IDs disponibles
    const defaultIds = [
      "2021001",
      "2021002",
      "2021003",
      "2021004",
      "2021005",
      "2024050",
      "1591622",
    ];
    setQrItems(defaultIds.map((id) => ({ id, exists: true })));
  };

  const handleAddQR = async () => {
    if (!newId.trim()) {
      toast.error("Ingresa un ID de estudiante");
      return;
    }

    if (qrItems.some((q) => q.id === newId)) {
      toast.error("Este ID ya existe");
      return;
    }

    setLoading(true);
    try {
      // Aquí iría la llamada al servidor para generar el QR
      const newItem = { id: newId, exists: true };
      setQrItems([...qrItems, newItem]);
      setNewId("");
      toast.success(`QR generado para ID ${newId}`);
    } catch (err) {
      toast.error("Error generando QR");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQR = (id: string) => {
    setQrItems(qrItems.filter((q) => q.id !== id));
    toast.success(`QR eliminado para ID ${id}`);
  };

  const downloadQRImage = (id: string) => {
    const link = document.createElement("a");
    link.href = `/qr-codes/${id}.png`;
    link.download = `QR_${id}.png`;
    link.click();
  };

  const downloadAllQRs = () => {
    window.open("/qr-print.html", "_blank");
    toast.success("Abierta página de impresión");
  };

  return (
    <div className="container max-w-6xl py-8 sm:py-12">
      <div className="mb-8 animate-fade-in">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-3 py-1 text-xs text-muted-foreground">
          <QrCode className="h-3.5 w-3.5" />
          Gestor de códigos QR
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Administrar códigos QR
        </h1>
        <p className="mt-2 text-muted-foreground">
          Genera y administra códigos QR para los carnés de estudiantes.
        </p>
      </div>

      {/* Agregar nuevo QR */}
      <Card className="mb-6 border-border/60 shadow-elegant animate-scale-in">
        <CardHeader>
          <CardTitle>Generar nuevo QR</CardTitle>
          <CardDescription>Ingresa el ID del estudiante</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-col sm:flex-row">
            <Input
              placeholder="Ej. 2024051"
              value={newId}
              onChange={(e) => setNewId(e.target.value)}
              disabled={loading}
            />
            <Button
              onClick={handleAddQR}
              disabled={loading}
              className="bg-gradient-primary"
            >
              <Plus className="h-4 w-4" />
              {loading ? "Generando..." : "Generar"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Acciones rápidas */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <Button
          onClick={downloadAllQRs}
          variant="outline"
          className="justify-center"
        >
          <Download className="h-4 w-4" />
          Descargar todos (PDF)
        </Button>
        <Button onClick={loadQRs} variant="outline" className="justify-center">
          <RefreshCw className="h-4 w-4" />
          Recargar
        </Button>
      </div>

      {/* Grid de QR */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {qrItems.map((item) => (
          <Card
            key={item.id}
            className="border-border/60 overflow-hidden hover:shadow-md transition-shadow animate-scale-in"
          >
            <CardContent className="p-4">
              <div className="aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                <img
                  src={`/qr-codes/${item.id}.png`}
                  alt={`QR ${item.id}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm font-mono font-medium mb-3 text-center">
                {item.id}
              </p>
              <div className="flex gap-2 text-xs">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => downloadQRImage(item.id)}
                >
                  <Download className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-destructive"
                  onClick={() => handleDeleteQR(item.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {qrItems.length === 0 && (
        <div className="text-center py-12">
          <QrCode className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-muted-foreground">No hay códigos QR generados</p>
        </div>
      )}
    </div>
  );
}
