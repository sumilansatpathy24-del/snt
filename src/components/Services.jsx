import { motion } from 'framer-motion';
import { Truck, Package, Shield, Layers, Navigation, CalendarCheck } from 'lucide-react';

const services = [
  {
    title: 'Internal Plant Transportation',
    icon: Layers,
    description: 'Management and movement of raw materials (iron ore, pellets, coal, slag) within industrial complexes, ensuring a smooth and uninterrupted flow of production.',
  },
  {
    title: 'Factory-to-Factory Transport',
    icon: Truck,
    description: 'Connecting manufacturing plants with timely and secure transport of raw materials, semi-finished goods, and finished industrial products.',
  },
  {
    title: 'Industrial Land Filling',
    icon: Package,
    description: 'Specialized commercial and industrial land filling solutions, providing Slag dust, ESP dust, and other waste delivery to project sites.',
  },
  {
    title: 'Bulk Material Supply',
    icon: Layers,
    description: 'A trusted supplier of essential construction materials, including sand, stone chips, and other raw minerals with a focus on timely and quality-controlled delivery.',
  },
  {
    title: 'Dust & Waste Transportation',
    icon: Shield,
    description: 'Safe and compliant transport of industrial dust and waste materials, utilizing specialized dumpers and adhering to high environmental safety standards.',
  },
  {
    title: 'Heavy Industrial Fleet',
    icon: CalendarCheck,
    description: 'Operations powered by a robust fleet of over 60 dumpers and trippers (10-wheel, 16-wheel, and 18-wheel dumpers) engineered for heavy-duty transit.',
  },
];

const iconMap = {
  Layers: Layers,
  Truck: Truck,
  Package: Package,
  Shield: Shield,
  CalendarCheck: CalendarCheck
};

const defaultIcons = [Layers, Truck, Package, Layers, Shield, CalendarCheck];

export default function Services({ websiteData }) {
  const servicesData = websiteData?.services || {};
  const servicesList = servicesData.list || [];

  return (
    <section id="services" className="relative py-24 md:py-32 bg-[#020617] overflow-hidden">
      {/* Background grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-[0.05] pointer-events-none" />
      
      {/* Glow highlight */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-3">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-brand-orange font-outfit text-sm font-bold uppercase tracking-wider block"
          >
            {servicesData.subtitle || "What We Deliver"}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-5xl font-extrabold font-outfit text-white tracking-tight leading-tight"
          >
            {servicesData.title ? servicesData.title.split('&')[0] : "Industrial Transportation "}& <span className="orange-gradient-text text-glow">{servicesData.title ? servicesData.title.split('&')[1] || "Transport Services" : "Transport Services"}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 font-inter text-sm md:text-base max-w-2xl mx-auto leading-relaxed"
          >
            {servicesData.description || "We supply a robust suite of transport capabilities designed to meet the dynamic needs of corporate supply chains across the country."}
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesList.map((service, index) => {
            const Icon = iconMap[service.icon] || defaultIcons[index % defaultIcons.length];
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-panel p-8 rounded-2xl glass-panel-hover group flex flex-col justify-between"
              >
                <div>
                  {/* Glowing Icon Wrapper */}
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-brand-lightnavy border border-white/5 text-brand-orange shadow-glow-navy group-hover:bg-brand-orange/10 group-hover:border-brand-orange/30 group-hover:text-brand-orangeLight transition-all duration-300 mb-6">
                    <Icon className="w-7 h-7" />
                  </div>
                  
                  {/* Service Details */}
                  <h3 className="font-outfit font-bold text-xl text-white group-hover:text-brand-orange transition-colors duration-300 mb-4">
                    {service.title}
                  </h3>
                  
                  <p className="text-slate-400 font-inter text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Accent Highlight Bar */}
                <div className="w-0 h-[3px] bg-gradient-to-r from-brand-orange to-brand-orangeLight group-hover:w-full transition-all duration-300 rounded-full mt-6" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
