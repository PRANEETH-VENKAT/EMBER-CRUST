import React, { useState, useMemo, lazy, Suspense } from 'react';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { SplitProvider } from './features/split/SplitContext';
import { MENU_ITEMS, MenuItem, Category } from './data/menu';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MarqueeStrip } from './components/MarqueeStrip';
import { CategoryFilter } from './components/CategoryFilter';
import { FoodGrid } from './components/FoodGrid';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './features/checkout/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { OrdersModal } from './components/OrdersModal';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { VipGateModal } from './components/VipGateModal';
import { SessionInactivityHandler } from './components/SessionInactivityHandler';
import { ErrorBoundary } from './components/ErrorBoundary';

const VipPremierView = lazy(() => import('./features/portfolio/VipPremierView'));

/**
 * Main application layout and state coordinator.
 * Manages category selection, search modal, cart drawer, checkout modal,
 * auth modal, orders modal, and strictly locked VIP Premier View.
 */
function MainApp() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [highlightedItemId, setHighlightedItemId] = useState<string | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isVipGateOpen, setIsVipGateOpen] = useState<boolean>(false);
  const [isVipUnlocked, setIsVipUnlocked] = useState<boolean>(false);
  const [isVipViewOpen, setIsVipViewOpen] = useState<boolean>(false);
  const [vipTriggerEl, setVipTriggerEl] = useState<HTMLElement | null>(null);

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: MENU_ITEMS.length,
    };
    MENU_ITEMS.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, []);

  const scrollToMenu = () => {
    const menuElement = document.getElementById('menu');
    if (menuElement) {
      menuElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ==========================================
  // VIP GATE & PORTFOLIO ACCESS CONTROL
  // Sequence: Enter PIN -> Pass Opens -> Hero
  // Closing the portfolio returns to food app and strictly re-locks it.
  // Portfolio DOM is never rendered until unlock check passes.
  // ==========================================
  const handleOpenVip = (triggerEl?: HTMLElement) => {
    setVipTriggerEl(triggerEl || null);
    setIsVipUnlocked(false);
    setIsVipViewOpen(false);
    setIsVipGateOpen(true); // Must enter correct pincode to open portfolio
  };

  const handleUnlockSuccess = () => {
    setIsVipUnlocked(true);
    setIsVipGateOpen(false);
    setIsVipViewOpen(true); // Gated mount permitted
  };

  const handleCloseVipGate = () => {
    setIsVipUnlocked(false);
    setIsVipGateOpen(false);
    setIsVipViewOpen(false);
  };

  const handleCloseVipView = () => {
    // Fail closed: re-lock immediately upon closing
    setIsVipUnlocked(false);
    setIsVipViewOpen(false);
    setIsVipGateOpen(false);
  };

  const handleSelectItemFromSearch = (item: MenuItem) => {
    if (activeCategory !== 'All' && activeCategory !== item.category) {
      setActiveCategory(item.category);
    }
    setSearchQuery('');
    setHighlightedItemId(item.id);

    setTimeout(() => {
      const card = document.getElementById(`food-card-${item.id}`);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        scrollToMenu();
      }
    }, 100);

    setTimeout(() => {
      setHighlightedItemId(null);
    }, 2500);
  };

  const handleApplyQueryToMenu = (query: string) => {
    setSearchQuery(query);
    scrollToMenu();
  };

  const handleOpenCheckout = () => {
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col bg-[#0A0A0A] text-[#F5F5F5] selection:bg-[#FFD60A] selection:text-[#0A0A0A]">
      {/* Sticky Header */}
      <Navbar
        onMenuClick={scrollToMenu}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onOpenVip={handleOpenVip}
      />

      {/* Main Content */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {/* Hero Section */}
        <Hero onExploreClick={scrollToMenu} />

        {/* Marquee Strip (Single infinite loop, paused when offscreen) */}
        <MarqueeStrip />

        {/* Hero sentinel for navbar IntersectionObserver */}
        <div
          id="hero-sentinel"
          className="h-px w-full pointer-events-none"
          aria-hidden="true"
        />

        {/* Menu Navigation & Category Filter */}
        <section className="mx-auto max-w-7xl w-full px-4 pt-10 sm:px-6 lg:px-8 overflow-x-hidden">
          <CategoryFilter
            activeCategory={activeCategory}
            onSelectCategory={(cat) => {
              setActiveCategory(cat);
            }}
            categoryCounts={categoryCounts}
          />

          {/* Food Grid with Global Search & Highlights */}
          <FoodGrid
            items={MENU_ITEMS}
            activeCategory={activeCategory}
            onResetFilter={() => {
              setActiveCategory('All');
              setSearchQuery('');
            }}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectCategory={setActiveCategory}
            highlightedItemId={highlightedItemId}
          />
        </section>
      </main>

      {/* Footer with Easter Egg */}
      <Footer onOpenPortfolio={handleOpenVip} />

      {/* Cart Drawer */}
      <CartDrawer onCheckout={handleOpenCheckout} onBrowseMenu={scrollToMenu} />

      {/* Realistic Multi-Step Checkout Modal */}
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />

      {/* User Authentication Modal */}
      <AuthModal />

      {/* User Order History Modal */}
      <OrdersModal />

      {/* Fast Global Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectItem={handleSelectItemFromSearch}
        initialQuery={searchQuery}
        onApplyQueryToMenu={handleApplyQueryToMenu}
      />

      {/* 20-minute inactivity session tracker with 1-min advance toast */}
      <SessionInactivityHandler />

      {/* VIP PIN Gate Modal */}
      <VipGateModal
        isOpen={isVipGateOpen}
        onClose={handleCloseVipGate}
        onUnlockSuccess={handleUnlockSuccess}
        triggerElement={vipTriggerEl}
      />

      {/* VIP Table Premier View: Strictly gated. DOM is NOT rendered until unlock check passes. */}
      {isVipUnlocked && isVipViewOpen && (
        <ErrorBoundary
          fallbackTitle="VIP PREMIER VIEW TEMPORARILY UNAVAILABLE"
          fallbackMessage="We encountered a momentary issue loading the private VIP section. Please try opening the table again."
        >
          <Suspense fallback={null}>
            <VipPremierView
              isOpen={isVipViewOpen}
              onClose={handleCloseVipView}
              triggerElement={vipTriggerEl}
            />
          </Suspense>
        </ErrorBoundary>
      )}
    </div>
  );
}

/**
 * Root Application component wrapped with ErrorBoundary, AuthProvider, and CartProvider.
 */
export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <SplitProvider>
            <MainApp />
          </SplitProvider>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
