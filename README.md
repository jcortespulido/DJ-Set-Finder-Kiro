# Set Finder

Una Progressive Web App (PWA) para explorar, analizar y descubrir tracklists de sets de DJ.

## 🚀 Estado del Proyecto

✅ **Tarea 1: Configurar proyecto y estructura base - COMPLETADA**

### Subtareas Completadas:

- ✅ 1.1 Inicializar proyecto React con Vite y TypeScript
- ✅ 1.2 Configurar Firebase proyecto
- ✅ 1.3 Configurar PWA con Vite
- ✅ 1.4 Crear tipos TypeScript base

## 📁 Estructura del Proyecto

```
set-finder/
├── public/
│   ├── icons/              # Iconos PWA (pendiente generar PNG)
│   │   └── icon.svg        # Icono base SVG
│   └── robots.txt
├── src/
│   ├── components/         # Componentes React
│   ├── hooks/              # Custom hooks
│   │   └── useRegisterSW.ts
│   ├── services/           # Servicios (Firebase, API)
│   │   └── firebase.config.ts
│   ├── types/              # Definiciones TypeScript
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example            # Plantilla de variables de entorno
├── firebase.json           # Configuración Firebase
├── firestore.rules         # Reglas de seguridad Firestore
├── firestore.indexes.json  # Índices Firestore
├── storage.rules           # Reglas de seguridad Storage
├── vite.config.ts          # Configuración Vite + PWA
├── tailwind.config.js      # Configuración Tailwind CSS
├── tsconfig.json           # Configuración TypeScript
└── package.json

```

## 🛠️ Tecnologías

- **Frontend**: React 18 + TypeScript + Vite
- **Estilos**: Tailwind CSS
- **Backend**: Firebase (Firestore, Auth, Storage, Hosting, Functions)
- **PWA**: Vite PWA Plugin + Workbox
- **Routing**: React Router DOM
- **Offline**: IndexedDB (idb)

## 📋 Próximos Pasos

### Antes de comenzar el desarrollo:

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar Firebase**:
   - Seguir las instrucciones en `FIREBASE_SETUP.md`
   - Crear proyecto en Firebase Console
   - Copiar `.env.example` a `.env` y completar con tus credenciales

3. **Generar iconos PWA**:
   - Seguir las instrucciones en `PWA_ICONS_GUIDE.md`
   - Generar iconos PNG desde el SVG base

4. **Iniciar servidor de desarrollo**:
   ```bash
   npm run dev
   ```

### Siguiente tarea de implementación:

**Tarea 2: Implementar sistema de autenticación**
- 2.1 Crear AuthContext y AuthProvider
- 2.2 Crear componente AuthModal
- 2.3 Crear servicio de Firestore para usuarios
- 2.4 Escribir tests para autenticación (opcional)

## 📚 Documentación

- `FIREBASE_SETUP.md` - Guía completa de configuración de Firebase
- `PWA_ICONS_GUIDE.md` - Guía para generar iconos PWA
- `.kiro/specs/set-finder-app/` - Especificaciones completas del proyecto
  - `requirements.md` - Requisitos funcionales
  - `design.md` - Documento de diseño
  - `tasks.md` - Plan de implementación

## 🎨 Tema Visual

La aplicación usa un tema de neón oscuro con los siguientes colores:

- **Fondo**: `#0d0a1d` (azul-negro muy oscuro)
- **Neón Cyan**: `#00f2ea` (color principal)
- **Neón Violet**: `#d15fff`
- **Neón Blue**: `#4df9ff`
- **Neón Red**: `#ff4747`
- **Neón Green**: `#39ff14`
- **Neón Orange**: `#ff8c00`
- **Neón Pink**: `#ff1493`

## 🔧 Scripts Disponibles

```bash
npm run dev      # Iniciar servidor de desarrollo
npm run build    # Construir para producción
npm run preview  # Previsualizar build de producción
npm run lint     # Ejecutar ESLint
```

## 📝 Notas

- El proyecto está configurado con TypeScript estricto
- Tailwind CSS está configurado con colores de neón personalizados
- PWA configurado con estrategias de caché optimizadas
- Firebase Security Rules ya están definidas
- Todos los tipos TypeScript base están creados

## 🚦 Estado de Tareas

Ver el archivo `.kiro/specs/set-finder-app/tasks.md` para el plan completo de implementación.

**Progreso actual**: 1/14 tareas principales completadas (7%)

---

Desarrollado con ❤️ para la comunidad de DJs y amantes de la música electrónica.
