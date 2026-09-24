import React, { useEffect, useState, useRef } from 'react';
import { ShoppingBag, Search, Lock, User, LogOut, Receipt } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onMenuClick: () => void;
  onOpenSearch?: () => void;
  onOpenVip?: (triggerEl?: HTMLElement) => void;
}

/**
 * Navbar component with brand logo, quick search trigger, menu shortcut,
 * auth sign in / profile dropdown, VIP gate trigger, and shopping bag button.
 * Uses an IntersectionObserver sentinel to transition navbar style without scroll listeners.
 */
export const Navbar: React.FC<NavbarProps> = ({
  onMenuClick,
  onOpenSearch,
  onOpenVip,
}) => {
  const { totalItems, openCart, badgeBump } = useCart();
  const { user, openAuthModal, logout, openOrdersModal, orders } = useAuth();
  const [isPastHero, setIsPastHero] = useState<boolean>(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user dropdown on outside click or Escape
  useEffect(() => {
    if (!isUserMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isUserMenuOpen]);

  const getUserInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase() || 'EC';
  };

  // IntersectionObserver watching sentinel element below hero (NO scroll listeners)
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    let observer: IntersectionObserver | null = null;

    const timer = setTimeout(() => {
      const sentinel = document.getElementById('hero-sentinel');
      if (!sentinel) return;

      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry) return;
          // When sentinel is above viewport, user has scrolled past hero
          setIsPastHero(!entry.isIntersecting && entry.boundingClientRect.top < 100);
        },
        { threshold: 0 }
      );

      observer.observe(sentinel);
    }, 50);

    return () => {
      clearTimeout(timer);
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keyboard shortcut listener: Cmd+K, Ctrl+K, or '/' for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !isInput)) {
        e.preventDefault();
        onOpenSearch?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenSearch]);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-[var(--dur-base)] ease-[var(--ease-out)] ${
        isPastHero
          ? 'border-b border-[#262626] bg-[#0A0A0A] shadow-lg shadow-black/60'
          : 'border-b border-[#262626]/40 bg-[#0A0A0A]'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Name */}
        <button
          onClick={handleScrollToTop}
          id="brand-logo-button"
          aria-label="EMBER & CRUST Home"
          className="press-scale group flex items-center gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD60A] rounded-xl p-1"
        >
          {/* Black-and-Yellow SVG Mark */}
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#141414] border border-[#262626] text-[#FFD60A] shadow-inner group-hover:border-[#FFD60A] transition-colors duration-[var(--dur-fast)]">
            <svg
              className="h-6 w-6 text-[#FFD60A]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {/* Wood-Fired Oven Arch & Geometric Flame */}
              <path d="M4 21V11a8 8 0 0 1 16 0v10" />
              <path d="M2 21h20" />
              <path
                d="M12 11c0 2-1.5 3-1.5 4.5a1.5 1.5 0 0 0 3 0c0-1.5-1.5-2.5-1.5-4.5z"
                fill="#FFD60A"
              />
            </svg>
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <span className="font-bebas text-2xl sm:text-3xl tracking-wider text-[#F5F5F5] leading-none transition-colors group-hover:text-[#FFD60A]">
                EMBER &amp; CRUST
              </span>
              <span className="hidden rounded bg-[#1F1F1F] border border-[#262626] px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#FFD60A] sm:inline-block leading-none">
                Wood-Fired
              </span>
            </div>
            <p className="mt-1 font-mono text-[11px] leading-none text-[#A3A3A3] tracking-normal">
              Artisanal Pizza &amp; Smash Burgers
            </p>
          </div>
        </button>

        {/* Navigation & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          {/* Quick Search Trigger Bar */}
          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              id="nav-search-button"
              className="press-scale flex h-11 items-center gap-2 rounded-full border border-[#262626] bg-[#141414] px-3 sm:px-4 text-xs font-mono text-[#A3A3A3] hover:border-[#FFD60A] hover:bg-[#1A1A1A] hover:text-[#F5F5F5] transition-all duration-[var(--dur-fast)] w-11 sm:w-48 md:w-56 lg:w-64 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD60A] justify-center sm:justify-start"
              title="Search dishes (⌘K or /)"
              aria-label="Open search palette"
            >
              <Search className="h-4 w-4 shrink-0 text-[#FFD60A]" />
              <span className="hidden sm:inline">Search dishes…</span>
              <kbd className="hidden lg:inline-flex items-center rounded border border-[#262626] bg-[#1F1F1F] px-1.5 py-0.5 text-[10px] font-mono text-[#A3A3A3] ml-auto">
                ⌘K
              </kbd>
            </button>
          )}

          {/* Menu Anchor Button */}
          <button
            onClick={onMenuClick}
            id="nav-menu-button"
            className="press-scale hidden md:flex items-center gap-2 rounded-full border border-[#262626] bg-[#141414] px-4 py-2 font-mono text-xs font-semibold text-[#F5F5F5] hover:border-[#FFD60A] hover:text-[#FFD60A] transition-colors duration-[var(--dur-fast)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD60A]"
          >
            <span>Menu</span>
          </button>

          {/* Auth: Sign In or User Profile Dropdown */}
          {!user ? (
            <button
              onClick={() => openAuthModal('signin')}
              id="nav-signin-button"
              aria-label="Sign In to Member Account"
              className="press-scale flex h-11 items-center gap-1.5 rounded-full border border-[#FFD60A] bg-transparent px-3 sm:px-3.5 font-mono text-xs font-bold text-[#FFD60A] hover:bg-[#FFD60A]/10 transition-colors duration-[var(--dur-fast)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD60A]"
            >
              <User className="h-3.5 w-3.5 shrink-0" />
              <span>Sign In</span>
            </button>
          ) : (
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                id="nav-user-avatar-button"
                aria-expanded={isUserMenuOpen}
                aria-haspopup="menu"
                aria-label={`User account menu for ${user.name}`}
                className="press-scale flex h-11 w-11 items-center justify-center rounded-full bg-[#FFD60A] text-[#0A0A0A] font-mono text-xs font-black shadow-md shadow-[#FFD60A]/20 transition-all hover:bg-[#E5C009] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD60A]"
              >
                {getUserInitials(user.name)}
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div
                  role="menu"
                  className="anim-modal-scale-in absolute right-0 top-full mt-2 w-60 rounded-xl border border-[#262626] bg-[#141414] p-2 shadow-2xl z-50 font-mono text-xs"
                >
                  <div className="border-b border-[#262626] px-3 py-2.5">
                    <p className="font-sora text-sm font-bold text-[#F5F5F5] truncate">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-[#A3A3A3] truncate mt-0.5">
                      {user.email}
                    </p>
                  </div>

                  <div className="py-1">
                    <button
                      role="menuitem"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        openOrdersModal();
                      }}
                      className="w-full flex items-center justify-between rounded-lg px-3 py-2 text-left text-[#F5F5F5] hover:bg-[#222222] hover:text-[#FFD60A] transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Receipt className="h-4 w-4 text-[#A3A3A3]" />
                        <span>My Orders</span>
                      </span>
                      <span className="rounded bg-[#262626] px-1.5 py-0.5 text-[10px] text-[#FFD60A]">
                        {orders.length}
                      </span>
                    </button>
                  </div>

                  <div className="border-t border-[#262626] pt-1">
                    <button
                      role="menuitem"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIP Premier View Button */}
          {onOpenVip && (
            <button
              onClick={(e) => onOpenVip(e.currentTarget)}
              id="nav-vip-button"
              aria-label="Open VIP Premier View"
              className="press-scale flex h-11 items-center justify-center gap-1.5 rounded-full border border-[#FFD60A]/60 bg-transparent px-3 sm:px-3.5 font-mono text-xs font-bold text-[#FFD60A] hover:bg-[#FFD60A]/10 transition-colors duration-[var(--dur-fast)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD60A]"
              title="Open VIP Premier View"
            >
              <Lock className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden sm:inline">VIP</span>
            </button>
          )}

          {/* Shopping Bag Button with Badge & Bumping Animation */}
          <button
            onClick={openCart}
            id="nav-cart-button"
            aria-label={`View your cart, ${totalItems} items`}
            className="press-scale relative flex h-11 w-11 items-center justify-center rounded-full border border-[#262626] bg-[#141414] text-[#F5F5F5] hover:border-[#FFD60A] hover:bg-[#1A1A1A] hover:text-[#FFD60A] transition-all duration-[var(--dur-fast)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD60A]"
          >
            <ShoppingBag className="h-5 w-5" />

            {/* Total Items Badge with Bumping CSS animation */}
            {totalItems > 0 && (
              <span
                key={totalItems}
                id="cart-badge-indicator"
                className={`absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FFD60A] px-1 font-mono text-[11px] font-black text-[#0A0A0A] shadow-md shadow-[#FFD60A]/30 ${
                  badgeBump ? 'animate-cart-bump' : ''
                }`}
              >
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
