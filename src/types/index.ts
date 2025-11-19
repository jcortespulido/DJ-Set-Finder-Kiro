import { Timestamp } from 'firebase/firestore';

/**
 * Energy levels for tracks
 */
export type EnergyLevel = 'Intro' | 'Groove' | 'Peak' | 'Buildup' | 'Anthem' | 'Cierre';

/**
 * User roles
 */
export type UserRole = 'user' | 'admin';

/**
 * Extraction job status
 */
export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

/**
 * Platform types for extraction
 */
export type Platform = 'youtube' | 'soundcloud';

/**
 * Theme colors for a set
 */
export interface ThemeData {
  primary: string;
  secondary: string;
  border: string;
  headerBG: string;
  camelot: string;
  divider: string;
}

/**
 * Track information within a set
 */
export interface Track {
  title: string;
  artist: string;
  startTime?: string;
  bpm?: number;
  energy?: EnergyLevel;
  genre?: string;
  tone?: string; // Camelot key (e.g., "8A", "10B")
  notes?: string;
}

/**
 * Source information for a set
 */
export interface Source {
  name: string;
  url: string;
}

/**
 * Complete set data
 */
export interface SetData {
  id?: string; // Firestore document ID
  artist: string;
  event: string;
  stage: string;
  date: string;
  location: string;
  source: Source;
  youtubeUrl: string | null;
  description: string;
  bpmRange: string;
  mainGenre: string;
  duration: string;
  unidentifiedTracks: number;
  totalTracks: number;
  theme: ThemeData;
  tracklist: Track[];
  createdBy: string; // User ID
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  favoriteCount: number;
}

/**
 * User data
 */
export interface User {
  id: string; // Firebase Auth UID
  email: string;
  name: string;
  role: UserRole;
  favorites: string[]; // Array of set IDs
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

/**
 * AI Extraction result
 */
export interface ExtractionResult {
  artist: string;
  event: string;
  stage?: string;
  date?: string;
  location?: string;
  genre?: string;
  bpmRange?: string;
  description?: string;
  tracklist: Track[];
  suggestedTheme: ThemeData;
  confidence: string;
  notes?: string;
}

/**
 * Extraction job data
 */
export interface ExtractionJob {
  id?: string; // Firestore document ID
  userId: string;
  sourceUrl: string;
  platform: Platform;
  status: JobStatus;
  result?: ExtractionResult;
  error?: string;
  createdAt: Timestamp | Date;
  completedAt?: Timestamp | Date;
}

/**
 * Auth context value
 */
export interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

/**
 * API Response types
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface SetListResponse extends ApiResponse {
  data?: SetData[];
}

export interface SetDetailResponse extends ApiResponse {
  data?: SetData;
}

export interface UserListResponse extends ApiResponse {
  data?: User[];
}

export interface FavoriteToggleResponse extends ApiResponse {
  data?: {
    isFavorite: boolean;
    message: string;
  };
}

export interface ExtractionJobResponse extends ApiResponse {
  data?: {
    jobId: string;
    status: JobStatus;
    result?: ExtractionResult;
  };
}

/**
 * Form data types
 */
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  name: string;
}

export interface SetFormData extends Omit<SetData, 'id' | 'createdBy' | 'createdAt' | 'updatedAt' | 'favoriteCount'> {
  // Form-specific fields if needed
}

/**
 * Component prop types
 */
export interface SetCardProps {
  setKey: string;
  set: SetData;
  onSelectSet: (setKey: string) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (setKey: string) => void;
}

export interface SetTableProps {
  sets: SetData[];
  onSelectSet: (setKey: string) => void;
}

export interface TracklistDetailProps {
  set: SetData;
}

export interface GlobalHeaderProps {
  mainView: 'home' | 'explore' | 'favorites' | 'admin';
  onSetView: (view: 'home' | 'explore' | 'favorites' | 'admin') => void;
}

export interface SetBrowserProps {
  onSelectSet: (setKey: string) => void;
  viewMode: 'home' | 'explore';
}

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export interface FavoriteButtonProps {
  setId: string;
  isFavorite: boolean;
  onToggle: (setId: string) => Promise<void>;
  disabled?: boolean;
}

/**
 * Hook return types
 */
export interface UseOnlineStatusReturn {
  isOnline: boolean;
}

export interface UseInstallPromptReturn {
  isInstallable: boolean;
  promptInstall: () => void;
}
