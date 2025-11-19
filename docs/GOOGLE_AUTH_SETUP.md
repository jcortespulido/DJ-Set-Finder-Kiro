# 🔐 Configuración de Google Sign-In en Firebase

## ✅ Código Implementado

El código para Google Sign-In ya está implementado en tu proyecto:

- ✅ `AuthContext.tsx` - Función `loginWithGoogle()` agregada
- ✅ `AuthModal.tsx` - Botón "Continuar con Google" agregado
- ✅ `types/index.ts` - Tipo actualizado con `loginWithGoogle`

## 📋 Pasos para Habilitar Google Sign-In en Firebase

### 1. Ir a Firebase Console

Abre tu proyecto en Firebase Console:
```
https://console.firebase.google.com/project/set-finder-ceab2
```

### 2. Habilitar Google como Proveedor

1. En el menú lateral, ve a **Build** > **Authentication**
2. Haz clic en la pestaña **Sign-in method**
3. En la lista de proveedores, busca **Google**
4. Haz clic en **Google** para editarlo
5. Activa el toggle **Enable** (Habilitar)
6. Selecciona un **Support email** (tu email)
7. Haz clic en **Save** (Guardar)

### 3. Configurar Dominios Autorizados (Opcional)

Si vas a usar la app en producción, necesitas agregar tu dominio:

1. En la misma página de **Authentication** > **Settings**
2. Ve a la pestaña **Authorized domains**
3. Agrega tu dominio de producción (ej: `set-finder.web.app`)

**Nota**: `localhost` ya está autorizado por defecto para desarrollo.

## 🧪 Probar Google Sign-In

### En Desarrollo (localhost)

1. Ejecuta tu app: `npm run dev`
2. Abre http://localhost:5173
3. Haz clic en "Iniciar Sesión / Registrarse"
4. Haz clic en el botón **"Continuar con Google"**
5. Selecciona tu cuenta de Google
6. Autoriza la aplicación
7. ¡Listo! Deberías estar autenticado

### Verificar en Firebase Console

Después de iniciar sesión con Google:

1. Ve a **Authentication** > **Users**
2. Deberías ver tu usuario con el proveedor **google.com**
3. Ve a **Firestore Database** > **users**
4. Deberías ver un documento con tu información

## 🎨 Cómo Funciona

### Flujo de Autenticación

1. Usuario hace clic en "Continuar con Google"
2. Se abre un popup de Google para seleccionar cuenta
3. Usuario autoriza la aplicación
4. Firebase retorna los datos del usuario
5. Si es un usuario nuevo:
   - Se crea un documento en Firestore con su información
   - Rol: `user` (por defecto)
   - Favoritos: array vacío
6. Si ya existe, solo se carga su información
7. Usuario queda autenticado en la app

### Datos que se Guardan

```typescript
{
  email: "usuario@gmail.com",
  name: "Nombre del Usuario", // Desde Google
  role: "user",
  favorites: [],
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## 🔒 Seguridad

- ✅ Firebase maneja toda la autenticación de forma segura
- ✅ No necesitas guardar contraseñas
- ✅ Google verifica la identidad del usuario
- ✅ Los tokens se manejan automáticamente
- ✅ Las reglas de Firestore protegen los datos

## 🚀 Ventajas de Google Sign-In

1. **Más rápido**: No necesitas crear cuenta ni recordar contraseña
2. **Más seguro**: Google maneja la autenticación
3. **Mejor UX**: Un solo clic para iniciar sesión
4. **Confiable**: Los usuarios confían en Google
5. **Menos fricción**: Reduce el abandono en el registro

## 🎯 Próximos Pasos

Una vez que funcione Google Sign-In, puedes agregar más proveedores:

- 🔵 Facebook Login
- 🐦 Twitter Login
- 📧 Apple Sign-In
- 📱 Phone Authentication

Todos se configuran de forma similar en Firebase Console.

## 📝 Notas Importantes

### Para Producción

Cuando despliegues a producción, asegúrate de:

1. Agregar tu dominio a **Authorized domains**
2. Configurar las **OAuth consent screen** en Google Cloud Console
3. Verificar que las credenciales de Firebase estén en `.env.production`

### Limitaciones de Desarrollo

- El popup de Google puede ser bloqueado por algunos navegadores
- En modo incógnito, puede pedir autorización cada vez
- Algunos antivirus pueden bloquear el popup

### Solución de Problemas

**Error: "This app is not authorized to use Firebase Authentication"**
- Verifica que Google esté habilitado en Firebase Console
- Verifica que `localhost` esté en dominios autorizados

**Error: "Popup closed by user"**
- El usuario cerró el popup antes de completar el login
- Es normal, no es un error crítico

**Error: "Network error"**
- Verifica tu conexión a internet
- Verifica que Firebase esté configurado correctamente

## ✅ Checklist de Configuración

- [ ] Ir a Firebase Console
- [ ] Habilitar Google en Authentication > Sign-in method
- [ ] Seleccionar email de soporte
- [ ] Guardar cambios
- [ ] Probar login con Google en localhost
- [ ] Verificar usuario en Firebase Console > Authentication
- [ ] Verificar documento en Firestore > users

---

**¡Listo!** Ahora tu app soporta login con Google 🎉
