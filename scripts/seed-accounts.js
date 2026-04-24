import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Error: Faltan credenciales de Supabase en .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedAccounts() {
  try {
    console.log("📝 Insertando cuentas...");

    const accounts = [
      { username: "admin", password: "admin", name: "Administrador", role: "admin" },
      { username: "trabajador1", password: "1234", name: "Juan Trabajador", role: "employee" },
    ];

    for (const account of accounts) {
      const { data, error } = await supabase
        .from("accounts")
        .insert([account])
        .select();

      if (error) {
        // Si el error es que ya existe, lo ignoramos
        if (error.code === "23505") {
          console.log(`⚠️  La cuenta ${account.username} ya existe`);
        } else {
          console.error(`❌ Error insertando ${account.username}:`, error.message);
        }
      } else {
        console.log(`✅ Cuenta creada: ${account.username}`);
      }
    }

    console.log("\n✨ ¡Listo! Cuentas disponibles:");
    console.log("  Admin: admin / admin");
    console.log("  Trabajador: trabajador1 / 1234");
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

seedAccounts();
