import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, ShieldCheck } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Fleet', href: '#fleet' },
  { name: 'Gallery', href: 'gallery' },
  { name: 'Career', href: 'career' },
  { name: 'Why Choose Us', href: '#why-choose-us' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar({ currentPage = 'main', setCurrentPage = () => {}, websiteData }) {
  const contactData = websiteData?.contact || {};
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Track active section on scroll
      const sections = navLinks.filter(l => l.href.startsWith('#')).map(link => link.href.slice(1));
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

  const handleClick = (e, link) => {
    e.preventDefault();
    setIsOpen(false);
    
    if (link.href.startsWith('#')) {
      const targetSection = link.href.slice(1);
      if (currentPage !== 'main') {
        setCurrentPage('main');
        sessionStorage.setItem('scrollTarget', targetSection);
      } else {
        const target = document.getElementById(targetSection);
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 80,
            behavior: 'smooth',
          });
        }
      }
    } else {
      setCurrentPage(link.href);
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          isScrolled
            ? 'glass-panel bg-brand-dark/95 border-b border-white/5 py-4 shadow-xl'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a
              href="#home"
              onClick={(e) => handleClick(e, { href: '#home' })}
              className="flex items-center space-x-2 group focus:outline-none"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand-navy border border-brand-orange/20 shadow-glow-orange transition-transform duration-300 group-hover:scale-105 overflow-hidden">
                <img src="/images/logo.png" alt="Shree Nathji Transport Logo" className="w-8 h-8 object-contain" />
              </div>
              <span className="font-outfit font-black text-xl md:text-2xl tracking-wider text-white group-hover:text-brand-orange transition-colors duration-300">
                SHREE NATHJI <span className="text-brand-orange">TRANSPORT</span>
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <div className="flex items-center space-x-6">
                {navLinks.map((link) => {
                  const isAnchor = link.href.startsWith('#');
                  const isActive = isAnchor 
                    ? (currentPage === 'main' && activeSection === link.href.slice(1))
                    : (currentPage === link.href);
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={(e) => handleClick(e, link)}
                      className={`relative font-inter text-sm font-semibold tracking-wide transition-colors duration-300 py-2 ${
                        isActive ? 'text-brand-orange text-glow' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {link.name}
                      {isActive && (
                        <motion.div
                          layoutId="activeUnderline"
                          className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-brand-orange to-brand-orangeLight rounded-full shadow-[0_0_8px_rgba(249,93,2,0.6)]"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </a>
                  );
                })}
              </div>
 
              {/* Get Quote CTA */}
              <a
                href="#contact"
                onClick={(e) => handleClick(e, { href: '#contact' })}
                className="relative inline-flex items-center justify-center px-5 py-2.5 rounded-lg overflow-hidden group font-outfit text-sm font-bold tracking-wider uppercase text-white bg-gradient-to-r from-brand-orange to-brand-orangeLight hover:shadow-glow-orange-lg transition-all duration-300 border border-brand-orange/20"
              >
                Get Quote
              </a>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-slate-300 hover:text-white focus:outline-none p-2 rounded-lg bg-brand-lightnavy/50 border border-white/5"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-[72px] z-30 lg:hidden px-4 pt-2 pb-6 glass-panel bg-brand-dark/95 border-b border-white/5 shadow-2xl"
          >
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => {
                const isAnchor = link.href.startsWith('#');
                const isActive = isAnchor 
                  ? (currentPage === 'main' && activeSection === link.href.slice(1))
                  : (currentPage === link.href);
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleClick(e, link)}
                    className={`px-4 py-3 rounded-lg font-outfit font-semibold text-base transition-all duration-250 ${
                      isActive
                        ? 'bg-brand-orange/10 text-brand-orange border-l-4 border-brand-orange font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.name}
                  </a>
                );
              })}
              
              <div className="pt-4 px-4 flex flex-col space-y-4">
                <a
                  href="#contact"
                  onClick={(e) => handleClick(e, { href: '#contact' })}
                  className="w-full text-center py-3 rounded-lg font-outfit font-bold tracking-wider uppercase text-white bg-gradient-to-r from-brand-orange to-brand-orangeLight shadow-glow-orange border border-brand-orange/20"
                >
                  Get Quote
                </a>
                
                {contactData.phone1 && (
                  <a
                    href={`tel:${contactData.phone1.replace(/\s+/g, '')}`}
                    className="flex items-center justify-center space-x-2 text-slate-300 hover:text-white text-sm font-semibold py-2"
                  >
                    <Phone className="w-4 h-4 text-brand-orange" />
                    <span>{contactData.phone1}</span>
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
