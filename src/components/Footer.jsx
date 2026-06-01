import { Phone, Mail, MapPin, ArrowUp } from 'lucide-react';

export default function Footer({ websiteData, currentPage, setCurrentPage }) {
  const currentYear = new Date().getFullYear();

  const footerData = websiteData?.footer || {};
  const contactData = websiteData?.contact || {};

  const handleScrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleQuickLink = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: 'smooth',
      });
    }
  };

  return (
    <footer className="relative bg-[#020617] border-t border-white/5 pt-16 pb-12 overflow-hidden">
      
      {/* Background grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-[0.02] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/5">
          
          {/* Column 1: Logo & Story (4 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <a href="#home" onClick={handleScrollToTop} className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-brand-navy border border-brand-orange/20 shadow-glow-orange overflow-hidden">
                <img src="/images/logo.png" alt="Shree Nathji Transport Logo" className="w-7 h-7 object-contain" />
              </div>
              <span className="font-outfit font-black text-xl tracking-wider text-white">
                SHREE NATHJI <span className="text-brand-orange">TRANSPORT</span>
              </span>
            </a>
            
            <p className="text-slate-400 font-inter text-sm leading-relaxed max-w-sm">
              {footerData.aboutDesc || "Shree Nathji Transport is a leading provider of comprehensive industrial transportation and construction material supply services."}
            </p>

            <div className="flex space-x-3.5">
              <a href="#" className="w-9 h-9 rounded-lg bg-brand-lightnavy hover:bg-brand-orange text-slate-300 hover:text-white flex items-center justify-center border border-white/5 transition-colors duration-200 shadow-sm" aria-label="Facebook">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.8z"/>
                </svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-brand-lightnavy hover:bg-brand-orange text-slate-300 hover:text-white flex items-center justify-center border border-white/5 transition-colors duration-200 shadow-sm" aria-label="Twitter">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-brand-lightnavy hover:bg-brand-orange text-slate-300 hover:text-white flex items-center justify-center border border-white/5 transition-colors duration-200 shadow-sm" aria-label="LinkedIn">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links (3 cols) */}
          <div className="lg:col-span-3 space-y-5">
            <h4 className="font-outfit font-bold text-sm text-white uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2.5">
              {[
                { name: 'Home', href: '#home' },
                { name: 'About Company', href: '#about' },
                { name: 'Our Services', href: '#services' },
                { name: 'Fleet Showcase', href: '#fleet' },
                { name: 'Why Choose Us', href: '#why-choose-us' },
                { name: 'Contact Quote', href: '#contact' },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => handleQuickLink(e, link.href)}
                    className="text-slate-400 hover:text-brand-orange text-sm font-medium font-inter transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <h4 className="font-outfit font-bold text-sm text-white uppercase tracking-wider">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3.5">
                <Phone className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-400 text-xs font-semibold uppercase font-outfit tracking-wider">Phone Helpline</span>
                  {contactData.phone1 && (
                    <a href={`tel:${contactData.phone1.replace(/\s+/g, '')}`} className="text-white hover:text-brand-orange font-bold font-outfit text-sm transition-colors block">
                      {contactData.phone1}
                    </a>
                  )}
                  {contactData.phone2 && (
                    <a href={`tel:${contactData.phone2.replace(/\s+/g, '')}`} className="text-white hover:text-brand-orange font-bold font-outfit text-sm transition-colors block mt-0.5">
                      {contactData.phone2}
                    </a>
                  )}
                  {contactData.phone3 && (
                    <a href={`tel:${contactData.phone3.replace(/\s+/g, '')}`} className="text-white hover:text-brand-orange font-bold font-outfit text-sm transition-colors block mt-0.5">
                      {contactData.phone3}
                    </a>
                  )}
                </div>
              </li>
              <li className="flex items-start space-x-3.5">
                <Mail className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-400 text-xs font-semibold uppercase font-outfit tracking-wider">Corporate Email</span>
                  <a href={`mailto:${contactData.email || 'nathjitransportkgp@gmail.com'}`} className="text-white hover:text-brand-orange font-bold font-outfit text-sm transition-colors">
                    {contactData.email || 'nathjitransportkgp@gmail.com'}
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3.5">
                <MapPin className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-400 text-xs font-semibold uppercase font-outfit tracking-wider">Headquarters</span>
                  <span className="text-white font-bold font-outfit text-[13px] block leading-relaxed whitespace-pre-line">
                    {contactData.registeredOfficeAddress || "Sita Prabhu Bhawan, In Front of UCO Bank,\nMalancha Road, Kharagpur - 721301, West Bengal"}
                  </span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Row */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 font-inter text-center md:text-left">
            {footerData.copyrightText || `© ${currentYear} Shree Nathji Transport. All Rights Reserved. Built for premium industrial transportation.`}
          </p>
          <p className="text-xs text-slate-600 font-inter flex space-x-4">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
