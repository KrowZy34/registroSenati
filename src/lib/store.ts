// Simulated data store using localStorage

export type Survey = {
  id: string; // student ID
  nombre: string;
  apellido: string;
  motivo: string;
  carrera?: string;
  createdAt: string; // ISO
  attended: boolean;
};

export type Attention = {
  id: string;
  studentId: string;
  employee: string;
  notes: string;
  carrera?: string;
  createdAt: string;
};

export type Account = {
  username: string;
  password: string;
  name: string;
  role: "employee" | "admin";
};

const SURVEYS_KEY = "sim_surveys_v1";
const ATTENTIONS_KEY = "sim_attentions_v1";

export const ACCOUNTS: Account[] = [
  { username: "ana", password: "1234", name: "Ana López", role: "employee" },
  { username: "carlos", password: "1234", name: "Carlos Pérez", role: "employee" },
  { username: "maria", password: "1234", name: "María Ruiz", role: "employee" },
  { username: "jorge", password: "1234", name: "Jorge Díaz", role: "employee" },
  { username: "admin", password: "admin", name: "Administrador", role: "admin" },
];

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("sim-store-update"));
}

export function getSurveys(): Survey[] {
  return read<Survey[]>(SURVEYS_KEY, []);
}

export function getAttentions(): Attention[] {
  return read<Attention[]>(ATTENTIONS_KEY, []);
}

export function addSurvey(s: Omit<Survey, "createdAt" | "attended">) {
  const surveys = getSurveys();
  const filtered = surveys.filter((x) => x.id !== s.id);
  filtered.push({ ...s, createdAt: new Date().toISOString(), attended: false });
  write(SURVEYS_KEY, filtered);
}

export function findSurveyById(id: string): Survey | undefined {
  return getSurveys().find((s) => s.id.trim().toLowerCase() === id.trim().toLowerCase());
}

export function addAttention(a: Omit<Attention, "id" | "createdAt">) {
  const list = getAttentions();
  list.push({
    ...a,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  });
  write(ATTENTIONS_KEY, list);

  // mark survey attended and store carrera
  const surveys = getSurveys();
  const idx = surveys.findIndex((s) => s.id === a.studentId);
  if (idx >= 0) {
    surveys[idx] = { ...surveys[idx], attended: true, carrera: a.carrera ?? surveys[idx].carrera };
    write(SURVEYS_KEY, surveys);
  }
}

export function authenticate(username: string, password: string): Account | null {
  const acc = ACCOUNTS.find(
    (a) => a.username.toLowerCase() === username.trim().toLowerCase() && a.password === password,
  );
  return acc ?? null;
}

export function seedIfEmpty() {
  if (getSurveys().length > 0) return;
  const sample: Survey[] = [
    { id: "2021001", nombre: "Lucía", apellido: "Gómez", motivo: "Constancia de estudios", carrera: "Ingeniería en Sistemas", createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), attended: true },
    { id: "2021002", nombre: "Pedro", apellido: "Martínez", motivo: "Inscripción a materia", carrera: "Administración", createdAt: new Date(Date.now() - 86400000).toISOString(), attended: true },
    { id: "2021003", nombre: "Sofía", apellido: "Ramírez", motivo: "Pago de matrícula", createdAt: new Date(Date.now() - 3600000 * 5).toISOString(), attended: false },
    { id: "2021004", nombre: "Diego", apellido: "Torres", motivo: "Solicitud de beca", carrera: "Derecho", createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), attended: true },
    { id: "2021005", nombre: "Valentina", apellido: "Núñez", motivo: "Cambio de carrera", createdAt: new Date().toISOString(), attended: false },
  ];
  write(SURVEYS_KEY, sample);

  const attentions: Attention[] = [
    { id: crypto.randomUUID(), studentId: "2021001", employee: "Ana López", notes: "Entrega de constancia", carrera: "Ingeniería en Sistemas", createdAt: new Date(Date.now() - 86400000 * 2 + 3600000).toISOString() },
    { id: crypto.randomUUID(), studentId: "2021002", employee: "Ana López", notes: "Inscripción completada", carrera: "Administración", createdAt: new Date(Date.now() - 86400000 + 1800000).toISOString() },
    { id: crypto.randomUUID(), studentId: "2021004", employee: "Carlos Pérez", notes: "Beca aprobada", carrera: "Derecho", createdAt: new Date(Date.now() - 3600000).toISOString() },
  ];
  write(ATTENTIONS_KEY, attentions);
}
