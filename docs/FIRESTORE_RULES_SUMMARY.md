# 🔒 Firestore Security Rules - Resumen

## Estado: ✅ Desplegadas y Activas

Las reglas de seguridad de Firestore están configuradas y desplegadas en el proyecto `set-finder-ceab2`.

---

## 📋 Reglas Implementadas

### 1. Colección `users`

**Lectura:**
- ✅ Usuarios autenticados pueden leer **solo su propio documento**
- ✅ Admins pueden leer **todos los usuarios**

**Escritura:**
- ✅ Usuarios autenticados pueden escribir **solo su propio documento**
- ✅ Admins pueden actualizar **solo el campo `role`** de cualquier usuario

**Código:**
```javascript
match /users/{userId} {
  allow read: if isAuthenticated() && request.auth.uid == userId;
  allow write: if isAuthenticated() && request.auth.uid == userId;
  allow read: if isAdmin();
  allow update: if isAdmin() && 
                  request.resource.data.diff(resource.data).affectedKeys().hasOnly(['role']);
}
```

---

### 2. Colección `sets`

**Lectura:**
- ✅ **Todos** (incluso no autenticados) pueden leer sets

**Escritura:**
- ✅ **Solo admins** pueden crear, actualizar o eliminar sets

**Código:**
```javascript
match /sets/{setId} {
  allow read: if true;
  allow create, update, delete: if isAdmin();
}
```

---

### 3. Colección `extractionJobs`

**Lectura:**
- ✅ Solo el **usuario creador** puede leer su job
- ✅ **Admins** pueden leer todos los jobs

**Escritura:**
- ✅ **Solo admins** pueden crear jobs
- ❌ **Nadie** puede actualizar o eliminar manualmente (solo Cloud Functions)

**Código:**
```javascript
match /extractionJobs/{jobId} {
  allow read: if isAuthenticated() && 
                 (resource.data.userId == request.auth.uid || isAdmin());
  allow create: if isAdmin();
  allow update, delete: if false;
}
```

---

## 🛡️ Funciones Helper

### `isAuthenticated()`
Verifica que el usuario esté autenticado.

```javascript
function isAuthenticated() {
  return request.auth != null;
}
```

### `isAdmin()`
Verifica que el usuario esté autenticado **Y** tenga el custom claim `admin: true`.

```javascript
function isAdmin() {
  return isAuthenticated() && request.auth.token.admin == true;
}
```

---

## 📊 Índices de Firestore

Los siguientes índices compuestos están configurados para optimizar las queries:

### Sets
1. **mainGenre + createdAt** (DESC) - Para filtrar por género
2. **favoriteCount + createdAt** (DESC) - Para ordenar por popularidad

### Extraction Jobs
1. **userId + createdAt** (DESC) - Para ver jobs de un usuario
2. **status + createdAt** (DESC) - Para filtrar por estado

---

## 🚀 Comandos Útiles

### Desplegar reglas
```bash
firebase deploy --only "firestore:rules"
```

### Desplegar índices
```bash
firebase deploy --only "firestore:indexes"
```

### Desplegar ambos
```bash
firebase deploy --only "firestore"
```

### Ver reglas en Firebase Console
```
https://console.firebase.google.com/project/set-finder-ceab2/firestore/rules
```

---

## ✅ Verificación

Para verificar que las reglas funcionan correctamente:

1. **Usuario normal** intenta leer otro usuario → ❌ Denegado
2. **Usuario normal** intenta crear un set → ❌ Denegado
3. **Usuario normal** lee su propio documento → ✅ Permitido
4. **Admin** lee cualquier usuario → ✅ Permitido
5. **Admin** crea un set → ✅ Permitido
6. **No autenticado** lee sets → ✅ Permitido

---

## 🔐 Seguridad Adicional

### Custom Claims para Admins

Los admins deben tener el custom claim `admin: true` configurado en Firebase Authentication.

**Cómo configurar (requiere Cloud Functions o Firebase Admin SDK):**

```javascript
admin.auth().setCustomUserClaims(uid, { admin: true });
```

### Validación de Datos

Las reglas actuales **no validan** el formato de los datos. Para producción, considera agregar validación:

```javascript
// Ejemplo: Validar que el email sea válido
allow create: if isAuthenticated() && 
                 request.resource.data.email.matches('.*@.*\\..*');
```

---

## 📝 Notas

- Las reglas se aplican **inmediatamente** después del deploy
- Los índices pueden tardar **unos minutos** en estar disponibles
- Las reglas se evalúan de **arriba hacia abajo** (primera coincidencia gana)
- Si **ninguna regla** permite la operación, se **deniega** por defecto

---

**Última actualización**: 18 de Noviembre, 2025
**Estado**: ✅ Activas en producción
