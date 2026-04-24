# 🚀 Integración Supabase - RegistroSenati

## ✅ Completado

Se ha integrado exitosamente **Supabase** como base de datos en lugar de localStorage.

### Cambios realizados:

1. **`.env.local`** - Archivo de configuración con credenciales de Supabase
2. **`src/lib/supabase.ts`** - Cliente de Supabase y funciones CRUD
3. **`src/hooks/useAuth.ts`** - Autenticación async contra base de datos
4. **`src/hooks/useStore.ts`** - Carga de surveys y attentions async
5. **`src/components/views/LoginView.tsx`** - Login mejorado con async
6. **`src/components/views/StudentView.tsx`** - Crear surveys directamente en Supabase
7. **`src/components/views/EmployeeView.tsx`** - Buscar y crear atenciones en Supabase
8. **`src/components/views/AdminView.tsx`** - Dashboard con datos en tiempo real
9. **`src/pages/Index.tsx`** - Actualizado para manejar sesiones de Supabase

---

## 📋 Tablas requeridas en Supabase

Ya tienes las credenciales. Ahora necesitas crear las siguientes tablas en tu proyecto Supabase:

### 1. Tabla: `accounts`
```sql
CREATE TABLE accounts (
    username VARCHAR(50) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role TEXT CHECK (role IN ('employee', 'admin')) NOT NULL DEFAULT 'employee',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_accounts_role ON accounts(role);
CREATE INDEX idx_accounts_name ON accounts(name);
```

### 2. Tabla: `surveys`
```sql
CREATE TABLE surveys (
    id VARCHAR(20) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    motivo TEXT NOT NULL,
    carrera VARCHAR(150),
    attended BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_surveys_attended ON surveys(attended);
CREATE INDEX idx_surveys_created_at ON surveys(created_at DESC);
CREATE INDEX idx_surveys_id_search ON surveys(id);
```

### 3. Tabla: `attentions`
```sql
CREATE TABLE attentions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id VARCHAR(20) NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
    employee VARCHAR(50) NOT NULL REFERENCES accounts(username),
    notes TEXT,
    carrera VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_attentions_student_id ON attentions(student_id);
CREATE INDEX idx_attentions_employee ON attentions(employee);
CREATE INDEX idx_attentions_created_at ON attentions(created_at DESC);
```

### 4. Datos iniciales (opcionales para testing)
```sql
-- Insertar cuentas
INSERT INTO accounts (username, password, name, role) VALUES
('admin', 'admin', 'Administrador', 'admin'),
('ana', '1234', 'Ana López', 'employee'),
('carlos', '1234', 'Carlos Pérez', 'employee'),
('maria', '1234', 'María Ruiz', 'employee'),
('jorge', '1234', 'Jorge Díaz', 'employee');

-- Insertar surveys de ejemplo
INSERT INTO surveys (id, nombre, apellido, motivo, carrera, attended) VALUES
('2021001', 'Juan', 'Pérez', 'Constancia de estudios', 'Ingeniería en Sistemas', true),
('2021002', 'María', 'García', 'Inscripción a materia', 'Administración', true),
('2021003', 'Luis', 'Hernández', 'Pago de matrícula', 'Derecho', false),
('2021004', 'Carlos', 'López', 'Solicitud de beca', 'Ingeniería Civil', true),
('2021005', 'Laura', 'Martínez', 'Cambio de carrera', 'Contabilidad', false);

-- Insertar atenciones de ejemplo
INSERT INTO attentions (student_id, employee, notes, carrera) VALUES
('2021001', 'ana', 'Entrega de constancia de estudios', 'Ingeniería en Sistemas'),
('2021002', 'carlos', 'Inscripción completada en Sistema', 'Administración'),
('2021004', 'maria', 'Beca aprobada, se envió a registro', 'Ingeniería Civil');
```

---

## 🔑 Configuración de credenciales

Tu archivo `.env.local` ya contiene:

```bash
VITE_SUPABASE_URL=https://nnjycuzvvejggipgzszi.supabase.co
VITE_SUPABASE_ANON_KEY=tu_publishable_key_completa_aqui
```

**⚠️ IMPORTANTE:** Reemplaza `tu_publishable_key_completa_aqui` con tu **VITE_SUPABASE_ANON_KEY** real de Supabase.

### Cómo obtenerla:
1. Ve a [supabase.com](https://supabase.com)
2. Abre tu proyecto
3. Ve a Settings → API
4. Copia la **Publishable key (anon, public)** bajo Project API Keys
5. Pégala en `.env.local`

---

## 🚀 Próximos pasos

1. **Crea las tablas en Supabase** usando los scripts SQL arriba
2. **Actualiza `.env.local`** con tu key real
3. **Ejecuta el servidor:**
   ```bash
   npm run dev
   ```
4. **Prueba el sistema:**
   - Estudiante: Registra una encuesta (sin login)
   - Empleado: Inicia sesión con `ana`/`1234` y busca al estudiante
   - Admin: Inicia sesión con `admin`/`admin` para ver estadísticas

---

## 🔒 Seguridad

⚠️ **Consideraciones importantes:**

- **Contraseñas:** Actualmente se guardan en texto plano. En producción, usa bcrypt o Supabase Auth
- **RLS (Row Level Security):** Implementa políticas de seguridad en Supabase
- **Variables de entorno:** No commits `.env.local` al repositorio

---

## 📚 Estructura de datos

- **Surveys**: Se crean sin autenticación (estudiantes)
- **Attentions**: Se crean al completar una atención (empleados)
- **Accounts**: Usuarios del sistema con roles

Los datos se sincronizam cada 5 segundos desde Supabase.

---

## 🐛 Troubleshooting

**Error: "there is no unique constraint matching given keys"**
- Asegúrate que las Foreign Keys referencia a campos únicos (PK)

**Error: "Credenciales de Supabase no configuradas"**
- Verifica que `.env.local` tiene ambas variables: VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY

**No se guardan los datos**
- Revisa la consola del navegador y la consola de Supabase para errores
- Verifica que las tablas existen en Supabase

---

**¿Necesitas ayuda?** Revisa las funciones en `src/lib/supabase.ts` para ver cómo se hacen las operaciones CRUD.
