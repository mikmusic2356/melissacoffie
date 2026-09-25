/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ToastContainer } from './components/ToastContainer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { WholesaleQuoteModal } from './components/WholesaleQuoteModal';
import { EventBookingModal } from './components/EventBookingModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

// Views
import { HomeView } from './views/HomeView';
import { ShopView } from './views/ShopView';
import { EventsView } from './views/EventsView';
import { WholesaleView } from './views/WholesaleView';
import { CafeteriaView } from './views/CafeteriaView';
import { UserDashboardView } from './views/UserDashboardView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { AdminLoginView } from './views/AdminLoginView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';
import { PrivacyView } from './views/PrivacyView';

const MainContent: React.FC = () => {
  const { activeView, isAdminAuthenticated } = useApp();

  const renderCurrentView = () => {
    switch (activeView) {
      case 'inicio':
        return <HomeView />;
      case 'tienda':
        return <ShopView />;
      case 'eventos':
        return <EventsView />;
      case 'cotizaciones':
        return <WholesaleView />;
      case 'cafeteria':
        return <CafeteriaView />;
      case 'mis-reservas':
        return <UserDashboardView />;
      case 'admin':
        return isAdminAuthenticated ? <AdminDashboardView /> : <AdminLoginView />;
      case 'nosotros':
        return <AboutView />;
      case 'contacto':
        return <ContactView />;
      case 'privacidad':
        return <PrivacyView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF7] text-[#2D1A0D] selection:bg-[#FFD242] selection:text-[#2D1A0D]">
      {/* Top Main Navigation */}
      <Navbar />

      {/* Main Viewport Content */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Interactive Drawers and Modals */}
      <CartDrawer />
      <ProductDetailModal />
      <WholesaleQuoteModal />
      <EventBookingModal />
      <ToastContainer />
      <FloatingWhatsApp />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
