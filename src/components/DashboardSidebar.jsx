import { motion } from 'framer-motion';
import { 
  BarChart3, MessageSquare, FileText, Image as ImageIcon, 
  Settings, LogOut, X, ChevronRight, LayoutDashboard
} from 'lucide-react';

export default function DashboardSidebar({ activeTab, setActiveTab, onLogout, onClose, username = 'Administrator' }) {
  const menuItems = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'content', name: 'Content Editor', icon: LayoutDashboard },
    { id: 'inquiries', name: 'Inquiries', icon: MessageSquare },
    { id: 'applications', name: 'Applications', icon: FileText },
    { id: 'gallery', name: 'Gallery Manager', icon: ImageIcon },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0a0f1d] border-r border-white/5 flex flex-col justify-between h-full py-6 relative">
      {/* Mobile Close Button */}
      {onClose && (
        <button 
          onClick={onClose} 
          className="md:hidden absolute top-4 right-4 p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white border border-white/10"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <div className="space-y-8 px-4">
        {/* Brand Logo Header */}
        <div className="flex items-center space-x-3 border-b border-white/5 pb-6">
          <div className="w-8 h-8 rounded-lg bg-brand-orange flex items-center justify-center font-outfit text-white font-black text-sm shadow-glow-orange-sm">
            SN
          </div>
          <div>
            <h1 className="font-outfit font-black text-sm text-white tracking-wide leading-tight">
              SHREE NATHJI
            </h1>
            <p className="text-[10px] text-brand-orange uppercase font-bold tracking-widest leading-none mt-0.5 font-outfit">
              Transport Console
            </p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="glass-panel p-4 rounded-xl border border-white/5 flex items-center space-x-3 bg-brand-navy/30">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-orange to-brand-orangeLight flex items-center justify-center text-white font-outfit font-black shadow-inner">
            {username.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <h4 className="font-outfit font-bold text-white text-xs truncate">{username}</h4>
            <span className="text-[10px] text-slate-400 font-inter flex items-center mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
              Online Operator
            </span>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-outfit px-3 block mb-2">
            Main Management
          </span>
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (onClose) onClose(); // Auto close drawer on mobile selection
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg font-outfit text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-200 group relative ${
                  isActive
                    ? 'text-white bg-brand-orange/10 border border-brand-orange/20'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <IconComponent className={`w-4 h-4 transition-colors ${isActive ? 'text-brand-orange' : 'text-slate-400 group-hover:text-slate-200'}`} />
                  <span>{item.name}</span>
                </div>
                {isActive ? (
                  <ChevronRight className="w-3.5 h-3.5 text-brand-orange" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
                {isActive && (
                  <motion.div
                    layoutId="sidebarActiveBar"
                    className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-brand-orange rounded-r-md"
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout Action at Bottom */}
      <div className="px-4 border-t border-white/5 pt-6">
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-3.5 py-3 rounded-lg border border-white/10 hover:border-red-500/30 hover:bg-red-500/10 text-slate-400 hover:text-red-400 font-outfit text-xs md:text-sm font-bold uppercase tracking-wider transition-colors duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout Session</span>
        </button>
      </div>
    </aside>
  );
}
