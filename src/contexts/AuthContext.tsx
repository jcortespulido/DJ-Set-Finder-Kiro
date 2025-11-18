import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
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
        await loadUserData(firebaseUser);
      } else {
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
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userToken = await firebaseUser.getIdToken();
        const tokenResult = await firebaseUser.getIdTokenResult();
        
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          name: userData.name,
          role: userData.role,
          favorites: userData.favorites || [],
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt,
        });
        
        setToken(userToken);
        setIsAdmin(tokenResult.claims.admin === true);
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

  const value: AuthContextValue = {
    user,
    token,
    isAdmin,
    isLoading,
    login,
    register,
    logout,
    refreshToken,
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
