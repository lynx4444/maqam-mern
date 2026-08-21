import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  MapPin,
  FileText,
  HeartHandshake,
  User as UserIcon,
  LogOut,
  LogIn,
  Menu,
  X,
  ChevronDown,
  Globe,
  PlusCircle,
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const { lang, toggleLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-lime-400 border-b border-lime-500/40 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left: Brand & Navigation */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center p-1.5 transition-transform group-hover:scale-105">
                <img
                  src="https://img.icons8.com/ios/50/mosque.png"
                  alt="Mosque"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-lime-950">
                Maqam
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden sm:flex sm:space-x-2 ms-4">
              <Link
                to="/"
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  isActive('/') && location.pathname === '/'
                    ? 'bg-lime-500 text-lime-950 shadow-sm'
                    : 'text-lime-950 hover:bg-lime-300/80'
                }`}
              >
                <MapPin className="w-4 h-4 mr-1.5" />
                {t('maps')}
              </Link>

              {isAdmin && (
                <Link
                  to="/admin/graves"
                  className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    isActive('/admin')
                      ? 'bg-lime-500 text-lime-950 shadow-sm'
                      : 'text-lime-950 hover:bg-lime-300/80'
                  }`}
                >
                  <FileText className="w-4 h-4 mr-1.5" />
                  {t('graves')}
                </Link>
              )}

              <Link
                to="/donation"
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  isActive('/donation')
                    ? 'bg-lime-500 text-lime-950 shadow-sm'
                    : 'text-lime-950 hover:bg-lime-300/80'
                }`}
              >
                <HeartHandshake className="w-4 h-4 mr-1.5" />
                {t('donation')}
              </Link>
            </div>
          </div>

          {/* Right: Controls & Profile */}
          <div className="hidden sm:flex sm:items-center sm:space-x-3">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center px-3 py-1.5 bg-white/90 hover:bg-white text-lime-950 font-bold text-xs rounded-lg shadow-sm transition border border-lime-500/30"
              >
                <Globe className="w-3.5 h-3.5 mr-1.5 text-lime-800" />
                {lang.toUpperCase()}
                <ChevronDown className="w-3 h-3 ml-1 text-lime-700" />
              </button>

              {langDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-36 bg-white border border-gray-100 rounded-xl shadow-xl py-1 z-50 animate-in fade-in zoom-in-95"
                  onMouseLeave={() => setLangDropdownOpen(false)}
                >
                  <button
                    onClick={() => {
                      toggleLanguage();
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-semibold ${
                      lang === 'en'
                        ? 'bg-lime-50 text-lime-800'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    🇬🇧 English (EN)
                  </button>
                  <button
                    onClick={() => {
                      toggleLanguage();
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-semibold ${
                      lang === 'bm'
                        ? 'bg-lime-50 text-lime-800'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    🇲🇾 Bahasa Melayu (BM)
                  </button>
                </div>
              )}
            </div>

            {/* User Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 bg-white px-3.5 py-1.5 rounded-lg shadow-sm border border-lime-500/30 text-lime-950 text-sm font-semibold hover:bg-lime-50 transition"
                >
                  <div className="w-6 h-6 rounded-full bg-lime-200 text-lime-800 font-bold text-xs flex items-center justify-center">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span>{user.name}</span>
                  {isAdmin && (
                    <span className="bg-lime-600 text-white text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-bold">
                      Admin
                    </span>
                  )}
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-1 z-50"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-400 font-medium">Signed in as</p>
                      <p className="text-sm font-bold text-gray-800 truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-lime-50 hover:text-lime-900"
                    >
                      <UserIcon className="w-4 h-4 mr-2" />
                      {t('profile')}
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin/graves/create"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-lime-50 hover:text-lime-900"
                      >
                        <PlusCircle className="w-4 h-4 mr-2 text-emerald-600" />
                        {t('add_new_record')}
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left border-t border-gray-100"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {t('logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="bg-white/90 hover:bg-white text-lime-950 text-xs font-bold px-3.5 py-2 rounded-lg shadow-sm border border-lime-500/30 transition flex items-center"
                >
                  <LogIn className="w-3.5 h-3.5 mr-1" />
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  className="bg-lime-950 hover:bg-lime-900 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-sm transition"
                >
                  {t('register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex sm:hidden items-center space-x-2">
            <button
              onClick={toggleLanguage}
              className="px-2 py-1 bg-white text-lime-950 text-xs font-bold rounded shadow-sm border border-lime-500/30"
            >
              {lang.toUpperCase()}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white/80 text-lime-950 hover:bg-white focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-lime-300/95 border-t border-lime-500/30 px-4 pt-2 pb-4 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center px-3 py-2 rounded-lg text-base font-semibold text-lime-950 hover:bg-lime-400"
          >
            <MapPin className="w-5 h-5 mr-3" />
            {t('maps')}
          </Link>

          {isAdmin && (
            <Link
              to="/admin/graves"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-3 py-2 rounded-lg text-base font-semibold text-lime-950 hover:bg-lime-400"
            >
              <FileText className="w-5 h-5 mr-3" />
              {t('graves')}
            </Link>
          )}

          <Link
            to="/donation"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center px-3 py-2 rounded-lg text-base font-semibold text-lime-950 hover:bg-lime-400"
          >
            <HeartHandshake className="w-5 h-5 mr-3" />
            {t('donation')}
          </Link>

          <div className="pt-3 border-t border-lime-500/40">
            {user ? (
              <div className="space-y-2">
                <div className="px-3 py-1">
                  <p className="text-xs text-lime-900 font-medium">Logged in as</p>
                  <p className="text-sm font-bold text-lime-950">{user.name}</p>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 rounded-lg text-sm font-semibold text-lime-950 hover:bg-lime-400"
                >
                  <UserIcon className="w-4 h-4 mr-3" />
                  {t('profile')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-3 py-2 rounded-lg text-sm font-semibold text-red-800 hover:bg-red-200 text-left"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  {t('logout')}
                </button>
              </div>
            ) : (
              <div className="flex space-x-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center bg-white text-lime-950 font-bold py-2 rounded-lg shadow-sm text-sm"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center bg-lime-950 text-white font-bold py-2 rounded-lg shadow-sm text-sm"
                >
                  {t('register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
