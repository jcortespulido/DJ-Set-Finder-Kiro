# 🏠 Configuración en PC Personal

## 📦 Progreso Actual del Proyecto

**Tareas Completadas:**
- ✅ Tarea 1: Configurar proyecto y estructura base (100%)
- ✅ Tarea 2: Implementar sistema de autenticación (100%)

**Total: 2 de 14 tareas completadas (14%)**

---

## 🔄 Opción 1: Clonar desde GitHub (Recomendado)

### Paso 1: Clonar el repositorio

```bash
git clone https://github.com/jcortespulido/DJ-Set-Finder-AWS.git
cd DJ-Set-Finder-AWS
```

### Paso 2: Instalar dependencias

```bash
npm install
```

### Paso 3: Configurar Firebase

1. Crea el archivo `.env` en la raíz del proyecto:

```env
VITE_FIREBASE_API_KEY=AIzaSyDesPzebmM8QETHlO7xk0D4YMenpeEZF3A
VITE_FIREBASE_AUTH_DOMAIN=set-finder-ceab2.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=set-finder-ceab2
VITE_FIREBASE_STORAGE_BUCKET=set-finder-ceab2.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=985109101048
VITE_FIREBASE_APP_ID=1:985109101048:web:b3fa8b960cdfaa35ef7e0d
```

### Paso 4: Iniciar el servidor

```bash
npm run dev
```

Abre `http://localhost:5173`

---

## 🔄 Opción 2: Copiar Archivos Manualmente

Si GitHub no funciona, copia toda la carpeta del proyecto a una USB o nube:

### Archivos Importantes a Copiar:

```
DJ-Set-Finder-AWS/
├── .kiro/                    # Especificaciones del proyecto
├── src/                      # Código fuente
├── public/                   # Archivos públicos
├── package.json              # Dependencias
├── vite.config.ts           # Configuración Vite
├── tailwind.config.js       # Configuración Tailwind
├── tsconfig.json            # Configuración TypeScript
├── firebase.json            # Configuración Firebase
├── firestore.rules          # Reglas de seguridad
├── .env.example             # Template de variables
└── README.md                # Documentación
```

**NO copies:**
- ❌ `node_modules/` (se regenera con npm install)
- ❌ `dist/` (se regenera con npm run build)
- ❌ `.env` (créalo nuevo en tu PC personal)

### En tu PC Personal:

1. Copia la carpeta completa
2. Abre una terminal en la carpeta
3. Ejecuta: `npm install`
4. Crea el archivo `.env` con las credenciales de arriba
5. Ejecuta: `npm run dev`

---

## 🔥 Configuración de Firebase (Ya está hecha)

Tu proyecto de Firebase ya está configurado:

- **Proyecto**: set-finder-ceab2
- **Authentication**: Email/Password habilitado
- **Firestore**: Base de datos creada
- **Hosting**: Configurado

**No necesitas crear otro proyecto**, solo usa las credenciales del `.env`.

---

## ✅ Verificar que Todo Funciona

1. Ejecuta `npm run dev`
2. Abre `http://localhost:5173`
3. Haz clic en "Iniciar Sesión / Registrarse"
4. Crea una cuenta de prueba
5. Verifica que aparece tu información de usuario

---

## 📝 Próximas Tareas a Implementar

**Tarea 3: Implementar estilos globales y componentes base**
- 3.1 Crear GlobalStyles component
- 3.2 Crear componentes de iconos SVG
- 3.3 Crear componente GlobalHeader

**Tarea 4: Implementar servicio de Firestore para sets**
- 4.1 Crear funciones CRUD para sets
- 4.2 Crear hooks personalizados

Ver el archivo `.kiro/specs/set-finder-app/tasks.md` para el plan completo.

---

## 🆘 Solución de Problemas

### Error: "Cannot find module 'firebase'"

```bash
npm install
```

### Error: "VITE_FIREBASE_API_KEY is not defined"

Verifica que el archivo `.env` existe y tiene las credenciales correctas.

### Error: "Firebase: Error (auth/configuration-not-found)"

Verifica que habilitaste Authentication en Firebase Console:
- Build > Authentication > Sign-in method > Email/Password

### Puerto 5173 ocupado

```bash
npm run dev -- --port 3000
```

---

## 📞 Contacto

Si tienes problemas, revisa:
- `README.md` - Información general
- `FIREBASE_SETUP.md` - Guía de Firebase
- `GETTING_STARTED.md` - Guía de inicio rápido

---

**¡Todo está listo para continuar en tu PC personal!** 🚀
