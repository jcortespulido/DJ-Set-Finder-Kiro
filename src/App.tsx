import { useState } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { AuthModal } from './components/AuthModal'

function AppContent() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user, isLoading, logout } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d0a1d] flex items-center justify-center">
        <div className="text-cyan-400 text-xl">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0d0a1d]">
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-cyan-400 text-center">
          SET FINDER
        </h1>
        <p className="text-gray-400 text-center mt-4">
          Aplicación en construcción...
        </p>
        <p className="text-gray-500 text-center mt-2 text-sm">
          ✅ Sistema de autenticación implementado
        </p>

        {/* Panel de prueba de autenticación */}
        <div className="mt-12 max-w-md mx-auto bg-[#1a1a2e] border border-cyan-500/30 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Estado de Autenticación
          </h2>

          {user ? (
            <div className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/30 rounded p-4">
                <p className="text-green-400 font-semibold mb-2">
                  ✅ Usuario autenticado
                </p>
                <div className="text-sm text-gray-300 space-y-1">
                  <p>
                    <span className="text-gray-500">Email:</span> {user.email}
                  </p>
                  <p>
                    <span className="text-gray-500">Nombre:</span> {user.name}
                  </p>
                  <p>
                    <span className="text-gray-500">Rol:</span> {user.role}
                  </p>
                  <p>
                    <span className="text-gray-500">ID:</span>{' '}
                    {user.id.substring(0, 8)}...
                  </p>
                </div>
              </div>

              <button
                onClick={logout}
                className="w-full py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-4">
                <p className="text-yellow-400 font-semibold">
                  ⚠️ No hay usuario autenticado
                </p>
              </div>

              <button
                onClick={() => setShowAuthModal(true)}
                className="w-full py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded transition-colors"
              >
                Iniciar Sesión / Registrarse
              </button>
            </div>
          )}
        </div>

        {/* Instrucciones */}
        <div className="mt-8 max-w-2xl mx-auto text-gray-400 text-sm space-y-2">
          <p className="text-center font-semibold text-cyan-400">
            📝 Instrucciones para probar:
          </p>
          <ol className="list-decimal list-inside space-y-1 text-left">
            <li>Haz clic en "Iniciar Sesión / Registrarse"</li>
            <li>Ve a la pestaña "Registro"</li>
            <li>Crea una cuenta con email y contraseña (mínimo 8 caracteres)</li>
            <li>Verifica en Firebase Console que el usuario se creó</li>
            <li>Prueba cerrar sesión y volver a iniciar sesión</li>
          </ol>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
