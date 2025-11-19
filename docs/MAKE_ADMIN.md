# 🔐 Cómo Hacer un Usuario Admin

Para hacer que un usuario sea administrador, necesitas actualizar su documento en Firestore manualmente.

## Pasos:

### 1. Ve a Firebase Console
```
https://console.firebase.google.com/project/set-finder-ceab2/firestore/data
```

### 2. Navega a la colección `users`

### 3. Encuentra tu usuario
Busca el documento con tu email.

### 4. Edita el campo `role`
- Haz clic en el documento
- Encuentra el campo `role`
- Cambia el valor de `"user"` a `"admin"`
- Guarda los cambios

### 5. Recarga la aplicación
- Cierra sesión
- Vuelve a iniciar sesión
- Ahora deberías ver la pestaña "Admin" en el header

---

## Nota Importante

Por ahora, el rol de admin solo se guarda en Firestore. Para que funcione completamente con las reglas de seguridad, necesitarías configurar Custom Claims en Firebase Authentication usando Cloud Functions.

Sin embargo, para desarrollo y pruebas, cambiar el rol en Firestore es suficiente para acceder al panel de administración.

---

## Verificar que Eres Admin

1. Inicia sesión
2. Abre la consola del navegador (F12)
3. Escribe: `console.log(window.localStorage)`
4. Busca tu información de usuario
5. Verifica que `role: "admin"`

Si ves la pestaña "Admin" en el header, ¡ya eres admin! 🎉
