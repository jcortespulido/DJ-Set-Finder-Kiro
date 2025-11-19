import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebase.config';
import type { User, AuthContextValue } from '../types';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar usuario desde Firebase Auth al montar
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        console.log('Usuario detectado:', firebaseUser.email);
        await loadUserData(firebaseUser);
      } else {
        console.log('No hay usuario autenticado');
        setUser(null);
        setToken(null);
        setIsAdmin(false);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Cargar datos del usuario desde Firestore
  const loadUserData = async (firebaseUser: FirebaseUser) => {
    try {
      console.log('Cargando datos del usuario:', firebaseUser.uid);
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (userDoc.exists()) {
        console.log('Documento de usuario encontrado');
        const userData = userDoc.data();
        const userToken = await firebaseUser.getIdToken();
        
        const loadedUser = {
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          name: userData.name,
          role: userData.role,
          favorites: userData.favorites || [],
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt,
        };
        
        console.log('Usuario cargado:', loadedUser);
        setUser(loadedUser);
        setToken(userToken);
        // Verificar si es admin desde el rol de Firestore
        setIsAdmin(userData.role === 'admin');
      } else {
        console.error('Documento de usuario NO encontrado en Firestore');
      }
    } catch (error) {
      console.error('Error cargando datos del usuario:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Registrar nuevo usuario
  const register = async (email: string, password: string, name: string) => {
    try {
      // Crear usuario en Firebase Auth
      const { user: firebaseUser } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Crear documento en Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        email,
        name,
        role: 'user',
        favorites: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Cargar datos del usuario
      await loadUserData(firebaseUser);
    } catch (error: any) {
      console.error('Error en registro:', error);
      throw new Error(getAuthErrorMessage(error.code));
    }
  };

  // Iniciar sesión
  const login = async (email: string, password: string) => {
    try {
      const { user: firebaseUser } = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      await loadUserData(firebaseUser);
    } catch (error: any) {
      console.error('Error en login:', error);
      throw new Error(getAuthErrorMessage(error.code));
    }
  };

  // Iniciar sesión con Google
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      // Usar popup
      const result = await signInWithPopup(auth, provider);
      
      // Verificar si el usuario ya existe en Firestore
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      
      if (!userDoc.exists()) {
        console.log('Creando nuevo usuario de Google en Firestore...');
        // Si es un usuario nuevo, crear documento en Firestore
        await setDoc(doc(db, 'users', result.user.uid), {
          email: result.user.email,
          name: result.user.displayName || 'Usuario de Google',
          role: 'user',
          favorites: [],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        console.log('Usuario de Google creado en Firestore');
      }
      
      // El onAuthStateChanged se encargará de cargar los datos
    } catch (error: any) {
      console.error('Error en login con Google:', error);
      
      // Manejar errores específicos
      if (error.code === 'auth/popup-blocked') {
        throw new Error('El popup fue bloqueado. Por favor, permite popups para este sitio.');
      } else if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Cerraste el popup antes de completar el login.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        // Usuario abrió múltiples popups, ignorar este error
        return;
      }
      
      throw new Error(getAuthErrorMessage(error.code));
    }
  };

  // Cerrar sesión
  const logout = () => {
    signOut(auth);
    setUser(null);
    setToken(null);
    setIsAdmin(false);
  };

  // Refrescar token
  const refreshToken = async () => {
    if (auth.currentUser) {
      const newToken = await auth.currentUser.getIdToken(true);
      setToken(newToken);
    }
  };

  // Refrescar datos del usuario
  const refreshUser = async () => {
    if (auth.currentUser) {
      await loadUserData(auth.currentUser);
    }
  };

  const value: AuthContextValue = {
    user,
    token,
    isAdmin,
    isLoading,
    login,
    loginWithGoogle,
    register,
    logout,
    refreshToken,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Mensajes de error en español
function getAuthErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    'auth/email-already-in-use': 'El email ya está registrado',
    'auth/invalid-email': 'Email inválido',
    'auth/operation-not-allowed': 'Operación no permitida',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
    'auth/user-disabled': 'Usuario deshabilitado',
    'auth/user-not-found': 'Usuario no encontrado',
    'auth/wrong-password': 'Contraseña incorrecta',
    'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
    'auth/network-request-failed': 'Error de conexión',
  };

  return errorMessages[errorCode] || 'Error de autenticación';
}
