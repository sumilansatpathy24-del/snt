import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Truck, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

export default function Hero({ websiteData }) {
  const containerRef = useRef(null);
  
  const heroData = websiteData?.hero || {};

  // Custom parallax scroll mapping
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 800], [0, 150]);
  const opacityBg = useTransform(scrollY, [0, 600], [1, 0.4]);
  const yText = useTransform(scrollY, [0, 800], [0, -80]);

  const handleScrollToContact = (e) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      window.scrollTo({
        top: contactSection.offsetTop - 80,
        behavior: 'smooth',
      });
    }
  };

  const handleScrollToAbout = (e) => {
    e.preventDefault();
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      window.scrollTo({
        top: aboutSection.offsetTop - 80,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section 
      id="home" 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-brand-dark pt-16"
    >
      {/* Background image with parallax effect */}
      <motion.div 
        style={{ y: yBg, opacity: opacityBg }}
        className="absolute inset-0 w-full h-[120%] -top-[10%] z-0"
      >
        <img 
          src={heroData.bgImage?.startsWith('/uploads') ? `https://snt-server.onrender.com${heroData.bgImage}` : (heroData.bgImage || "/images/hero_truck_bg.png")} 
          alt="Cinematic industrial transport truck on the road" 
          className="w-full h-full object-cover object-center filter brightness-[0.7]"
        />
        {/* Dark Navy and Black Gradients overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/90 via-brand-dark/50 to-transparent" />
        <div className="absolute inset-0 bg-[#020617]/50" />
      </motion.div>

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-[0.15] pointer-events-none z-1" />

      {/* Glow highlight */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-left py-20 md:py-32">
        <motion.div style={{ y: yText }} className="max-w-4xl">
          {/* Heading with animated split reveal */}
          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight font-outfit uppercase"
          >
            {heroData.titleLine1 || "SAFE & FAST"} <br />
            <span className="orange-gradient-text text-glow">{heroData.titleLine2 || "TRANSPORT SERVICES"}</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-slate-300 font-inter leading-relaxed max-w-2xl"
          >
            {heroData.description || "Your Trusted Partner for Reliable, High-Volume Industrial Transportation and Construction Supply."}
          </motion.p>
 
          {/* Core points */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 grid grid-cols-2 sm:flex sm:space-x-8 gap-4"
          >
            {heroData.point1 && (
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <ShieldCheck className="w-5 h-5 text-brand-orange" />
                <span className="font-semibold text-slate-200">{heroData.point1}</span>
              </div>
            )}
            {heroData.point2 && (
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <Clock className="w-5 h-5 text-brand-orange" />
                <span className="font-semibold text-slate-200">{heroData.point2}</span>
              </div>
            )}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <a
              href="#contact"
              onClick={handleScrollToContact}
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-outfit text-base font-bold tracking-wider uppercase text-white bg-gradient-to-r from-brand-orange to-brand-orangeLight hover:shadow-glow-orange-lg hover:scale-[1.02] transition-all duration-300 border border-brand-orange/30 group"
            >
              Get Quote
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
            
            <a
              href="#about"
              onClick={handleScrollToAbout}
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-outfit text-base font-bold tracking-wider uppercase text-slate-200 hover:text-white glass-panel hover:bg-white/10 border border-white/15 hover:border-brand-orange/30 hover:scale-[1.02] transition-all duration-300"
            >
              Learn More
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Animated scroll down mouse indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
        <span className="text-slate-500 font-outfit text-xs font-semibold uppercase tracking-widest mb-2">Scroll Down</span>
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-slate-500 rounded-full flex justify-center pt-2"
        >
          <div className="w-1.5 h-3 bg-brand-orange rounded-full" />
        </motion.div>
      </div>
    </section>
  );
}
