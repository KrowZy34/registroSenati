import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Credenciales de Supabase no configuradas en .env.local");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types para las tablas
export type Account = {
  username: string;
  password?: string;
  name: string;
  role: "employee" | "admin";
  created_at?: string;
  updated_at?: string;
};

export type Survey = {
  id: string;
  nombre: string;
  apellido: string;
  motivo: string;
  carrera?: string;
  attended: boolean;
  created_at: string;
  updated_at?: string;
};

export type Attention = {
  id: string;
  student_id: string;
  employee: string;
  notes?: string;
  carrera?: string;
  created_at: string;
  updated_at?: string;
};

// Funciones auxiliares para las operaciones CRUD
export async function getSurveys() {
  const { data, error } = await supabase
    .from("surveys")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getSurveyById(id: string) {
  const { data, error } = await supabase
    .from("surveys")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function createSurvey(survey: Omit<Survey, "created_at">) {
  const { data, error } = await supabase
    .from("surveys")
    .insert([
      {
        ...survey,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateSurvey(
  id: string,
  updates: Partial<Omit<Survey, "id" | "created_at">>,
) {
  const { data, error } = await supabase
    .from("surveys")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getAttentions() {
  const { data, error } = await supabase
    .from("attentions")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function createAttention(
  attention: Omit<Attention, "id" | "created_at">,
) {
  const { data, error } = await supabase
    .from("attentions")
    .insert([
      {
        ...attention,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getAccounts() {
  const { data, error } = await supabase.from("accounts").select("*");
  if (error) throw error;
  return data;
}

export async function getAccountByUsername(username: string) {
  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("username", username)
    .single();
  if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows
  return data;
}
