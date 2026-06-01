import { motion } from 'framer-motion';
import { Clock, ShieldAlert, Navigation, FileCheck2, Landmark, Headset } from 'lucide-react';

const coreFeatures = [
  {
    title: 'Safety First',
    icon: ShieldAlert,
    desc: 'Adhering to rigorous safety protocols to protect assets and operations. We run regular fleet maintenance audits.',
  },
  {
    title: 'Operational Reliability',
    icon: Clock,
    desc: 'We understand the critical nature of timely deliveries in the industrial sector and strictly meet all project deadlines.',
  },
  {
    title: 'Customer-Centric Solutions',
    icon: Headset,
    desc: 'Priding ourselves on creating customized transportation plans tailored to the unique needs of each client and project.',
  },
  {
    title: 'Decade of Experience',
    icon: FileCheck2,
    desc: 'Providing premium transportation and bulk material supply solutions for industrial and construction sectors since 2013.',
  },
  {
    title: 'Robust Financial Growth',
    icon: Landmark,
    desc: 'Reflecting high operational capacity with solid financial growth, reaching ₹41.05 Crore in annual billing.',
  },
  {
    title: 'Trusted Partnerships',
    icon: Navigation,
    desc: 'A proven track record of serving industry leaders, including Rashmi Group, Ashoka Buildcon, and other major players.',
  },
];

export default function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="relative py-24 md:py-32 bg-[#020617] overflow-hidden">
      {/* Background Grid Overlay */}
      <div className="absolute inset-0 grid-overlay opacity-[0.03] pointer-events-none" />

      {/* Orange Glow Accent */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-3">
          <span className="text-brand-orange font-outfit text-sm font-bold uppercase tracking-wider block">
            Why Shree Nathji
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold font-outfit text-white tracking-tight leading-tight">
            Setting the Standard in <span className="orange-gradient-text text-glow">Transport Excellence</span>
          </h2>
          <p className="text-slate-400 font-inter text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            We merge high operational standards, safety checks, and customer-centric planning to deliver a premium transport experience you can trust.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coreFeatures.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 md:p-8 rounded-2xl glass-panel glass-panel-hover flex space-x-5 items-start group"
              >
                {/* Icon Wrapper */}
                <div className="flex-shrink-0 p-3 rounded-xl bg-brand-lightnavy border border-white/5 text-brand-orange group-hover:bg-brand-orange/15 group-hover:text-brand-orangeLight group-hover:border-brand-orange/30 transition-all duration-300 shadow-md">
                  <Icon className="w-6 h-6" />
                </div>
                
                {/* Text Context */}
                <div className="space-y-2">
                  <h3 className="font-outfit font-bold text-lg text-white group-hover:text-brand-orange transition-colors duration-300">
                    {feat.title}
                  </h3>
                  <p className="text-slate-400 font-inter text-sm leading-relaxed">
                    {feat.desc}
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
