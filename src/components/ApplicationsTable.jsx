import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Download, Calendar, Briefcase, Mail, Phone, MapPin, User, ChevronDown, ChevronUp, FileText } from 'lucide-react';

const positions = [
  'All Positions',
  'Dump Truck Driver (Heavy Vehicle)',
  'Maintenance Mechanic / Workshop Technician',
  'Transport Dispatch Manager',
  'Route Operations Coordinator',
  'Yard Supervisor / Loader Operator',
  'Accounts & Administrative Assistant'
];

export default function ApplicationsTable({ applications = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('All Positions');
  const [expandedId, setExpandedId] = useState(null);

  // Filter application list
  const filteredApps = applications.filter((app) => {
    const matchesSearch = 
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phone.includes(searchTerm) ||
      (app.message && app.message.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesPosition = 
      selectedPosition === 'All Positions' || app.position === selectedPosition;

    return matchesSearch && matchesPosition;
  });

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div>
        <h2 className="font-outfit font-black text-xl md:text-2xl text-white">
          Job Applications Log
        </h2>
        <p className="text-xs text-slate-400 font-inter mt-1">
          Review candidates details, check experience parameters, and download resume documents.
        </p>
      </div>

      {/* Control Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute top-1/2 left-3.5 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0a0f1d] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-orange transition-colors font-inter"
          />
        </div>

        {/* Position Category Selector */}
        <div className="relative">
          <select
            value={selectedPosition}
            onChange={(e) => setSelectedPosition(e.target.value)}
            className="w-full bg-[#0b1528] border border-white/10 focus:border-brand-orange rounded-lg px-4 py-2.5 text-xs text-slate-200 focus:outline-none transition-colors font-outfit"
          >
            {positions.map((pos) => (
              <option key={pos} value={pos}>
                {pos}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Applications List/Table */}
      {filteredApps.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-xl border border-white/5 p-8 max-w-md mx-auto space-y-3">
          <FileText className="w-10 h-10 text-slate-600 mx-auto" />
          <h4 className="font-outfit font-bold text-white text-base">No Applications Found</h4>
          <p className="text-xs text-slate-500 font-inter">
            There are no candidates matching the search keyword or applied position filters.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block glass-panel rounded-xl border border-white/5 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-navy/60 border-b border-white/5 font-outfit text-xs font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-4 px-6">Candidate</th>
                    <th className="py-4 px-6">Position</th>
                    <th className="py-4 px-6">Contact Info</th>
                    <th className="py-4 px-6">Experience</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-inter text-xs text-slate-300">
                  {filteredApps.map((app) => {
                    const isExpanded = expandedId === app.id;
                    return (
                      <React.Fragment key={app.id}>
                        <tr className={`hover:bg-white/5 transition-colors ${isExpanded ? 'bg-white/5' : ''}`}>
                          {/* Candidate info */}
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full bg-brand-orange/15 text-brand-orange flex items-center justify-center font-outfit font-black border border-brand-orange/20 shadow-glow-orange-sm">
                                {app.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h4 className="font-outfit font-bold text-white text-sm">{app.name}</h4>
                                <span className="text-[10px] text-slate-500 flex items-center mt-1">
                                  <Calendar className="w-3 h-3 mr-1 text-slate-600" />
                                  {new Date(app.createdAt || app.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Applied Position */}
                          <td className="py-4 px-6">
                            <span className="inline-block bg-brand-orange/10 border border-brand-orange/20 text-brand-orange px-2.5 py-0.5 rounded-md font-outfit text-[10px] font-bold uppercase tracking-wide max-w-[220px] truncate">
                              {app.position}
                            </span>
                          </td>

                          {/* Contact detail block */}
                          <td className="py-4 px-6">
                            <div className="space-y-1 text-slate-400 font-inter text-xs">
                              <span className="flex items-center">
                                <Mail className="w-3.5 h-3.5 text-brand-orange/60 mr-1.5 flex-shrink-0" />
                                {app.email}
                              </span>
                              <span className="flex items-center">
                                <Phone className="w-3.5 h-3.5 text-brand-orange/60 mr-1.5 flex-shrink-0" />
                                {app.phone}
                              </span>
                              <span className="flex items-center">
                                <MapPin className="w-3.5 h-3.5 text-brand-orange/60 mr-1.5 flex-shrink-0" />
                                {app.location}
                              </span>
                            </div>
                          </td>

                          {/* Experience info */}
                          <td className="py-4 px-6">
                            <p className="text-slate-200 font-medium font-inter leading-relaxed max-w-[150px] truncate">
                              {app.experience}
                            </p>
                          </td>

                          {/* Actions block */}
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => toggleExpand(app.id)}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors border border-white/10 flex items-center space-x-1"
                                title="View details message"
                              >
                                {isExpanded ? (
                                  <>
                                    <ChevronUp className="w-4 h-4" />
                                    <span className="text-[10px] font-outfit uppercase font-bold">Less</span>
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="w-4 h-4" />
                                    <span className="text-[10px] font-outfit uppercase font-bold">More</span>
                                  </>
                                )}
                              </button>

                              <a
                                href={(app.resumeUrl || app.resume_path)?.startsWith('/uploads') ? `https://snt-server.onrender.com${app.resumeUrl || app.resume_path}` : (app.resumeUrl || app.resume_path)}
                                download={app.resumeName || `Resume_${app.name.replace(/\s+/g, '_')}.pdf`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-brand-orange/15 hover:bg-brand-orange text-white border border-brand-orange/20 hover:border-brand-orange transition-all flex items-center justify-center"
                                title="Download CV File"
                              >
                                <Download className="w-4 h-4" />
                              </a>
                            </div>
                          </td>
                        </tr>

                        {/* Expander detail drawer */}
                        <AnimatePresence>
                          {isExpanded && (
                            <tr>
                              <td colSpan="5" className="bg-[#0b101f]/75 p-0">
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="px-6 py-4 space-y-3 overflow-hidden border-l-2 border-brand-orange"
                                >
                                  <div className="p-4 bg-brand-navy/30 border border-white/5 rounded-xl text-slate-300 font-inter text-xs leading-relaxed max-w-4xl shadow-inner">
                                    <h5 className="font-outfit font-black text-[10px] uppercase tracking-wider text-slate-400 mb-1.5">
                                      Candidate Cover Note & Message:
                                    </h5>
                                    <p className="whitespace-pre-wrap">
                                      {app.coverLetter || app.message || 'No additional cover note or message provided by the candidate.'}
                                    </p>
                                  </div>
                                </motion.div>
                              </td>
                            </tr>
                          )}
                        </AnimatePresence>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards View */}
          <div className="grid grid-cols-1 gap-4 lg:hidden">
            {filteredApps.map((app) => {
              const isExpanded = expandedId === app.id;
              return (
                <div key={app.id} className="glass-panel p-5 rounded-xl border border-white/5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-brand-orange/15 text-brand-orange flex items-center justify-center font-outfit font-black border border-brand-orange/20 shadow-glow-orange-sm">
                        {app.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-outfit font-bold text-white text-sm">{app.name}</h4>
                        <span className="bg-brand-orange/10 border border-brand-orange/20 text-brand-orange px-2 py-0.5 rounded-md font-outfit text-[9px] font-bold uppercase tracking-wide block mt-1 max-w-[150px] truncate text-center">
                          {app.position}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-inter flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(app.createdAt || app.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400 font-inter pt-2 border-t border-white/5">
                    <span className="flex items-center"><Mail className="w-3.5 h-3.5 text-brand-orange/60 mr-1.5" />{app.email}</span>
                    <span className="flex items-center"><Phone className="w-3.5 h-3.5 text-brand-orange/60 mr-1.5" />{app.phone}</span>
                    <span className="flex items-center"><MapPin className="w-3.5 h-3.5 text-brand-orange/60 mr-1.5" />{app.location}</span>
                    <span className="flex items-center"><Briefcase className="w-3.5 h-3.5 text-brand-orange/60 mr-1.5" />{app.experience}</span>
                  </div>

                  <div className="flex items-center space-x-2 pt-3 border-t border-white/5">
                    <button
                      onClick={() => toggleExpand(app.id)}
                      className="w-full flex items-center justify-center space-x-1.5 px-4 py-2 border border-white/10 hover:border-white/20 text-slate-300 rounded-lg text-xs font-outfit font-bold uppercase tracking-wider"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-3.5 h-3.5" />
                          <span>Close message</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3.5 h-3.5" />
                          <span>Read message</span>
                        </>
                      )}
                    </button>
                    
                    <a
                      href={(app.resumeUrl || app.resume_path)?.startsWith('/uploads') ? `https://snt-server.onrender.com${app.resumeUrl || app.resume_path}` : (app.resumeUrl || app.resume_path)}
                      download={app.resumeName || `Resume_${app.name.replace(/\s+/g, '_')}.pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 p-2 bg-brand-orange/15 text-white border border-brand-orange/20 rounded-lg"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-3 bg-[#0b101f]/75 border border-white/5 rounded-lg text-slate-300 font-inter text-xs leading-relaxed mt-2 shadow-inner">
                          <p className="whitespace-pre-wrap">
                            {app.coverLetter || app.message || 'No additional cover note or message provided by the candidate.'}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// Global React import guard to prevent vite dependency compiler warnings
import React from 'react';
