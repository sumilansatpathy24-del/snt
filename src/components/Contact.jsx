import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, MapPin, Send, MessageSquare, PhoneCall, CheckCircle } from 'lucide-react';

export default function Contact({ websiteData }) {
  const contactData = websiteData?.contact || {};

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'Internal Plant Transportation',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.message.trim()) newErrors.message = 'Message details are required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Phone validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Mobile number is required';
    } else if (!phoneRegex.test(formData.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear validation error when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch('https://snt-server.onrender.com/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      let data = {};
      try {
        data = await res.json();
      } catch (jsonErr) {
        throw new Error('Invalid server response');
      }

      console.log('response.status:', res.status);
      console.log('response.data:', data);

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Failed to submit inquiry');
      }

      setShowToast(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        service: 'Internal Plant Transportation',
        message: '',
      });
      
      // Auto-hide success toast
      setTimeout(() => setShowToast(false), 5000);
    } catch (err) {
      console.error(err);
      alert(err.message || 'An error occurred during submission. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 md:py-32 bg-brand-dark overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-3/4 -translate-y-1/2 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Success Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-24 right-4 md:right-8 z-50 p-4 rounded-xl glass-panel border border-brand-orange/40 bg-brand-navy/95 shadow-glow-orange flex items-center space-x-3 max-w-sm"
          >
            <div className="p-2 rounded-lg bg-brand-orange/20 text-brand-orange">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-outfit font-bold text-white text-sm">Quote Request Sent!</h4>
              <p className="text-xs text-slate-300 mt-1 font-inter">Our dispatcher will contact you in 15 minutes.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-3">
          <span className="text-brand-orange font-outfit text-sm font-bold uppercase tracking-wider block">
            {contactData.subtitle || "Partner With Us"}
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold font-outfit text-white tracking-tight leading-tight">
            {contactData.title ? contactData.title.split('\n')[0] : "Initiate a"} <span className="orange-gradient-text text-glow">{contactData.title ? contactData.title.split('\n')[1] || "Freight Cargo Quote" : "Freight Cargo Quote"}</span>
          </h2>
          <p className="text-slate-400 font-inter text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            {contactData.description || "Submit your freight coordinates and cargo volume metrics to acquire a custom quote from our operators."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Form (7 columns wide) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 glass-panel p-8 md:p-10 rounded-2xl border border-white/5 shadow-2xl relative"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Name */}
                <div className="space-y-2">
                  <label htmlFor="name" className="font-outfit text-sm font-semibold text-slate-300">Your Full Name</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className={`w-full bg-brand-lightnavy/50 border ${errors.name ? 'border-red-500' : 'border-white/10'} focus:border-brand-orange rounded-lg px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none transition-colors duration-200`}
                  />
                  {errors.name && <p className="text-red-500 text-xs font-inter font-medium">{errors.name}</p>}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label htmlFor="phone" className="font-outfit text-sm font-semibold text-slate-300">Mobile Number</label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. +91 99329 88615"
                    className={`w-full bg-brand-lightnavy/50 border ${errors.phone ? 'border-red-500' : 'border-white/10'} focus:border-brand-orange rounded-lg px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none transition-colors duration-200`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs font-inter font-medium">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="font-outfit text-sm font-semibold text-slate-300">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. client@company.com"
                    className={`w-full bg-brand-lightnavy/50 border ${errors.email ? 'border-red-500' : 'border-white/10'} focus:border-brand-orange rounded-lg px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none transition-colors duration-200`}
                  />
                  {errors.email && <p className="text-red-500 text-xs font-inter font-medium">{errors.email}</p>}
                </div>

                {/* Service Dropdown */}
                <div className="space-y-2">
                  <label htmlFor="service" className="font-outfit text-sm font-semibold text-slate-300">Service Category</label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className="w-full bg-[#0b1528] border border-white/10 focus:border-brand-orange rounded-lg px-4 py-3 text-slate-200 focus:outline-none transition-colors duration-200"
                  >
                    <option value="Internal Plant Transportation">Internal Plant Transportation</option>
                    <option value="Factory-to-Factory Transport">Factory-to-Factory Transport</option>
                    <option value="Industrial Land Filling">Industrial Land Filling</option>
                    <option value="Bulk Material Supply">Bulk Material Supply</option>
                    <option value="Dust & Waste Transportation">Dust & Waste Transportation</option>
                    <option value="Heavy Industrial Fleet">Heavy Industrial Fleet</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label htmlFor="message" className="font-outfit text-sm font-semibold text-slate-300">Cargo & Route Details</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Specify cargo weight, dimensional limits, loading node, and delivery destination..."
                  className={`w-full bg-brand-lightnavy/50 border ${errors.message ? 'border-red-500' : 'border-white/10'} focus:border-brand-orange rounded-lg px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none transition-colors duration-200 resize-none`}
                />
                {errors.message && <p className="text-red-500 text-xs font-inter font-medium">{errors.message}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-brand-orange to-brand-orangeLight hover:shadow-glow-orange-lg border border-brand-orange/30 text-white font-outfit font-bold tracking-wider uppercase py-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 hover:scale-[1.01]"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Submit Inquiry</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Right Column: Details & Map (5 columns wide) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            {/* Info Cards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-4"
            >
              {/* Call Now Card */}
              <div className="glass-panel p-5 rounded-xl border border-white/5 flex items-start space-x-4">
                <div className="p-3 rounded-lg bg-brand-orange/15 text-brand-orange border border-brand-orange/20 shadow-glow-orange flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-outfit font-bold text-slate-400 text-xs uppercase tracking-wider">{contactData.helplinesTitle || "Contact Persons & Helpline"}</h4>
                  <p className="text-white text-xs font-semibold mt-1 font-inter">
                    {contactData.contactPersons || "Mahesh Sharma / Parash Sharma"}
                  </p>
                  {contactData.phone1 && <p className="font-outfit font-black text-white text-base mt-1.5">{contactData.phone1}</p>}
                  {contactData.phone2 && <p className="font-outfit font-black text-white text-base mt-0.5">{contactData.phone2}</p>}
                  {contactData.phone3 && <p className="font-outfit font-black text-white text-base mt-0.5">{contactData.phone3}</p>}
                  <div className="mt-3 flex flex-wrap gap-x-2 gap-y-1.5">
                    {contactData.phone1 && (
                      <a
                        href={`tel:${contactData.phone1.replace(/\s+/g, '')}`}
                        className="inline-flex items-center text-[10px] md:text-xs font-bold text-brand-orange hover:text-brand-orangeLight transition-colors font-outfit tracking-wide uppercase"
                      >
                        <PhoneCall className="w-3.5 h-3.5 mr-1" />
                        Helpline 1
                      </a>
                    )}
                    <span className="text-white/10">|</span>
                    {contactData.phone2 && (
                      <a
                        href={`tel:${contactData.phone2.replace(/\s+/g, '')}`}
                        className="inline-flex items-center text-[10px] md:text-xs font-bold text-brand-orange hover:text-brand-orangeLight transition-colors font-outfit tracking-wide uppercase"
                      >
                        <PhoneCall className="w-3.5 h-3.5 mr-1" />
                        Helpline 2
                      </a>
                    )}
                    <span className="text-white/10">|</span>
                    {contactData.phone3 && (
                      <a
                        href={`tel:${contactData.phone3.replace(/\s+/g, '')}`}
                        className="inline-flex items-center text-[10px] md:text-xs font-bold text-brand-orange hover:text-brand-orangeLight transition-colors font-outfit tracking-wide uppercase"
                      >
                        <PhoneCall className="w-3.5 h-3.5 mr-1" />
                        Helpline 3
                      </a>
                    )}
                    <span className="text-white/10">|</span>
                    <a
                      href={`https://wa.me/${(contactData.phone1 || '919932988615').replace(/[+\s-]/g, '')}?text=${encodeURIComponent(contactData.whatsappPrefill || "Hello SHREE NATHJI TRANSPORT, I want transport service information.")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-[10px] md:text-xs font-bold text-brand-orange hover:text-brand-orangeLight transition-colors font-outfit tracking-wide uppercase"
                    >
                      <MessageSquare className="w-3.5 h-3.5 mr-1" />
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="glass-panel p-5 rounded-xl border border-white/5 flex items-start space-x-4">
                <div className="p-3 rounded-lg bg-brand-orange/15 text-brand-orange border border-brand-orange/20 shadow-glow-orange flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-outfit font-bold text-slate-400 text-xs uppercase tracking-wider">Corporate Email & Web</h4>
                  <a href={`mailto:${contactData.email || 'nathjitransportkgp@gmail.com'}`} className="font-outfit font-black text-white text-base md:text-lg mt-1 hover:text-brand-orange transition-colors block">
                    {contactData.email || 'nathjitransportkgp@gmail.com'}
                  </a>
                  <a href={`http://${contactData.website || 'www.shreenathjitransport.com'}`} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-orange mt-1 hover:underline font-inter block font-semibold tracking-wide">
                    {contactData.website || 'www.shreenathjitransport.com'}
                  </a>
                </div>
              </div>

              {/* Address Card */}
              <div className="glass-panel p-5 rounded-xl border border-white/5 flex items-start space-x-4">
                <div className="p-3 rounded-lg bg-brand-orange/15 text-brand-orange border border-brand-orange/20 shadow-glow-orange flex-shrink-0 mt-1">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-4 w-full">
                  <div>
                    <h4 className="font-outfit font-bold text-slate-400 text-xs uppercase tracking-wider">{contactData.registeredOfficeTitle || "Registered Office"}</h4>
                    <p className="font-outfit font-bold text-white text-sm mt-1 leading-relaxed whitespace-pre-line">
                      {contactData.registeredOfficeAddress || "Sita Prabhu Bhawan, In Front of UCO Bank,\nMalancha Road, Kharagpur - 721301,\nWest Bengal, India"}
                    </p>
                  </div>
                  <div className="border-t border-white/5 pt-3">
                    <h4 className="font-outfit font-bold text-slate-400 text-xs uppercase tracking-wider">{contactData.workshopOfficeTitle || "Workshop Office"}</h4>
                    <p className="font-outfit font-bold text-white text-sm mt-1 leading-relaxed whitespace-pre-line">
                      {contactData.workshopOfficeAddress || "Shree Nathji Transport, Near Tata Bearing Main Gate,\nNimpura, NH-6, Kharagpur - 721301,\nPaschim Medinipur, West Bengal, India"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stylized Google Maps Iframe */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative w-full h-[220px] rounded-xl overflow-hidden border border-white/5 shadow-2xl"
            >
              <iframe
                title="Shree Nathji Transport Location"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(contactData.mapQ || "Shree Nathji Transport, 22.3420058,87.2633395")}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)',
                }}
                allowFullScreen=""
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
