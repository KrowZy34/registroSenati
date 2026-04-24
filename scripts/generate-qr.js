import QRCode from "qrcode";
import fs from "fs";
import path from "path";

// IDs de estudiantes para generar QR
const studentIds = [
  "2021001",
  "2021002",
  "2021003",
  "2021004",
  "2021005",
  "2024050",
  "1591622",
];

// URL BASE de tu aplicación (cambia esto a tu dominio en producción)
const BASE_URL = "http://localhost:8081";

const outputDir = path.join(process.cwd(), "public", "qr-codes");

// Crear directorio si no existe
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`✅ Directorio creado: ${outputDir}`);
}

async function generateQRCodes() {
  console.log("📱 Generando códigos QR con URL...\n");

  for (const studentId of studentIds) {
    try {
      const fileName = path.join(outputDir, `${studentId}.png`);
      
      // URL que abre la app con el ID del estudiante
      const qrUrl = `${BASE_URL}/?student=${studentId}`;
      
      // Generar QR como PNG
      await QRCode.toFile(fileName, qrUrl, {
        errorCorrectionLevel: "H",
        type: "image/png",
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      console.log(`✅ QR generado: ${studentId}.png → ${qrUrl}`);
    } catch (err) {
      console.error(`❌ Error generando QR para ${studentId}:`, err.message);
    }
  }

  // Generar también un HTML con todos los QR para imprimir
  generatePrintPage(studentIds);
  
  console.log("\n🎉 ¡Listo! Todos los QR fueron generados.");
  console.log(`📂 Ubicación: ${outputDir}`);
  console.log(`🖨️  Ver imprimible: ${BASE_URL}/qr-print.html`);
  console.log(`\n📝 Notas:`);
  console.log(`   - Cada QR contiene una URL con el ID del estudiante`);
  console.log(`   - Al escanear desde celular, abrirá la app y pre-llenará el ID`);
  console.log(`   - En producción, reemplaza la BASE_URL`);
}

function generatePrintPage(ids) {
  const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Códigos QR - Imprimible</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        h1 { text-align: center; margin-bottom: 30px; color: #333; }
        .qr-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .qr-card {
            background: white;
            border: 2px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            page-break-inside: avoid;
        }
        .qr-card img {
            width: 200px;
            height: 200px;
            margin-bottom: 10px;
        }
        .student-id {
            font-weight: bold;
            font-size: 16px;
            color: #333;
            margin-top: 10px;
            font-family: monospace;
        }
        .print-button {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        .print-button:hover { background: #0056b3; }
        @media print {
            body { background: white; }
            .print-button { display: none; }
            .qr-grid { gap: 15px; }
        }
    </style>
</head>
<body>
    <button class="print-button" onclick="window.print()">🖨️ Imprimir</button>
    
    <div class="container">
        <h1>📱 Códigos QR - Carnés de Estudiantes</h1>
        <p style="text-align: center; margin-bottom: 20px; color: #666;">
            Escanea cualquier código QR con tu celular para ir directamente al registro
        </p>
        <div class="qr-grid">
${ids.map(id => `
            <div class="qr-card">
                <img src="/qr-codes/${id}.png" alt="QR ${id}">
                <div class="student-id">ID: ${id}</div>
            </div>
`).join('')}
        </div>
    </div>
</body>
</html>
`;

  const printPagePath = path.join(process.cwd(), "public", "qr-print.html");
  fs.writeFileSync(printPagePath, htmlContent);
  console.log(`\n📄 Página imprimible creada: qr-print.html`);
}

generateQRCodes();
