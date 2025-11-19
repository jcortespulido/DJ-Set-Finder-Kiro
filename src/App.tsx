import { useState, useEffect, lazy, Suspense } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { AuthModal } from './components/AuthModal'
import { GlobalStyles } from './components/GlobalStyles'
import { GlobalHeader } from './components/GlobalHeader'
import { ErrorBoundary } from './components/ErrorBoundary'
import { OfflineBanner } from './components/OfflineBanner'
import { InstallPrompt } from './components/InstallPrompt'
import { LoadingSpinner } from './components/LoadingSpinner'
import { HomeView } from './views/HomeView'
import { ExploreView } from './views/ExploreView'
import { useOfflineSync } from './hooks/useOfflineSync'
import { clearOldCache } from './services/offlineStorage'

// Lazy load heavy components
const DetailView = lazy(() => import('./views/DetailView').then(m => ({ default: m.DetailView })))
const FavoritesView = lazy(() => import('./views/FavoritesView').then(m => ({ default: m.FavoritesView })))
const AdminView = lazy(() => import('./views/AdminView').then(m => ({ default: m.AdminView })))

type Tab = 'home' | 'explore' | 'favorites' | 'admin';

function AppContent() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('home')
  const [selectedSetId, setSelectedSetId] = useState<string | null>(null)
  const { isLoading } = useAuth()

  // Sync offline favorites when connection is restored
  useOfflineSync()

  // Handle Spotify callback
  useEffect(() => {
    const handleSpotifyCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      
      if (code) {
        // Import dynamically to avoid circular dependencies
        const { exchangeCodeForToken } = await import('./services/spotifyService');
        try {
          await exchangeCodeForToken(code);
          // Clean URL and reload
          window.history.replaceState({}, document.title, window.location.pathname);
          window.location.reload();
        } catch (error) {
          console.error('Error processing Spotify callback:', error);
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    };
    
    handleSpotifyCallback();
  }, [])

  const handleSelectSet = (setId: string) => {
    setSelectedSetId(setId)
  }

  const handleBackToList = () => {
    setSelectedSetId(null)
  }

  // Clear old cache on mount
  useEffect(() => {
    clearOldCache().catch(console.error)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d0a1d] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0d0a1d]">
      <GlobalHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLoginClick={() => setShowAuthModal(true)}
      />
      <OfflineBanner />
      
      <div className="container mx-auto px-4 pt-24 pb-8">
        {/* Show detail view if a set is selected */}
        <Suspense fallback={<div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>}>
          {selectedSetId ? (
            <DetailView setId={selectedSetId} onBack={handleBackToList} />
          ) : (
            <>
              {/* Render different views based on active tab */}
              {activeTab === 'home' && <HomeView onSelectSet={handleSelectSet} />}
              {activeTab === 'explore' && <ExploreView onSelectSet={handleSelectSet} />}
              {activeTab === 'favorites' && <FavoritesView onSelectSet={handleSelectSet} />}
              {activeTab === 'admin' && <AdminView />}
            </>
          )}
        </Suspense>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
      <InstallPrompt />
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <GlobalStyles />
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
