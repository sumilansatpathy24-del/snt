import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, MessageSquare, FileText, Image as ImageIcon, 
  Settings, LogOut, Loader2, Menu, Clock, Database, ChevronRight,
  TrendingUp, Users, ArrowUpRight, HelpCircle, LayoutDashboard
} from 'lucide-react';

// Import modular sub-components
import AdminLogin from './AdminLogin';
import DashboardSidebar from './DashboardSidebar';
import InquiriesTable from './InquiriesTable';
import ApplicationsTable from './ApplicationsTable';
import GalleryManager from './GalleryManager';
import ContentEditor from './ContentEditor';

export default function AdminDashboard({ setCurrentPage = () => {}, websiteData, updateWebsiteData }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'inquiries', 'applications', 'gallery', 'settings'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Database lists
  const [galleryItems, setGalleryItems] = useState([]);
  const [applications, setApplications] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  
  // Dynamic metrics clocks
  const [liveTime, setLiveTime] = useState(new Date().toLocaleTimeString());

  // Check auth session on startup
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsLoggedIn(true);
      fetchDashboardData();
    }
  }, [isLoggedIn, activeTab]);

  // Clock ticker effect
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setActiveTab('overview');
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
    setGalleryItems([]);
    setApplications([]);
    setInquiries([]);
    setActiveTab('overview');
  };

  const fetchDashboardData = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    setLoadingData(true);
    try {
      const headers = { 'Authorization': `Bearer ${token}` };

      // Load gallery (non-protected API)
      const resG = await fetch('https://snt-server.onrender.com/api/gallery');
      let dataG = [];
      try {
        dataG = await resG.json();
      } catch (e) {}
      console.log('response.status:', resG.status);
      console.log('response.data:', dataG);
      if (resG.ok) {
        setGalleryItems(dataG || []);
      }

      if (activeTab === 'overview' || activeTab === 'applications') {
        const resA = await fetch('https://snt-server.onrender.com/api/careers');
        let dataA = [];
        try {
          dataA = await resA.json();
        } catch (e) {}
        console.log('response.status:', resA.status);
        console.log('response.data:', dataA);
        if (resA.ok) {
          setApplications(dataA || []);
        }
      }

      if (activeTab === 'overview' || activeTab === 'inquiries') {
        const resI = await fetch('https://snt-server.onrender.com/api/admin/inquiries', { headers });
        let dataI = {};
        try {
          dataI = await resI.json();
        } catch (e) {}
        console.log('response.status:', resI.status);
        console.log('response.data:', dataI);
        if (resI.ok) {
          setInquiries(dataI.inquiries || []);
        }
      }
    } catch (err) {
      console.error('[SQLite Admin Dashboard Query Error]:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleDeleteSuccess = (id) => {
    setGalleryItems((prev) => prev.filter((item) => item.id !== parseInt(id)));
  };

  if (!isLoggedIn) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex overflow-hidden pt-20">
      <div className="absolute inset-0 grid-overlay opacity-[0.015] pointer-events-none z-0" />

      {/* Desktop Sidebar (Permanent) */}
      <div className="hidden md:block h-[calc(100vh-80px)] flex-shrink-0">
        <DashboardSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onLogout={handleLogout} 
        />
      </div>

      {/* Mobile Drawer Sidebar (Sliding Menu) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop lock */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/75 md:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed inset-y-0 left-0 z-50 w-64 md:hidden pt-20"
            >
              <DashboardSidebar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                onLogout={handleLogout} 
                onClose={() => setMobileMenuOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Panel Area */}
      <main className="flex-grow h-[calc(100vh-80px)] overflow-y-auto px-4 md:px-8 py-6 relative z-10">
        
        {/* Mobile Control Topbar */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6 md:hidden">
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="flex items-center space-x-2 p-2 rounded-lg bg-brand-navy/60 text-slate-300 hover:text-white border border-white/10"
          >
            <Menu className="w-5 h-5" />
            <span className="font-outfit text-xs font-bold uppercase tracking-wider">Console Menu</span>
          </button>

          <span className="text-[10px] text-slate-400 font-inter flex items-center">
            <Clock className="w-3.5 h-3.5 text-brand-orange mr-1.5" />
            {liveTime}
          </span>
        </div>

        {/* Desktop Greeting Header */}
        <div className="hidden md:flex items-center justify-between border-b border-white/5 pb-5 mb-6">
          <div>
            <h1 className="font-outfit font-black text-2xl text-white tracking-tight">
              Management Workspace
            </h1>
            <p className="text-xs text-slate-400 font-inter mt-1 flex items-center">
              <Database className="w-3.5 h-3.5 mr-1.5 text-brand-orange" />
              Connected securely to local database engine: sqlite3
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setCurrentPage('main')}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-brand-orange/15 hover:bg-brand-orange text-white border border-brand-orange/20 rounded-lg text-xs font-outfit font-bold uppercase tracking-wider transition-all"
            >
              <span>View Main Website</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            <span className="text-xs text-slate-400 font-inter border-l border-white/10 pl-4 py-1 flex items-center">
              <Clock className="w-4 h-4 text-brand-orange mr-1.5 flex-shrink-0" />
              {liveTime}
            </span>
          </div>
        </div>

        {/* Dashboard Loading Overlay */}
        {loadingData && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-10 h-10 text-brand-orange animate-spin" />
            <p className="text-slate-400 font-inter text-sm">Refreshing workspace records...</p>
          </div>
        )}

        {/* Tab Panel Mounting */}
        {!loadingData && (
          <div className="space-y-8 pb-12">
            
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-fadeIn">
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* stat 1 */}
                  <div className="glass-panel p-5 rounded-2xl border border-white/5 flex items-start space-x-4 bg-brand-navy/20 relative overflow-hidden group">
                    <div className="p-3 rounded-lg bg-brand-orange/15 text-brand-orange border border-brand-orange/20 shadow-glow-orange-sm flex-shrink-0">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-outfit">Total Inquiries</span>
                      <h3 className="font-outfit font-black text-2xl text-white mt-1">{inquiries.length}</h3>
                      <span className="text-[10px] text-emerald-500 font-inter block mt-1 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Inquiries active
                      </span>
                    </div>
                  </div>

                  {/* stat 2 */}
                  <div className="glass-panel p-5 rounded-2xl border border-white/5 flex items-start space-x-4 bg-brand-navy/20 relative overflow-hidden group">
                    <div className="p-3 rounded-lg bg-brand-orange/15 text-brand-orange border border-brand-orange/20 shadow-glow-orange-sm flex-shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-outfit">Job Seekers</span>
                      <h3 className="font-outfit font-black text-2xl text-white mt-1">{applications.length}</h3>
                      <span className="text-[10px] text-emerald-500 font-inter block mt-1 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Applicants logged
                      </span>
                    </div>
                  </div>

                  {/* stat 3 */}
                  <div className="glass-panel p-5 rounded-2xl border border-white/5 flex items-start space-x-4 bg-brand-navy/20 relative overflow-hidden group">
                    <div className="p-3 rounded-lg bg-brand-orange/15 text-brand-orange border border-brand-orange/20 shadow-glow-orange-sm flex-shrink-0">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-outfit">Gallery Photos</span>
                      <h3 className="font-outfit font-black text-2xl text-white mt-1">{galleryItems.length}</h3>
                      <span className="text-[10px] text-slate-400 font-inter block mt-1">
                        Active assets in feed
                      </span>
                    </div>
                  </div>

                  {/* stat 4 */}
                  <div className="glass-panel p-5 rounded-2xl border border-white/5 flex items-start space-x-4 bg-brand-navy/20 relative overflow-hidden group">
                    <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-glow-emerald flex-shrink-0">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-outfit">System Engine</span>
                      <h3 className="font-outfit font-bold text-base text-white mt-1.5 truncate">SQLite Engine</h3>
                      <span className="text-[10px] text-slate-400 font-inter block mt-1">
                        DB backups secure
                      </span>
                    </div>
                  </div>
                </div>

                {/* Split Split Panels Detail */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column: Recent Streams Activity (7 cols) */}
                  <div className="lg:col-span-8 glass-panel p-6 rounded-2xl border border-white/5 space-y-5">
                    <h3 className="font-outfit font-bold text-lg text-white border-b border-white/5 pb-3">
                      Recent Activity Stream
                    </h3>

                    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1 select-none scrollbar-none">
                      {/* Inquiry Activity */}
                      {inquiries.slice(0, 2).map((inq) => (
                        <div key={inq.id} className="p-4 bg-brand-navy/20 border border-white/5 rounded-xl flex items-start space-x-3.5">
                          <div className="p-2 rounded-lg bg-brand-orange/15 text-brand-orange flex-shrink-0">
                            <MessageSquare className="w-4 h-4" />
                          </div>
                          <div className="overflow-hidden space-y-1">
                            <div className="flex flex-wrap items-center gap-x-2">
                              <h4 className="font-outfit font-bold text-white text-xs">{inq.name}</h4>
                              <span className="text-[9px] font-outfit text-slate-400 font-bold uppercase tracking-wider bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                                Inquiry: {inq.service}
                              </span>
                            </div>
                            <p className="text-slate-400 text-xs font-inter line-clamp-2 leading-relaxed">
                              {inq.message}
                            </p>
                            <span className="text-[9px] text-slate-500 block font-inter">
                              {new Date(inq.created_at).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}

                      {/* Application Activity */}
                      {applications.slice(0, 2).map((app) => (
                        <div key={app.id} className="p-4 bg-brand-navy/20 border border-white/5 rounded-xl flex items-start space-x-3.5">
                          <div className="p-2 rounded-lg bg-brand-orange/15 text-brand-orange flex-shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="overflow-hidden space-y-1">
                            <div className="flex flex-wrap items-center gap-x-2">
                              <h4 className="font-outfit font-bold text-white text-xs">{app.name}</h4>
                              <span className="text-[9px] font-outfit text-brand-orange font-bold uppercase tracking-wider bg-brand-orange/10 px-1.5 py-0.5 rounded border border-brand-orange/15">
                                Job: {app.position}
                              </span>
                            </div>
                            <p className="text-slate-400 text-xs font-inter leading-relaxed">
                              Candidate with experience <strong>{app.experience}</strong> applied securely from {app.location}.
                            </p>
                            <span className="text-[9px] text-slate-500 block font-inter">
                              {new Date(app.created_at).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}

                      {inquiries.length === 0 && applications.length === 0 && (
                        <div className="text-center py-12 text-slate-500 font-inter text-xs">
                          No database activities recorded.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Quick Shortcuts Grid (4 cols) */}
                  <div className="lg:col-span-4 glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="font-outfit font-bold text-base text-white border-b border-white/5 pb-3">
                      Administrative Actions
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-2.5">
                      <button 
                        onClick={() => setActiveTab('content')}
                        className="w-full flex items-center justify-between p-3 bg-brand-navy/30 border border-white/5 hover:border-brand-orange/20 rounded-xl font-outfit text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-colors group"
                      >
                        <span className="flex items-center"><LayoutDashboard className="w-4 h-4 text-brand-orange mr-2" />Modify brochure copy</span>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                      </button>

                      <button 
                        onClick={() => setActiveTab('gallery')}
                        className="w-full flex items-center justify-between p-3 bg-brand-navy/30 border border-white/5 hover:border-brand-orange/20 rounded-xl font-outfit text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-colors group"
                      >
                        <span className="flex items-center"><ImageIcon className="w-4 h-4 text-brand-orange mr-2" />Upload operational media</span>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                      </button>

                      <button 
                        onClick={() => setActiveTab('inquiries')}
                        className="w-full flex items-center justify-between p-3 bg-brand-navy/30 border border-white/5 hover:border-brand-orange/20 rounded-xl font-outfit text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-colors group"
                      >
                        <span className="flex items-center"><MessageSquare className="w-4 h-4 text-brand-orange mr-2" />Verify inquiries quotes</span>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                      </button>

                      <button 
                        onClick={() => setActiveTab('applications')}
                        className="w-full flex items-center justify-between p-3 bg-brand-navy/30 border border-white/5 hover:border-brand-orange/20 rounded-xl font-outfit text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-colors group"
                      >
                        <span className="flex items-center"><FileText className="w-4 h-4 text-brand-orange mr-2" />Inspect candidate logs</span>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* 1.5. CONTENT EDITOR TAB */}
            {activeTab === 'content' && (
              <ContentEditor 
                websiteData={websiteData} 
                updateWebsiteData={updateWebsiteData} 
              />
            )}

            {/* 2. INQUIRIES TAB */}
            {activeTab === 'inquiries' && (
              <InquiriesTable inquiries={inquiries} />
            )}

            {/* 3. APPLICATIONS TAB */}
            {activeTab === 'applications' && (
              <ApplicationsTable applications={applications} />
            )}

            {/* 4. GALLERY TAB */}
            {activeTab === 'gallery' && (
              <GalleryManager 
                galleryItems={galleryItems} 
                onUploadSuccess={fetchDashboardData} 
                onDeleteSuccess={handleDeleteSuccess} 
              />
            )}

            {/* 5. SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div className="max-w-2xl glass-panel p-6 md:p-8 rounded-2xl border border-white/5 space-y-6">
                <div>
                  <h3 className="font-outfit font-black text-xl text-white">Console Administration Settings</h3>
                  <p className="text-xs text-slate-400 font-inter mt-1">
                    Manage login credential mappings, audit database diagnostic logs, and set backup triggers.
                  </p>
                </div>

                {/* Configuration detail block */}
                <div className="space-y-4 divide-y divide-white/5">
                  <div className="py-4 flex justify-between items-center text-xs">
                    <div>
                      <h4 className="font-outfit font-bold text-slate-300">Console Security Rules</h4>
                      <p className="text-[10px] text-slate-500 font-inter mt-0.5">Authorization uses Bearer Session Tokens valid till logout.</p>
                    </div>
                    <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded text-[10px] font-outfit uppercase">Active</span>
                  </div>

                  <div className="py-4 flex justify-between items-center text-xs">
                    <div>
                      <h4 className="font-outfit font-bold text-slate-300">Database Diagnostic Engine</h4>
                      <p className="text-[10px] text-slate-500 font-inter mt-0.5">Database storage schema file is: server/database.sqlite</p>
                    </div>
                    <span className="bg-brand-navy border border-white/5 text-slate-400 px-2 py-0.5 rounded text-[10px] font-outfit font-black uppercase">SQLite 3</span>
                  </div>

                  <div className="py-4">
                    <h4 className="font-outfit font-bold text-slate-300 text-xs">Environment Credentials Mapping</h4>
                    <p className="text-[10px] text-slate-500 font-inter mt-0.5">To modify admin username or login passwords, configure parameters directly in environment settings (.env file):</p>
                    <div className="mt-3 bg-[#0a0f1d] border border-white/10 rounded-xl p-4 font-mono text-[10px] text-brand-orange select-text leading-relaxed">
                      ADMIN_USER=admin<br/>
                      ADMIN_PASS=nathji2026<br/>
                      SMTP_HOST=your-smtp-host.com
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </main>
    </div>
  );
}
