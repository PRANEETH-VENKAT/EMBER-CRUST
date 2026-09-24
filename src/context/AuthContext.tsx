import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, OrderRecord, SavedAddress } from '../types/auth';
import {
  AUTH_STORAGE_KEY,
  ORDERS_STORAGE_KEY,
  SAVED_ADDRESS_STORAGE_KEY,
} from '../utils/constants';

interface AuthContextType {
  user: User | null;
  orders: OrderRecord[];
  isAuthModalOpen: boolean;
  authModalTab: 'signin' | 'signup';
  isOrdersModalOpen: boolean;
  savedAddress: SavedAddress | null;
  /**
   * Mock login function — synchronous local authentication simulation.
   * Ready to be replaced with real API auth (e.g. POST /api/auth/login) later.
   */
  login: (email: string, password?: string) => { success: boolean; error?: string };
  /**
   * Mock sign up function — synchronous local user creation simulation.
   * Ready to be replaced with real API registration (e.g. POST /api/auth/register) later.
   */
  signUp: (
    name: string,
    email: string,
    password?: string
  ) => { success: boolean; error?: string };
  /**
   * Clears active user session from React state and localStorage.
   * Saved order history and address remain persistent.
   */
  logout: () => void;
  /**
   * Appends newly placed order to order history and persists to localStorage.
   */
  addOrder: (order: OrderRecord) => void;
  saveDeliveryAddress: (address: SavedAddress) => void;
  openAuthModal: (initialTab?: 'signin' | 'signup') => void;
  closeAuthModal: () => void;
  openOrdersModal: () => void;
  closeOrdersModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Restore user session from localStorage on initial load
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? (JSON.parse(stored) as User) : null;
    } catch {
      return null;
    }
  });

  // Restore order history from localStorage on initial load
  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
      return stored ? (JSON.parse(stored) as OrderRecord[]) : [];
    } catch {
      return [];
    }
  });

  // Restore saved delivery address
  const [savedAddress, setSavedAddress] = useState<SavedAddress | null>(() => {
    try {
      const stored = localStorage.getItem(SAVED_ADDRESS_STORAGE_KEY);
      return stored ? (JSON.parse(stored) as SavedAddress) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'signup'>('signin');
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState<boolean>(false);

  // Sync user changes to localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Unable to persist session to localStorage', e);
    }
  }, [user]);

  // Sync orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.warn('Unable to persist orders to localStorage', e);
    }
  }, [orders]);

  const login = (email: string) => {
    // Generate a clean mock user profile based on email or existing session
    const username = email.split('@')[0] || 'Member';
    const formattedName = username
      .split(/[._-]/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');

    const mockUser: User = {
      id: `usr_${Date.now().toString(36)}`,
      name: formattedName || 'Ember Member',
      email: email.trim().toLowerCase(),
      createdAt: new Date().toISOString(),
    };

    setUser(mockUser);
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const signUp = (name: string, email: string) => {
    const mockUser: User = {
      id: `usr_${Date.now().toString(36)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      createdAt: new Date().toISOString(),
    };

    setUser(mockUser);
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  const addOrder = (order: OrderRecord) => {
    setOrders((prev) => [order, ...prev]);
  };

  const saveDeliveryAddress = (address: SavedAddress) => {
    setSavedAddress(address);
    try {
      localStorage.setItem(SAVED_ADDRESS_STORAGE_KEY, JSON.stringify(address));
    } catch (e) {
      console.warn('Unable to save address to localStorage', e);
    }
  };

  const openAuthModal = (initialTab: 'signin' | 'signup' = 'signin') => {
    setAuthModalTab(initialTab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const openOrdersModal = () => {
    setIsOrdersModalOpen(true);
  };

  const closeOrdersModal = () => {
    setIsOrdersModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        orders,
        isAuthModalOpen,
        authModalTab,
        isOrdersModalOpen,
        savedAddress,
        login,
        signUp,
        logout,
        addOrder,
        saveDeliveryAddress,
        openAuthModal,
        closeAuthModal,
        openOrdersModal,
        closeOrdersModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
