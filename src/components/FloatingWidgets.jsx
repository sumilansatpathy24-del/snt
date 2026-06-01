import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, PhoneCall, ArrowUp } from 'lucide-react';

export default function FloatingWidgets({ websiteData }) {
  const [showScroll, setShowScroll] = useState(false);

  const contactData = websiteData?.contact || {};

  useEffect(() => {
    const checkScrollTop = () => {
      if (window.scrollY > 400) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    };

    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center space-y-3.5">
      
      {/* Scroll To Top Button */}
      <AnimatePresence>
        {showScroll && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={handleScrollTop}
            className="w-12 h-12 rounded-full glass-panel border border-brand-orange/30 text-brand-orange hover:text-white hover:bg-brand-orange shadow-glow-orange flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Call Now Widget */}
      <motion.a
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
        href={`tel:${(contactData.phone1 || '+919932988615').replace(/\s+/g, '')}`}
        className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-orange to-brand-orangeDark text-white shadow-glow-orange flex items-center justify-center border border-brand-orangeLight/20 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
        aria-label="Call Helpline"
      >
        <PhoneCall className="w-5 h-5" />
      </motion.a>

      {/* WhatsApp Floating Widget */}
      <motion.a
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
        href={`https://wa.me/${(contactData.phone1 || '919932988615').replace(/[+\s-]/g, '')}?text=${encodeURIComponent(contactData.whatsappPrefill || "Hello SHREE NATHJI TRANSPORT, I want transport service information.")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full bg-[#25d366] text-white shadow-[0_4px_14px_rgba(37,211,102,0.4)] flex items-center justify-center border border-[#34e073]/20 transition-all duration-300 hover:scale-105 hover:-translate-y-1 relative"
        aria-label="WhatsApp Dispatcher"
      >
        <MessageSquare className="w-5 h-5 fill-current" />
        
        {/* Pulsing indicator */}
        <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-brand-orange"></span>
        </span>
      </motion.a>
    </div>
  );
}
