import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  HomeIcon,
  LayoutGridIcon,
  HeartIcon,
  SettingsIcon,
  UserIcon,
  LogoutIcon,
} from './icons';

type Tab = 'home' | 'explore' | 'favorites' | 'admin';

interface GlobalHeaderProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onLoginClick: () => void;
}

export function GlobalHeader({
  activeTab,
  onTabChange,
  onLoginClick,
}: GlobalHeaderProps) {
  const { user, isAdmin, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0d0a1d] border-b border-cyan-500/30 backdrop-blur-neon">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-xl sm:text-2xl font-bold neon-accent-cyan">SET FINDER</h1>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1">
            {/* Home Tab */}
            <button
              onClick={() => onTabChange('home')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all min-h-[44px] ${
                activeTab === 'home'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                  : 'text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10'
              }`}
            >
              <HomeIcon className="w-5 h-5" />
              <span className="hidden sm:inline font-semibold">Home</span>
            </button>

            {/* Explore Tab */}
            <button
              onClick={() => onTabChange('explore')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all min-h-[44px] ${
                activeTab === 'explore'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                  : 'text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10'
              }`}
            >
              <LayoutGridIcon className="w-5 h-5" />
              <span className="hidden sm:inline font-semibold">Explorar</span>
            </button>

            {/* Favorites Tab (only if authenticated) */}
            {user && (
              <button
                onClick={() => onTabChange('favorites')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all min-h-[44px] ${
                  activeTab === 'favorites'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                    : 'text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10'
                }`}
              >
                <HeartIcon className="w-5 h-5" />
                <span className="hidden sm:inline font-semibold">
                  Mis Favoritos
                </span>
              </button>
            )}

            {/* Admin Tab (only if admin) */}
            {isAdmin && (
              <button
                onClick={() => onTabChange('admin')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all min-h-[44px] ${
                  activeTab === 'admin'
                    ? 'bg-violet-500/20 text-violet-400 border border-violet-500/50'
                    : 'text-gray-400 hover:text-violet-400 hover:bg-violet-500/10'
                }`}
              >
                <SettingsIcon className="w-5 h-5" />
                <span className="hidden sm:inline font-semibold">Admin</span>
              </button>
            )}
          </nav>

          {/* User Menu / Login Button */}
          <div className="flex-shrink-0">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 hover:border-cyan-500/50 transition-all min-h-[44px]"
                >
                  <UserIcon className="w-5 h-5 text-cyan-400" />
                  <span className="hidden sm:inline text-sm text-gray-300">
                    {user.name}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />

                    {/* Menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-[#1a1a2e] border border-cyan-500/30 rounded-lg shadow-lg z-50">
                      <div className="p-3 border-b border-gray-700">
                        <p className="text-sm text-gray-400">Conectado como</p>
                        <p className="text-sm font-semibold text-white truncate">
                          {user.email}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-left text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogoutIcon className="w-4 h-4" />
                        <span className="text-sm">Cerrar Sesión</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="btn-neon text-sm min-h-[44px]"
              >
                <span className="hidden sm:inline">Iniciar Sesión</span>
                <span className="sm:hidden">Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
