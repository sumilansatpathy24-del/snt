import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, ArrowUpRight } from 'lucide-react';

const categories = ['All Fleet', '10-Wheel Dumpers', '16-Wheel Dumpers', '18-Wheel Dumpers', 'Heavy Industrial'];

const fleetVehicles = [
  {
    id: 1,
    name: '10-Wheeler Industrial Dumper',
    category: '10-Wheel Dumpers',
    image: '/images/heavy_cargo.png',
    capacity: '15 - 20 Metric Tons',
    dimensions: 'Standard Dump Body',
    telematics: 'Live GPS Telemetry Enabled',
    desc: 'High-capacity tipper designed for efficient movement of slag, iron ore, and other raw industrial materials within plants.',
  },
  {
    id: 2,
    name: '16-Wheeler High-Volume Dumper',
    category: '16-Wheel Dumpers',
    image: '/images/industrial_transport.png',
    capacity: '25 - 30 Metric Tons',
    dimensions: 'Extended Tipper Bed',
    telematics: 'Live GPS Telemetry Enabled',
    desc: 'Heavy-duty dumper optimized for factory-to-factory transport and bulk construction material shipments.',
  },
  {
    id: 3,
    name: '18-Wheeler Super Heavy Dumper',
    category: '18-Wheel Dumpers',
    image: '/images/container_fleet.png',
    capacity: '35 - 40 Metric Tons',
    dimensions: 'Max Volume Capacity',
    telematics: 'Live GPS Telemetry Enabled',
    desc: 'Our largest capacity dumper vehicle built for transporting pond ash, bulk sand, and extreme-weight industrial minerals.',
  },
  {
    id: 4,
    name: 'Heavy Industrial Support Fleet',
    category: 'Heavy Industrial',
    image: '/images/about_truck.png',
    capacity: 'Custom Load Capacity',
    dimensions: 'Multi-Axle Config',
    telematics: 'Real-time Fleet Tracking',
    desc: 'Specialized vehicles and equipment for internal plant transportation, land filling projects, and dust/waste transport operations.',
  },
];

export default function Fleet({ websiteData }) {
  const [selectedCategory, setSelectedCategory] = useState('All Fleet');

  const fleetData = websiteData?.fleet || {};
  const vehicles = fleetData.vehicles || [];

  const filteredFleet = selectedCategory === 'All Fleet'
    ? vehicles
    : vehicles.filter(v => v.category === selectedCategory);

  const rawTitle = fleetData.title || "High-Performance\nTransport Fleet";
  const titleParts = rawTitle.split('\n');
  const title1 = titleParts[0];
  const title2 = titleParts[1] || '';

  const partner = fleetData.partner || {
    tag: "L1 CATEGORY TRANSPORT PARTNER",
    name: "Rashmi Metallics Limited",
    desc: "Proud transportation partner of Rashmi Metallics Limited, providing dedicated support for raw material movement, plant logistics, industrial transportation, and bulk material handling operations. Our focus remains on timely service, operational efficiency, safety, and dependable logistics support for large-scale industrial requirements.",
    billing: "",
    label: "",
    subLabel: ""
  };

  return (
    <section id="fleet" className="relative py-24 md:py-32 bg-brand-dark overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-brand-orange/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-brand-orange font-outfit text-sm font-bold uppercase tracking-wider block">
            {fleetData.subtitle || "Our Transportation Power"}
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold font-outfit text-white tracking-tight leading-tight">
            {title1} <span className="orange-gradient-text text-glow">{title2}</span>
          </h2>
          <p className="text-slate-400 font-inter text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            {fleetData.description || "We operate a dedicated and well-maintained fleet of over 60 dumpers and trippers, equipped to handle large volumes and diverse material types."}
          </p>
        </div>

        {/* Filter Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`relative px-5 py-2.5 rounded-lg font-outfit text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                selectedCategory === category
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-200 bg-brand-lightnavy/30 border border-white/5'
              }`}
            >
              <span className="relative z-10">{category}</span>
              {selectedCategory === category && (
                <motion.div
                  layoutId="activeFilterBg"
                  className="absolute inset-0 bg-gradient-to-r from-brand-orange to-brand-orangeLight rounded-lg shadow-glow-orange border border-brand-orange/30"
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Fleet Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredFleet.map((vehicle) => (
              <motion.div
                key={vehicle.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="glass-panel rounded-2xl overflow-hidden group border border-white/5 hover:border-brand-orange/20 transition-all duration-300 shadow-xl"
              >
                {/* Image Section with Zoom */}
                <div className="relative h-64 overflow-hidden bg-brand-lightnavy">
                  <img
                    src={vehicle.image?.startsWith('/uploads') ? `https://snt-server.onrender.com${vehicle.image}` : vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/25 to-transparent z-1" />
                  
                  {/* Category Badge */}
                  <span className="absolute top-4 left-4 z-10 bg-brand-dark/80 backdrop-blur-md border border-brand-orange/30 text-brand-orange px-3.5 py-1.2 rounded-md font-outfit text-xs font-bold uppercase tracking-wider shadow-glow-orange">
                    {vehicle.category}
                  </span>
                </div>

                {/* Specs Section */}
                <div className="p-6 md:p-8 space-y-6">
                  <div>
                    <h3 className="font-outfit font-extrabold text-xl md:text-2xl text-white group-hover:text-brand-orange transition-colors duration-300">
                      {vehicle.name}
                    </h3>
                    <p className="text-slate-400 font-inter text-sm mt-2 leading-relaxed">
                      {vehicle.desc}
                    </p>
                  </div>

                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Clientele Section (Expertise & Clientele) */}
        <div className="mt-24 pt-16 border-t border-white/5 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-brand-orange font-outfit text-sm font-bold uppercase tracking-wider block">
              {fleetData.clienteleSubtitle || "Our Expertise & Clientele"}
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold font-outfit text-white tracking-tight leading-tight">
              {fleetData.clienteleTitle ? (fleetData.clienteleTitle.split('\n')[0]) : "Trusted by"} <span className="orange-gradient-text text-glow">{fleetData.clienteleTitle ? (fleetData.clienteleTitle.split('\n')[1] || "Industry Leaders") : "Industry Leaders"}</span>
            </h2>
            <p className="text-slate-400 font-inter text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              {fleetData.clienteleDesc || "We have a proven track record of delivering reliable transportation solutions to some of the industry's most respected names."}
            </p>
          </div>

          {/* Premium Clients Stack */}
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Key Partnership Card - Rashmi Group */}
            <div className="glass-panel p-6 md:p-8 rounded-2xl border border-brand-orange/20 shadow-glow-orange transition-all duration-300 hover:border-brand-orange/40">
              <div className="space-y-3">
                <span className="inline-block bg-brand-orange/10 border border-brand-orange/30 text-brand-orange px-3 py-1 rounded-md font-outfit text-xs font-bold uppercase tracking-wider">
                  {partner.tag || "L1 CATEGORY TRANSPORT PARTNER"}
                </span>
                <h3 className="font-outfit font-extrabold text-xl md:text-2xl text-white">
                  {partner.name || "Rashmi Metallics Limited"}
                </h3>
                <p className="text-slate-300 font-inter text-sm leading-relaxed max-w-3xl">
                  {partner.desc || "Proud transportation partner of Rashmi Metallics Limited, providing dedicated support for raw material movement, plant logistics, industrial transportation, and bulk material handling operations. Our focus remains on timely service, operational efficiency, safety, and dependable logistics support for large-scale industrial requirements."}
                </p>
              </div>
            </div>

            {/* Key Partnership Card - Shyam SEL & Power Ltd. */}
            <div className="glass-panel p-6 md:p-8 rounded-2xl border border-brand-orange/20 shadow-glow-orange transition-all duration-300 hover:border-brand-orange/40">
              <div className="space-y-3">
                <span className="inline-block bg-brand-orange/10 border border-brand-orange/30 text-brand-orange px-3 py-1 rounded-md font-outfit text-xs font-bold uppercase tracking-wider">
                  PREMIUM CLIENT PARTNER
                </span>
                <h3 className="font-outfit font-extrabold text-xl md:text-2xl text-white">
                  Shyam SEL & Power Ltd.
                </h3>
                <p className="text-slate-300 font-inter text-sm leading-relaxed max-w-3xl">
                  Providing dedicated plant-to-plant logistics solutions for Shyam SEL & Power Ltd., supporting raw material movement between Kharagpur, Ramsarup , Jamuria and associated plant locations, including the transportation of sponge iron, pellets, charcoal, coke, silico manganese and other industrial materials.
                </p>
              </div>
            </div>

            {/* Key Partnership Card - Ramsarup Industries Ltd. */}
            <div className="glass-panel p-6 md:p-8 rounded-2xl border border-brand-orange/20 shadow-glow-orange transition-all duration-300 hover:border-brand-orange/40">
              <div className="space-y-3">
                <span className="inline-block bg-brand-orange/10 border border-brand-orange/30 text-brand-orange px-3 py-1 rounded-md font-outfit text-xs font-bold uppercase tracking-wider">
                  PREMIUM CLIENT PARTNER
                </span>
                <h3 className="font-outfit font-extrabold text-xl md:text-2xl text-white">
                  Ramsarup Industries Ltd.
                </h3>
                <p className="text-slate-300 font-inter text-sm leading-relaxed max-w-3xl">
                  Providing reliable transportation support for Ramsarup Industries Ltd., handling bulk movement of sand, stone chips, land-filling materials and other construction-related cargo for industrial and infrastructure projects.
                </p>
              </div>
            </div>
          </div>

          {/* Additional Valued Clients Grid */}
          <div className="space-y-6 max-w-5xl mx-auto">
            <h4 className="font-outfit font-bold text-sm text-slate-400 uppercase tracking-wider text-center">
              Additional Valued Clients
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { name: 'Ashoka Buildcon Limited', desc: 'Entrusted with transportation of pond ash from DVC Andal (Durgapur) to their six-lane NH-19 road project site.' },
                { name: 'Naveen Merico Engineering Co. Pvt. Ltd.', desc: 'Engineering project material supply and transport partner.' },
                { name: 'MSP Metallics Pvt. Ltd.', desc: 'Internal plant raw materials transportation provider.' },
                { name: 'Shyam Steel Manufacturing Ltd.', desc: 'Bulk construction material supply and steel transport services.' },
                { name: 'Bengal Energy Ltd.', desc: 'Industrial waste, dust and bulk energy supply chain services.' },
                { name: 'Radix Infracon Pvt. Ltd.', desc: 'Infrastructure and commercial filling materials delivery.' },
                { name: 'Jai Balaji Group', desc: 'Heavy fleet shifting and bulk material transportation.' },
                { name: 'Giridhan Metal Pvt. Ltd.', desc: 'Reliable industrial transport support for minerals and metals.' }
              ].map((client) => (
                  <div key={client.name} className="h-full flex flex-col glass-panel p-5 rounded-xl border border-white/5 hover:border-brand-orange/10 transition-colors duration-300">
                    <h5 className="font-outfit font-bold text-base text-white mb-1.5">{client.name}</h5>
                    <p className="text-xs text-slate-400 font-inter leading-relaxed">{client.desc}</p>
                  </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
