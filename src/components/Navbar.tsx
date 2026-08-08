import React, { useState, useEffect, useRef } from 'react';
import { User, Notification } from '../types';
import { fetchJson } from '../lib/api';
import { UserAvatar } from './UserAvatar';
import { FAQSection } from './FAQSection';
import {
  Award,
  Briefcase,
  Bell,
  LogOut,
  ShieldAlert,
  ChevronDown,
  CheckCircle2,
  Building2,
  FileText,
  BookOpen,
  Search,
  Sparkles,
  CheckCheck,
  X,
  ExternalLink,
  Info,
  Menu,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onSelectPassportId?: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  setCurrentUser,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onSelectPassportId
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showDemoMenu, setShowDemoMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [demoUsers, setDemoUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'application' | 'opportunity'>('all');
  
  // Toast Alert for real-time notification updates
  const [toastNotif, setToastNotif] = useState<Notification | null>(null);
  const prevNotifIdsRef = useRef<Set<string>>(new Set());

  // Fetch demo users
  useEffect(() => {
    fetchJson<{ users: User[] }>('/api/auth/demo-users')
      .then((data) => setDemoUsers(data.users))
      .catch(() => {});
  }, []);

  // Poll notifications every 4 seconds for live updates
  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      prevNotifIdsRef.current = new Set();
      return;
    }

    const loadNotifications = (isInitial = false) => {
      fetchJson<{ notifications: Notification[] }>(`/api/notifications/${currentUser.id}`)
        .then((data) => {
          const newNotifs = data.notifications || [];
          setNotifications(newNotifs);

          // Detect new incoming unread notification
          if (!isInitial) {
            const newlyAdded = newNotifs.find(
              (n) => !n.isRead && !prevNotifIdsRef.current.has(n.id)
            );
            if (newlyAdded) {
              setToastNotif(newlyAdded);
            }
          }

          // Update ref with known IDs
          const currentIds = new Set(newNotifs.map((n) => n.id));
          prevNotifIdsRef.current = currentIds;
        })
        .catch(() => {});
    };

    loadNotifications(true);
    const interval = setInterval(() => loadNotifications(false), 4000);

    return () => clearInterval(interval);
  }, [currentUser]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleSwitchDemoUser = (u: User) => {
    setCurrentUser(u);
    setShowDemoMenu(false);
    if (u.role === 'youth') setActiveTab('youth_dashboard');
    else if (u.role === 'employer') setActiveTab('employer_dashboard');
    else if (u.role === 'admin') setActiveTab('admin_dashboard');
  };

  const handleSearchPassport = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSelectPassportId) {
      onSelectPassportId(searchQuery.trim());
      setActiveTab('verify_passport');
      setSearchQuery('');
    }
  };

  const handleMarkAsRead = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    fetchJson(`/api/notifications/${id}/read`, { method: 'PUT' })
      .then(() => {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
      })
      .catch(() => {});
  };

  const handleMarkAllAsRead = () => {
    if (!currentUser) return;
    fetchJson(`/api/notifications/user/${currentUser.id}/read-all`, { method: 'PUT' })
      .then(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      })
      .catch(() => {});
  };

  const handleNotificationClick = (notif: Notification) => {
    if (!notif.isRead) {
      handleMarkAsRead(notif.id);
    }
    setShowNotifMenu(false);

    // Route user based on notification type and title
    if (notif.type === 'application') {
      if (currentUser?.role === 'employer') {
        setActiveTab('employer_dashboard');
      } else {
        setActiveTab('youth_dashboard');
      }
    } else if (notif.type === 'opportunity') {
      setActiveTab('opportunities');
    } else if (notif.type === 'verification') {
      if (currentUser?.role === 'admin') {
        setActiveTab('admin_dashboard');
      } else {
        setActiveTab('youth_dashboard');
      }
    } else if (notif.type === 'assessment') {
      setActiveTab('assessments');
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filterType === 'unread') return !n.isRead;
    if (filterType === 'application') return n.type === 'application';
    if (filterType === 'opportunity') return n.type === 'opportunity';
    return true;
  });

  const getNotifIcon = (type: Notification['type']) => {
    switch (type) {
      case 'application':
        return <FileText className="w-4 h-4 text-emerald-400" />;
      case 'opportunity':
        return <Briefcase className="w-4 h-4 text-amber-400" />;
      case 'verification':
        return <Award className="w-4 h-4 text-blue-400" />;
      case 'assessment':
        return <BookOpen className="w-4 h-4 text-purple-400" />;
      default:
        return <Info className="w-4 h-4 text-emerald-300" />;
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-emerald-950 text-white shadow-md border-b border-emerald-800 w-full max-w-full">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between h-16 sm:h-18 gap-2 min-w-0">
            
            {/* Brand Logo */}
            <div
              onClick={() => setActiveTab('landing')}
              className="flex items-center gap-2 sm:gap-3 cursor-pointer group py-2 min-w-0 shrink"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-emerald-950 font-bold shadow-md shadow-emerald-900/50 group-hover:scale-105 transition-transform shrink-0">
                <Award className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="font-extrabold text-xs sm:text-base md:text-lg tracking-tight bg-gradient-to-r from-white via-emerald-100 to-amber-300 bg-clip-text text-transparent truncate">
                    Zamfara Skills Passport
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30 px-1.5 sm:px-2 py-0.5 rounded-full shrink-0">
                    Verified
                  </span>
                </div>
                <p className="text-xs text-emerald-300/80 hidden sm:block truncate">
                  Youth Competency & Employment Hub · Zamfara State
                </p>
              </div>
            </div>

            {/* Quick Passport ID Search Input */}
            <form onSubmit={handleSearchPassport} className="hidden lg:flex items-center relative w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Passport ID (e.g., ZSP-GUS...)"
                className="w-full bg-emerald-900/60 border border-emerald-700/60 text-xs text-emerald-100 placeholder-emerald-400/70 rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
              />
              <Search className="w-3.5 h-3.5 text-emerald-400 absolute left-2.5 top-2.5" />
            </form>

            {/* Navigation Items */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
              <button
                onClick={() => setActiveTab('landing')}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'landing' ? 'bg-emerald-800/80 text-amber-300 font-semibold' : 'text-emerald-100 hover:bg-emerald-900/60'
                }`}
              >
                Home
              </button>

              <button
                onClick={() => setActiveTab('opportunities')}
                className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
                  activeTab === 'opportunities' ? 'bg-emerald-800/80 text-amber-300 font-semibold' : 'text-emerald-100 hover:bg-emerald-900/60'
                }`}
              >
                <Briefcase className="w-4 h-4 text-emerald-400" />
                Opportunities
              </button>

              <button
                onClick={() => setActiveTab('assessments')}
                className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
                  activeTab === 'assessments' ? 'bg-emerald-800/80 text-amber-300 font-semibold' : 'text-emerald-100 hover:bg-emerald-900/60'
                }`}
              >
                <BookOpen className="w-4 h-4 text-emerald-400" />
                Assessments
              </button>

              {currentUser && currentUser.role === 'youth' && (
                <button
                  onClick={() => setActiveTab('youth_dashboard')}
                  className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
                    activeTab === 'youth_dashboard' ? 'bg-emerald-800/80 text-amber-300 font-semibold' : 'text-emerald-100 hover:bg-emerald-900/60'
                  }`}
                >
                  <FileText className="w-4 h-4 text-amber-400" />
                  My Skills Passport
                </button>
              )}

              {currentUser && currentUser.role === 'employer' && (
                <button
                  onClick={() => setActiveTab('employer_dashboard')}
                  className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
                    activeTab === 'employer_dashboard' ? 'bg-emerald-800/80 text-amber-300 font-semibold' : 'text-emerald-100 hover:bg-emerald-900/60'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-amber-400" />
                  Employer Portal
                </button>
              )}

              {currentUser && currentUser.role === 'admin' && (
                <button
                  onClick={() => setActiveTab('admin_dashboard')}
                  className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
                    activeTab === 'admin_dashboard' ? 'bg-emerald-800/80 text-amber-300 font-semibold' : 'text-emerald-100 hover:bg-emerald-900/60'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  Admin Dashboard
                </button>
              )}

              <button
                onClick={() => setShowFaqModal(true)}
                className="px-3 py-2 rounded-lg flex items-center gap-1.5 text-emerald-100 hover:bg-emerald-900/60 transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-amber-300" />
                <span>FAQ & Help</span>
              </button>
            </nav>

            {/* User Controls & Switcher */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Mobile Drawer Hamburger Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle navigation menu"
                className="md:hidden p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-emerald-900/80 transition-colors focus:outline-none border border-emerald-800"
              >
                {mobileMenuOpen ? <X className="w-6 h-6 text-amber-300" /> : <Menu className="w-6 h-6 text-emerald-100" />}
              </button>
              
              {/* Quick Demo Switcher Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowDemoMenu(!showDemoMenu)}
                  className="flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-amber-500/30 transition-colors"
                  title="Quick Switch Account Role for Demo"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Demo Switcher</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {showDemoMenu && (
                  <div className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-1.5rem)] bg-emerald-950 border border-emerald-700/80 rounded-xl shadow-2xl p-2 z-50">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 px-3 py-1">
                      Select Test Account Role
                    </p>
                    <div className="space-y-1 mt-1">
                      {demoUsers.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => handleSwitchDemoUser(u)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                            currentUser?.id === u.id ? 'bg-emerald-800 text-amber-300 font-bold' : 'text-emerald-100 hover:bg-emerald-900/80'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <UserAvatar name={u.fullName} avatarUrl={u.avatarUrl} isDemo={true} size="xs" />
                            <div>
                              <p className="font-semibold leading-tight">{u.fullName}</p>
                              <p className="text-[10px] text-emerald-300/80">{u.email}</p>
                            </div>
                          </div>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                            u.role === 'youth' ? 'bg-blue-500/20 text-blue-300' : u.role === 'employer' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {u.role}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Notifications Bell Button */}
              {currentUser && (
                <div className="relative">
                  <button
                    onClick={() => setShowNotifMenu(!showNotifMenu)}
                    className="p-2 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-900/60 relative transition-colors focus:outline-none"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <>
                        <span className="absolute top-1 right-1 w-4 h-4 bg-amber-400 text-emerald-950 text-[10px] font-extrabold rounded-full flex items-center justify-center animate-pulse shadow-md shadow-amber-500/50">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                        <span className="absolute top-1 right-1 w-4 h-4 bg-amber-400 rounded-full animate-ping opacity-40"></span>
                      </>
                    )}
                  </button>

                  {/* Notification Popover Dropdown */}
                  {showNotifMenu && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 max-w-[calc(100vw-1.5rem)] bg-emerald-950 border border-emerald-700/80 rounded-xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      
                      {/* Header */}
                      <div className="flex items-center justify-between pb-2.5 border-b border-emerald-800">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                            <Bell className="w-3.5 h-3.5 text-amber-400" />
                            Notifications
                          </p>
                          {unreadCount > 0 && (
                            <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                              {unreadCount} Unread
                            </span>
                          )}
                        </div>

                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllAsRead}
                            className="text-[11px] text-amber-300 hover:text-amber-200 hover:underline flex items-center gap-1 font-semibold transition-colors"
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                            Mark all read
                          </button>
                        )}
                      </div>

                      {/* Filter Tabs */}
                      <div className="flex items-center gap-1 mt-2.5 mb-2 overflow-x-auto pb-1 text-[11px] no-scrollbar">
                        <button
                          onClick={() => setFilterType('all')}
                          className={`px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
                            filterType === 'all'
                              ? 'bg-amber-400 text-emerald-950 font-bold'
                              : 'bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800'
                          }`}
                        >
                          All ({notifications.length})
                        </button>
                        <button
                          onClick={() => setFilterType('unread')}
                          className={`px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
                            filterType === 'unread'
                              ? 'bg-amber-400 text-emerald-950 font-bold'
                              : 'bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800'
                          }`}
                        >
                          Unread ({unreadCount})
                        </button>
                        <button
                          onClick={() => setFilterType('application')}
                          className={`px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
                            filterType === 'application'
                              ? 'bg-amber-400 text-emerald-950 font-bold'
                              : 'bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800'
                          }`}
                        >
                          Applications
                        </button>
                        <button
                          onClick={() => setFilterType('opportunity')}
                          className={`px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
                            filterType === 'opportunity'
                              ? 'bg-amber-400 text-emerald-950 font-bold'
                              : 'bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800'
                          }`}
                        >
                          Opportunities
                        </button>
                      </div>

                      {/* Notification Item List */}
                      <div className="max-h-72 overflow-y-auto space-y-2 pr-0.5 custom-scrollbar">
                        {filteredNotifications.length === 0 ? (
                          <div className="text-center py-6">
                            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2 opacity-60" />
                            <p className="text-xs text-emerald-300 font-medium">No notifications found</p>
                            <p className="text-[10px] text-emerald-400/70 mt-0.5">
                              {filterType === 'unread'
                                ? "You're all caught up!"
                                : 'Updates about opportunities and applications will appear here.'}
                            </p>
                          </div>
                        ) : (
                          filteredNotifications.map((n) => (
                            <div
                              key={n.id}
                              onClick={() => handleNotificationClick(n)}
                              className={`p-2.5 rounded-xl text-xs border cursor-pointer transition-all hover:translate-x-0.5 relative group ${
                                n.isRead
                                  ? 'bg-emerald-900/20 border-emerald-800/40 text-emerald-300 hover:bg-emerald-900/40'
                                  : 'bg-emerald-900/80 border-amber-500/40 text-amber-50 font-medium shadow-md shadow-emerald-950/60 hover:bg-emerald-900'
                              }`}
                            >
                              <div className="flex items-start gap-2.5">
                                <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                                  n.type === 'opportunity'
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    : n.type === 'application'
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                }`}>
                                  {getNotifIcon(n.type)}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1">
                                    <p className={`font-bold truncate ${n.isRead ? 'text-emerald-100' : 'text-amber-300'}`}>
                                      {n.title}
                                    </p>
                                    {!n.isRead && (
                                      <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-emerald-100/90 mt-1 leading-relaxed line-clamp-2">
                                    {n.message}
                                  </p>
                                  
                                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-emerald-800/40 text-[9px] text-emerald-400/80">
                                    <span>
                                      {new Date(n.createdAt).toLocaleDateString('en-NG', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </span>
                                    <span className="flex items-center gap-1 font-semibold text-amber-300 group-hover:underline">
                                      View details
                                      <ExternalLink className="w-2.5 h-2.5" />
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                    </div>
                  )}
                </div>
              )}

              {/* User Session or Auth Trigger */}
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <UserAvatar name={currentUser.fullName} avatarUrl={currentUser.avatarUrl} isDemo={currentUser.isDemo} size="sm" showDemoBadge={currentUser.isDemo} />
                  <div className="hidden xl:flex flex-col text-right">
                    <span className="text-xs font-bold text-white leading-tight flex items-center gap-1">
                      {currentUser.fullName}
                    </span>
                    <span className="text-[10px] text-amber-300 uppercase font-semibold">{currentUser.role}</span>
                  </div>

                  <button
                    onClick={() => setCurrentUser(null)}
                    className="p-2 text-emerald-300 hover:text-white hover:bg-emerald-900/80 rounded-lg transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenAuth('login')}
                    className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-emerald-900/80 text-emerald-100 hover:bg-emerald-800 hover:text-white border border-emerald-700/60 transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => onOpenAuth('register')}
                    className="text-xs font-bold px-3.5 py-2 rounded-lg bg-amber-400 text-emerald-950 hover:bg-amber-300 shadow-md shadow-amber-500/20 transition-colors"
                  >
                    Register
                  </button>
                </div>
              )}

            </div>

          </div>
        </div>

        {/* Collapsible Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-emerald-950/95 border-b-2 border-amber-400/80 p-4 space-y-4 shadow-2xl animate-in slide-in-from-top-2 duration-200">
            {/* Quick Passport Search for Mobile */}
            <form onSubmit={(e) => { handleSearchPassport(e); setMobileMenuOpen(false); }} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Passport ID (e.g., ZSP-GUS...)"
                className="w-full bg-emerald-900/80 border border-emerald-700/80 text-xs text-emerald-100 placeholder-emerald-400/80 rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-amber-400"
              />
              <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-3" />
            </form>

            {/* Official State Seal Verified Banner in Drawer */}
            <div className="bg-emerald-900/60 border border-amber-400/30 rounded-xl p-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-emerald-100">Zamfara Verified Skills System</span>
              </div>
              <span className="bg-amber-400 text-emerald-950 font-black text-[9px] uppercase px-2 py-0.5 rounded-full">
                Verified Badge
              </span>
            </div>

            {/* Mobile Navigation Links */}
            <div className="grid grid-cols-1 gap-1 pt-1 text-sm font-semibold">
              <button
                onClick={() => { setActiveTab('landing'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center gap-2.5 transition-colors ${
                  activeTab === 'landing' ? 'bg-emerald-800 text-amber-300 font-bold' : 'text-emerald-100 hover:bg-emerald-900/60'
                }`}
              >
                <span>Home</span>
              </button>

              <button
                onClick={() => { setActiveTab('opportunities'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center gap-2.5 transition-colors ${
                  activeTab === 'opportunities' ? 'bg-emerald-800 text-amber-300 font-bold' : 'text-emerald-100 hover:bg-emerald-900/60'
                }`}
              >
                <Briefcase className="w-4 h-4 text-emerald-400" />
                <span>Opportunities</span>
              </button>

              <button
                onClick={() => { setActiveTab('assessments'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center gap-2.5 transition-colors ${
                  activeTab === 'assessments' ? 'bg-emerald-800 text-amber-300 font-bold' : 'text-emerald-100 hover:bg-emerald-900/60'
                }`}
              >
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Assessments</span>
              </button>

              {currentUser && currentUser.role === 'youth' && (
                <button
                  onClick={() => { setActiveTab('youth_dashboard'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center gap-2.5 transition-colors ${
                    activeTab === 'youth_dashboard' ? 'bg-emerald-800 text-amber-300 font-bold' : 'text-emerald-100 hover:bg-emerald-900/60'
                  }`}
                >
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>My Skills Passport</span>
                </button>
              )}

              {currentUser && currentUser.role === 'employer' && (
                <button
                  onClick={() => { setActiveTab('employer_dashboard'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center gap-2.5 transition-colors ${
                    activeTab === 'employer_dashboard' ? 'bg-emerald-800 text-amber-300 font-bold' : 'text-emerald-100 hover:bg-emerald-900/60'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <span>Employer Portal</span>
                </button>
              )}

              {currentUser && currentUser.role === 'admin' && (
                <button
                  onClick={() => { setActiveTab('admin_dashboard'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center gap-2.5 transition-colors ${
                    activeTab === 'admin_dashboard' ? 'bg-emerald-800 text-amber-300 font-bold' : 'text-emerald-100 hover:bg-emerald-900/60'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Admin Dashboard</span>
                </button>
              )}

              <button
                onClick={() => { setShowFaqModal(true); setMobileMenuOpen(false); }}
                className="w-full text-left px-3.5 py-2.5 rounded-xl flex items-center gap-2.5 text-emerald-100 hover:bg-emerald-900/60 transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-amber-300" />
                <span>FAQ & Help Hub</span>
              </button>
            </div>

            {/* Quick Mobile Demo Role Selector */}
            <div className="pt-2 border-t border-emerald-800 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block px-1">
                Quick Demo Role Switch
              </span>
              <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                {demoUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => { handleSwitchDemoUser(u); setMobileMenuOpen(false); }}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      currentUser?.id === u.id
                        ? 'bg-amber-400 text-emerald-950 border-amber-300 font-extrabold'
                        : 'bg-emerald-900/60 text-emerald-100 border-emerald-800 hover:bg-emerald-800'
                    }`}
                  >
                    <span className="block truncate">{u.role.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* User Account Controls inside Mobile Drawer */}
            <div className="pt-2 border-t border-emerald-800">
              {currentUser ? (
                <div className="flex items-center justify-between bg-emerald-900/40 p-3 rounded-xl border border-emerald-800">
                  <div className="flex items-center gap-2.5">
                    <UserAvatar name={currentUser.fullName} avatarUrl={currentUser.avatarUrl} isDemo={currentUser.isDemo} size="sm" showDemoBadge={currentUser.isDemo} />
                    <div>
                      <p className="text-xs font-bold text-white">{currentUser.fullName}</p>
                      <p className="text-[10px] text-amber-300 uppercase font-semibold">{currentUser.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setCurrentUser(null); setMobileMenuOpen(false); }}
                    className="p-2 text-emerald-300 hover:text-white hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-1 text-xs"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { onOpenAuth('login'); setMobileMenuOpen(false); }}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-900 text-emerald-100 text-xs font-bold text-center border border-emerald-700"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { onOpenAuth('register'); setMobileMenuOpen(false); }}
                    className="flex-1 py-2.5 rounded-xl bg-amber-400 text-emerald-950 text-xs font-bold text-center shadow-sm"
                  >
                    Register Free
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Interactive FAQ Section Modal */}
      {showFaqModal && (
        <FAQSection isModal={true} onClose={() => setShowFaqModal(false)} />
      )}

      {/* Real-time Toast Banner for incoming alerts */}
      {toastNotif && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm bg-emerald-950 border border-amber-400/80 text-white rounded-2xl p-4 shadow-2xl shadow-emerald-950/80 animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-500/20 border border-amber-400/40 rounded-xl text-amber-300 shrink-0">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-400/30">
                  New Alert
                </span>
                <button
                  onClick={() => setToastNotif(null)}
                  className="text-emerald-400 hover:text-white p-0.5 rounded-md"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs font-bold text-white mt-1.5 truncate">{toastNotif.title}</p>
              <p className="text-xs text-emerald-200/90 mt-0.5 leading-relaxed line-clamp-2">
                {toastNotif.message}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => {
                    handleNotificationClick(toastNotif);
                    setToastNotif(null);
                  }}
                  className="text-xs font-bold px-3 py-1.5 bg-amber-400 text-emerald-950 rounded-lg hover:bg-amber-300 transition-colors flex items-center gap-1"
                >
                  View Details
                  <ExternalLink className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setToastNotif(null)}
                  className="text-xs text-emerald-300 hover:text-white px-2 py-1.5"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
