import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Truck, CheckCircle2, Shield, Compass, Navigation } from 'lucide-react';

function AnimatedCounter({ value, duration = 1.5, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = parseInt(value, 10);
      if (isNaN(end)) return;
      if (start === end) {
        setCount(end);
        return;
      }

      const totalMiliseconds = duration * 1000;
      const stepTime = Math.max(Math.floor(totalMiliseconds / end), 20);
      
      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start === end) {
          clearInterval(timer);
        }
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [isInView, value, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function About({ websiteData }) {
  const contentRef = useRef(null);
  const isContentInView = useInView(contentRef, { once: true, margin: "-100px" });

  const aboutData = websiteData?.about || {};

  const stats = [
    {
      id: 1,
      title: 'Active Fleet',
      value: aboutData.stat1_val || '60',
      suffix: '+',
      desc: aboutData.stat1_desc || 'Well-maintained dumpers & trippers',
      icon: Truck,
    },
    {
      id: 2,
      title: 'Experience',
      value: aboutData.stat2_val || '13',
      suffix: '+ Yrs',
      desc: aboutData.stat2_desc || 'Reliable transport services since 2013',
      icon: Compass,
    },
    {
      id: 3,
      title: 'Annual Revenue',
      value: aboutData.stat3_val || '41',
      suffix: ' Cr+',
      desc: aboutData.stat3_desc || 'Robust financial growth in FY 2025-26',
      icon: Shield,
    },
    {
      id: 4,
      title: 'Client Satisfaction',
      value: aboutData.stat4_val || '100',
      suffix: '%',
      desc: aboutData.stat4_desc || 'Preferred partner for industry leaders',
      icon: Navigation,
    },
  ];

  // Parse title into line1 and line2
  const rawTitle = aboutData.title || "Pioneering Safe & Swift\nFreight Cargo Systems";
  const titleParts = rawTitle.split('\n');
  const title1 = titleParts[0];
  const title2 = titleParts[1] || '';

  return (
    <section id="about" className="relative py-24 md:py-32 bg-brand-dark overflow-hidden">
      {/* Dynamic Background Glow */}
      <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Image with glass overlay cards */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isContentInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative"
          >
            {/* Main Picture Frame */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-glow-navy group" style={{ background: 'radial-gradient(ellipse at center, #152238 0%, #0b1528 50%, #020617 100%)' }}>
              {/* Subtle orange ambient glow */}
              <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(249,93,2,0.08) 0%, transparent 70%)' }} />
              <div className="w-full h-[450px] flex items-center justify-center p-8 md:p-12">
                <img
                  src="/images/logo-transparent.png"
                  alt="SHREE NATHJI TRANSPORT"
                  className="about-hero-logo max-w-full max-h-full object-contain drop-shadow-[0_0_30px_rgba(249,93,2,0.2)] group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                />
              </div>
            </div>

            {/* Glowing Accent Border */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-brand-orange/20 to-transparent blur-md z-0 -m-1 pointer-events-none" />

            {/* Floating Glass Stat Overlay */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isContentInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute -bottom-6 -right-4 md:right-6 z-10 max-w-[240px] p-5 rounded-xl glass-panel border border-brand-orange/20 shadow-glow-orange flex items-start space-x-3"
            >
              <div className="flex-shrink-0 p-2.5 rounded-lg bg-brand-orange/20 text-brand-orange">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-outfit font-bold text-white text-base">{aboutData.floatingStatTitle || "Established 2013"}</h4>
                <p className="text-xs text-slate-300 mt-1 font-inter">{aboutData.floatingStatDesc || "Providing reliable industrial transportation for over a decade."}</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Narrative */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isContentInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <span className="text-brand-orange font-outfit text-sm font-bold uppercase tracking-wider">
                {aboutData.subtitle || "Reliable Transport Service Provider"}
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold font-outfit text-white tracking-tight leading-tight">
                {title1} <br />
                <span className="orange-gradient-text text-glow">{title2}</span>
              </h2>
            </div>

            <p className="text-slate-300 font-inter leading-relaxed text-base md:text-lg">
              {aboutData.description1 || "Shree Nathji Transport is a leading provider of comprehensive industrial transportation and construction material supply services. We specialize in internal plant transportation, factory-to-factory transport, industrial and commercial land filling, bulk material supply, and dust and waste transportation."}
            </p>

            <p className="text-slate-400 font-inter leading-relaxed text-sm md:text-base">
              {aboutData.description2 || "Our mission is to deliver seamless, reliable, and cost-effective transportation services that meet the highest standards of safety and efficiency. We aim to be the preferred transport partner known for our unwavering commitment to quality and client satisfaction."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {aboutData.bullet1 && (
                <div className="flex items-center space-x-3 text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-brand-orange flex-shrink-0" />
                  <span className="font-semibold text-sm font-outfit">{aboutData.bullet1}</span>
                </div>
              )}
              {aboutData.bullet2 && (
                <div className="flex items-center space-x-3 text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-brand-orange flex-shrink-0" />
                  <span className="font-semibold text-sm font-outfit">{aboutData.bullet2}</span>
                </div>
              )}
              {aboutData.bullet3 && (
                <div className="flex items-center space-x-3 text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-brand-orange flex-shrink-0" />
                  <span className="font-semibold text-sm font-outfit">{aboutData.bullet3}</span>
                </div>
              )}
              {aboutData.bullet4 && (
                <div className="flex items-center space-x-3 text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-brand-orange flex-shrink-0" />
                  <span className="font-semibold text-sm font-outfit">{aboutData.bullet4}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Statistics Cards Sub-section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          {stats.map((stat, idx) => {
            const StatIcon = stat.icon;
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-panel p-6 rounded-xl glass-panel-hover flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-outfit font-black text-4xl text-white">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </span>
                  <div className="p-3 rounded-lg bg-brand-orange/10 text-brand-orange border border-brand-orange/20 shadow-glow-orange">
                    <StatIcon className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h3 className="font-outfit font-bold text-lg text-white mb-1">
                    {stat.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-inter">
                    {stat.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
