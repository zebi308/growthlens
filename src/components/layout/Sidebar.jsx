import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Plus, Calendar, Lightbulb, LogOut, Sparkles, Zap, BarChart2, DollarSign, Sun, Moon, Settings } from 'lucide-react';
import { appClient } from '@/api/appClient';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/dashboard/new-analysis', icon: Plus, label: 'New Analysis' },
  { path: '/dashboard/recommendations', icon: Lightbulb, label: 'Recommendations' },
  { path: '/dashboard/content-calendar', icon: Calendar, label: 'Content Calendar' },
  { path: '/dashboard/competitors', icon: BarChart2, label: 'Competitors' },
  { path: '/dashboard/pricing', icon: DollarSign, label: 'Pricing' },
];

function getTheme() {
  if (typeof window === 'undefined') return 'dark';
  return localStorage.getItem('theme') || 'dark';
}

export default function Sidebar() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(getTheme);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    appClient.auth.me().then(setUser).catch(() => {});
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowThemeMenu(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || '?';

  const displayName = user?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border h-screen fixed left-0 top-0 z-40">
      <div className="p-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-sidebar-primary flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-sidebar-primary-foreground" />
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight text-sidebar-foreground">Outpace</h1>
          <p className="text-[11px] text-sidebar-foreground/50 tracking-wide uppercase">AI Brand Intelligence</p>
        </div>
      </div>

      <nav className="flex-1 px-3 mt-4 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/dashboard/');
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-sidebar-accent text-sidebar-primary'
                  : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 mt-auto border-t border-sidebar-border space-y-2">
        <Link
          to="/dashboard/premium"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-amber-400 hover:bg-amber-400/10 transition-all w-full"
        >
          <Zap className="w-4 h-4" />
          Premium Features
        </Link>

        {/* User info + theme + logout row */}
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          <span className="text-sm font-medium text-sidebar-foreground truncate flex-1">{displayName}</span>

          {/* Theme toggle popup */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="p-1.5 rounded-lg text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all"
              title="Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            {showThemeMenu && (
              <div className="absolute bottom-full mb-2 right-0 bg-popover border border-border rounded-xl shadow-xl p-1 min-w-[120px] z-50">
                <button
                  onClick={() => { setTheme('light'); setShowThemeMenu(false); }}
                  className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-medium transition-all ${theme === 'light' ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'}`}
                >
                  <Sun className="w-3.5 h-3.5" /> Light
                </button>
                <button
                  onClick={() => { setTheme('dark'); setShowThemeMenu(false); }}
                  className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-medium transition-all ${theme === 'dark' ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'}`}
                >
                  <Moon className="w-3.5 h-3.5" /> Dark
                </button>
              </div>
            )}
          </div>

          {/* Logout */}
          <button
            onClick={async () => {
              await appClient.auth.logout();
              window.location.href = '/';
            }}
            className="p-1.5 rounded-lg text-sidebar-foreground/40 hover:text-red-400 hover:bg-red-400/10 transition-all"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
