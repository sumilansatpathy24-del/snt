import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, Phone, Mail, FileText, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';

const serviceCategories = [
  'All Services',
  'Internal Plant Transportation',
  'Factory-to-Factory Transport',
  'Industrial Land Filling',
  'Bulk Material Supply',
  'Dust & Waste Transportation',
  'Heavy Industrial Fleet'
];

export default function InquiriesTable({ inquiries = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState('All Services');
  const [expandedId, setExpandedId] = useState(null);

  // Filter inquiry list
  const filteredInqs = inquiries.filter((inq) => {
    if (!inq) return false;
    const name = inq.name || '';
    const email = inq.email || '';
    const phone = inq.phone || '';
    const message = inq.message || '';

    const matchesSearch = 
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm) ||
      message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesService = 
      selectedService === 'All Services' || inq.service === selectedService;

    return matchesSearch && matchesService;
  });

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div>
        <h2 className="font-outfit font-black text-xl md:text-2xl text-white">
          Customer Quotation Inquiries
        </h2>
        <p className="text-xs text-slate-400 font-inter mt-1">
          Review freight transport quote requests, routes description, and customer metrics parameters.
        </p>
      </div>

      {/* Control Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute top-1/2 left-3.5 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, phone, route details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0a0f1d] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-orange transition-colors font-inter"
          />
        </div>

        {/* Service Category Selector */}
        <div className="relative">
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full bg-[#0b1528] border border-white/10 focus:border-brand-orange rounded-lg px-4 py-2.5 text-xs text-slate-200 focus:outline-none transition-colors font-outfit"
          >
            {serviceCategories.map((serv) => (
              <option key={serv} value={serv}>
                {serv}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Inquiries List/Table */}
      {filteredInqs.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-xl border border-white/5 p-8 max-w-md mx-auto space-y-3">
          <MessageSquare className="w-10 h-10 text-slate-600 mx-auto" />
          <h4 className="font-outfit font-bold text-white text-base">No Inquiries Found</h4>
          <p className="text-xs text-slate-500 font-inter">
            There are no customer quotes matching the entered search keyword or service category filters.
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
                    <th className="py-4 px-6">Prospect Client</th>
                    <th className="py-4 px-6">Requested Service</th>
                    <th className="py-4 px-6">Contact Info</th>
                    <th className="py-4 px-6">Route Details Preview</th>
                    <th className="py-4 px-6 text-right">Message</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-inter text-xs text-slate-300">
                  {filteredInqs.map((inq) => {
                    const isExpanded = expandedId === inq.id;
                    return (
                      <React.Fragment key={inq.id}>
                        <tr className={`hover:bg-white/5 transition-colors ${isExpanded ? 'bg-white/5' : ''}`}>
                          {/* Client Info Name */}
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full bg-brand-orange/15 text-brand-orange flex items-center justify-center font-outfit font-black border border-brand-orange/20 shadow-glow-orange-sm">
                                {inq.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h4 className="font-outfit font-bold text-white text-sm">{inq.name}</h4>
                                <span className="text-[10px] text-slate-500 flex items-center mt-1">
                                  <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
                                  {new Date(inq.createdAt || inq.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Requested Service tag */}
                          <td className="py-4 px-6">
                            <span className="inline-block bg-brand-navy/60 border border-white/10 text-slate-300 px-2.5 py-0.5 rounded-md font-outfit text-[10px] font-bold uppercase tracking-wide max-w-[200px] truncate">
                              {inq.service}
                            </span>
                          </td>

                          {/* Contact coordinate detail */}
                          <td className="py-4 px-6">
                            <div className="space-y-1 text-slate-400 font-inter text-xs">
                              <span className="flex items-center">
                                <Mail className="w-3.5 h-3.5 text-brand-orange/60 mr-1.5 flex-shrink-0" />
                                {inq.email}
                              </span>
                              <span className="flex items-center">
                                <Phone className="w-3.5 h-3.5 text-brand-orange/60 mr-1.5 flex-shrink-0" />
                                {inq.phone}
                              </span>
                            </div>
                          </td>

                          {/* Message/Route description preview */}
                          <td className="py-4 px-6">
                            <p className="text-slate-400 font-inter leading-relaxed max-w-[220px] truncate">
                              {inq.message}
                            </p>
                          </td>

                          {/* Expand trigger button */}
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => toggleExpand(inq.id)}
                              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors border border-white/10 inline-flex items-center space-x-1"
                              title="Expand Inquiry"
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp className="w-4 h-4" />
                                  <span className="text-[10px] font-outfit uppercase font-bold">Close</span>
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-4 h-4" />
                                  <span className="text-[10px] font-outfit uppercase font-bold">Read</span>
                                </>
                              )}
                            </button>
                          </td>
                        </tr>

                        {/* Expander detail drawer card */}
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
                                      Full Quotation, Cargo Weight & Route Coordinates:
                                    </h5>
                                    <p className="whitespace-pre-wrap">{inq.message}</p>
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
            {filteredInqs.map((inq) => {
              const isExpanded = expandedId === inq.id;
              return (
                <div key={inq.id} className="glass-panel p-5 rounded-xl border border-white/5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-brand-orange/15 text-brand-orange flex items-center justify-center font-outfit font-black border border-brand-orange/20 shadow-glow-orange-sm">
                        {inq.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-outfit font-bold text-white text-sm">{inq.name}</h4>
                        <span className="bg-brand-navy border border-white/10 text-slate-300 px-2 py-0.5 rounded-md font-outfit text-[9px] font-bold uppercase tracking-wide block mt-1 max-w-[150px] truncate text-center">
                          {inq.service}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-inter flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(inq.createdAt || inq.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-1 text-xs text-slate-400 font-inter pt-2 border-t border-white/5">
                    <span className="flex items-center"><Mail className="w-3.5 h-3.5 text-brand-orange/60 mr-1.5" />{inq.email}</span>
                    <span className="flex items-center"><Phone className="w-3.5 h-3.5 text-brand-orange/60 mr-1.5" />{inq.phone}</span>
                  </div>

                  <div className="pt-3 border-t border-white/5">
                    <button
                      onClick={() => toggleExpand(inq.id)}
                      className="w-full flex items-center justify-center space-x-1.5 px-4 py-2 border border-white/10 hover:border-white/20 text-slate-300 rounded-lg text-xs font-outfit font-bold uppercase tracking-wider"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-3.5 h-3.5" />
                          <span>Close inquiry</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3.5 h-3.5" />
                          <span>Read inquiry</span>
                        </>
                      )}
                    </button>
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
                          <p className="whitespace-pre-wrap">{inq.message}</p>
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
