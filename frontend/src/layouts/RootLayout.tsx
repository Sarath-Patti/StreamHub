import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export const RootLayout: React.FC = () => (
  <div className="flex min-h-dvh flex-col">
    <Navbar />
    <main id="main-content" className="flex-1">
      <Outlet />
    </main>
    <footer className="border-t border-surface-700/40 py-6">
      <div className="mx-auto max-w-7xl px-4 text-center text-xs text-text-muted">
        © {new Date().getFullYear()} StreamHub. All rights reserved.
      </div>
    </footer>
  </div>
);
