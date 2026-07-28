import React, { useState } from 'react';
import {
  HomeIcon,
  SearchIcon,
  LibraryIcon,
  HeartIcon,
  SettingsIcon,
  SparklesIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  NovaTunesLogo
} from './Icons';

export function Sidebar({ currentView, navigateTo, customPlaylists, onCreatePlaylist, likedCount }) {
  const [collapsed, setCollapsed] = useState(false);

  const mainNavItems = [
    {
      tab: 'home',
      label: 'Home',
      Icon: HomeIcon,
      accentColor: '#3B82F6',
      activeBg: 'bg-[#3B82F6]/15',
      activeBorder: 'border-l-4 border-[#3B82F6]',
      iconColor: 'text-[#3B82F6]',
      hoverBg: 'hover:bg-[#3B82F6]/10'
    },
    {
      tab: 'search',
      label: 'Search',
      Icon: SearchIcon,
      accentColor: '#FFFFFF',
      activeBg: 'bg-white/10',
      activeBorder: 'border-l-4 border-slate-200',
      iconColor: 'text-white',
      hoverBg: 'hover:bg-white/5'
    },
    {
      tab: 'library',
      label: 'Your Library',
      Icon: LibraryIcon,
      accentColor: '#10B981',
      activeBg: 'bg-[#10B981]/15',
      activeBorder: 'border-l-4 border-[#10B981]',
      iconColor: 'text-[#10B981]',
      hoverBg: 'hover:bg-[#10B981]/10'
    },
    {
      tab: 'ai-assistant',
      label: 'AI Assistant',
      Icon: SparklesIcon,
      accentColor: '#8B5CF6',
      activeBg: 'bg-[#8B5CF6]/15',
      activeBorder: 'border-l-4 border-[#8B5CF6]',
      iconColor: 'text-[#8B5CF6]',
      hoverBg: 'hover:bg-[#8B5CF6]/10'
    },
    {
      tab: 'settings',
      label: 'Settings',
      Icon: SettingsIcon,
      accentColor: '#F59E0B',
      activeBg: 'bg-[#F59E0B]/15',
      activeBorder: 'border-l-4 border-[#F59E0B]',
      iconColor: 'text-[#F59E0B]',
      hoverBg: 'hover:bg-[#F59E0B]/10'
    }
  ];

  const seedPlaylists = [
    { id: 'pl-chill', name: 'Late Night Drift' },
    { id: 'pl-energy', name: 'Pulse Boost' },
    { id: 'pl-stress', name: 'Stress Relief Lounge' },
    { id: 'pl-focus', name: 'Focus Flow State' }
  ];

  const isLikedActive = currentView.tab === 'library' && currentView.id === 'liked';

  return (
    <aside
      className={`relative z-20 flex flex-col h-full bg-slate-950/90 border-r border-white/10 backdrop-blur-2xl transition-all duration-300 select-none shrink-0 ${
        collapsed ? 'w-20 p-3' : 'w-64 p-4'
      }`}
    >
      {/* Header & Logo */}
      <div className="flex items-center justify-between mb-6 px-1">
        <div
          onClick={() => navigateTo({ tab: 'home' })}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-[#3B82F6]/20 border border-[#3B82F6]/30 text-[#3B82F6] font-black shadow-md group-hover:scale-105 transition-transform duration-200">
            <NovaTunesLogo className="w-6 h-6" />
          </div>
          {!collapsed && (
            <span className="text-lg font-black tracking-wider text-white">
              NOVATUNES
            </span>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition duration-200"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRightIcon className="w-4 h-4" /> : <ChevronLeftIcon className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex flex-col gap-1.5">
        {mainNavItems.map(({ tab, label, Icon, activeBg, activeBorder, iconColor, hoverBg }) => {
          const isActive = currentView.tab === tab;
          return (
            <button
              key={tab}
              onClick={() => navigateTo({ tab })}
              className={`group flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                isActive
                  ? `${activeBg} ${activeBorder} text-white shadow-sm`
                  : `text-slate-400 ${hoverBg} hover:text-white`
              } ${collapsed ? 'justify-center px-0' : ''}`}
              title={label}
            >
              <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${iconColor}`} />
              {!collapsed && <span className={isActive ? 'text-white font-bold' : 'text-slate-300'}>{label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="my-4 h-[1px] bg-white/5 w-full" />

      {/* Liked Songs Card with Red (#EF4444) Accent */}
      <button
        onClick={() => navigateTo({ tab: 'library', id: 'liked' })}
        className={`group flex items-center gap-3 p-3 rounded-2xl border transition-all duration-200 ${
          isLikedActive
            ? 'bg-[#EF4444]/15 border-l-4 border-[#EF4444] text-white shadow-sm'
            : 'bg-white/[0.04] border-white/5 text-slate-300 hover:bg-[#EF4444]/10'
        } ${collapsed ? 'justify-center p-2.5' : ''}`}
        title="Liked Songs"
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#EF4444]/20 border border-[#EF4444]/40 text-[#EF4444] shadow-sm shrink-0 transition-transform duration-200 group-hover:scale-110">
          <HeartIcon className="w-4 h-4 fill-current" />
        </div>
        {!collapsed && (
          <div className="text-left truncate">
            <p className="text-xs font-bold text-white">Liked Songs</p>
            <p className="text-[10px] text-slate-400">{likedCount || 0} songs</p>
          </div>
        )}
      </button>

      {/* Playlists Section (Neutral Style) */}
      <div className="flex flex-col flex-1 gap-2 mt-4 overflow-hidden">
        {!collapsed && (
          <div className="flex items-center justify-between px-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <span>Playlists</span>
            <button
              onClick={onCreatePlaylist}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition duration-200"
              title="Create Playlist"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-1 no-scrollbar">
          {seedPlaylists.map((p) => {
            const isActive = currentView.tab === 'playlist' && currentView.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => navigateTo({ tab: 'playlist', id: p.id })}
                className={`text-left px-3 py-2 text-xs font-medium rounded-xl truncate transition-all duration-200 ${
                  isActive
                    ? 'bg-white/10 text-white font-bold border-l-4 border-slate-300'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                } ${collapsed ? 'text-center px-1' : ''}`}
                title={p.name}
              >
                {collapsed ? '🎵' : p.name}
              </button>
            );
          })}

          {customPlaylists.map((p) => {
            const isActive = currentView.tab === 'playlist' && currentView.id === p.playlist_id;
            return (
              <button
                key={p.playlist_id}
                onClick={() => navigateTo({ tab: 'playlist', id: p.playlist_id })}
                className={`text-left px-3 py-2 text-xs font-medium rounded-xl truncate transition-all duration-200 ${
                  isActive
                    ? 'bg-white/10 text-white font-bold border-l-4 border-slate-300'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                } ${collapsed ? 'text-center px-1' : ''}`}
                title={p.name}
              >
                {collapsed ? '🎵' : p.name}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
