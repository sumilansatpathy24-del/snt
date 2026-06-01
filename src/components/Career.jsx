import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Upload, CheckCircle2, AlertTriangle, Loader2, FileText, Phone, Mail, User } from 'lucide-react';

const positions = [
  'Dump Truck Driver (Heavy Vehicle)',
  'Maintenance Mechanic / Workshop Technician',
  'Transport Dispatch Manager',
  'Route Operations Coordinator',
  'Yard Supervisor / Loader Operator',
  'Accounts & Administrative Assistant'
];

export default function Career() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    experience: '',
    position: positions[0],
    message: ''
  });
  const [resume, setResume] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'
  const [statusMessage, setStatusMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check extension
    const ext = file.name.split('.').pop().toLowerCase();
    const allowed = ['pdf', 'doc', 'docx'];
    if (!allowed.includes(ext)) {
      setErrors(prev => ({ prev, resume: 'Please upload PDF, DOC, or DOCX resume only.' }));
      setResume(null);
      return;
    }

    // Check size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ prev, resume: 'File size must be under 5MB.' }));
      setResume(null);
      return;
    }

    setResume(file);
    setErrors(prev => ({ prev, resume: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.location.trim()) newErrors.location = 'Current location is required';
    if (!formData.experience.trim()) newErrors.experience = 'Experience details are required';
    
    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    // Phone
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }

    // Resume
    if (!resume) {
      newErrors.resume = 'Please upload your CV/Resume';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);
    setStatusMessage('');

    // Construct multipart form data
    const uploadData = new FormData();
    uploadData.append('name', formData.name);
    uploadData.append('phone', formData.phone);
    uploadData.append('email', formData.email);
    uploadData.append('location', formData.location);
    uploadData.append('experience', formData.experience);
    uploadData.append('position', formData.position);
    uploadData.append('message', formData.message);
    uploadData.append('resume', resume);

    try {
      const res = await fetch('/api/careers/apply', {
        method: 'POST',
        body: uploadData
      });

      let data = {};
      try {
        data = await res.json();
      } catch (jsonErr) {
        throw new Error('Invalid server response');
      }

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Failed to submit application');
      }

      setSubmitStatus('success');
      setStatusMessage(data.message || 'Your job application has been successfully submitted! Our HR team will review your profile shortly.');
      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        location: '',
        experience: '',
        position: positions[0],
        message: ''
      });
      setResume(null);
      // Reset file input element
      const fileInput = document.getElementById('resume-file');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      console.error(err);
      setSubmitStatus('error');
      setStatusMessage(err.message || 'An error occurred during submission. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative py-24 md:py-32 bg-brand-dark min-h-screen overflow-hidden pt-28">
      {/* Background radial glows */}
      <div className="absolute top-1/4 left-1/3 w-[450px] h-[450px] bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[450px] h-[450px] bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-[0.03] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-brand-orange font-outfit text-sm font-bold uppercase tracking-wider block">
            Work With Us
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold font-outfit text-white tracking-tight leading-tight">
            Careers at <span className="orange-gradient-text text-glow">Shree Nathji</span>
          </h1>
          <p className="text-slate-400 font-inter text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Join a leading provider of comprehensive plant transportation and material movement services. Apply for our open positions below.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {submitStatus === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-panel p-8 md:p-12 rounded-2xl border border-brand-orange/20 shadow-glow-orange text-center space-y-6"
              >
                <div className="inline-flex p-4 rounded-full bg-brand-orange/10 text-brand-orange border border-brand-orange/30 shadow-glow-orange animate-bounce">
                  <CheckCircle2 className="w-14 h-14" />
                </div>
                <div className="space-y-3">
                  <h3 className="font-outfit font-black text-2xl md:text-3xl text-white">Application Received!</h3>
                  <p className="text-slate-300 font-inter text-sm md:text-base max-w-lg mx-auto leading-relaxed">
                    {statusMessage}
                  </p>
                </div>
                <button
                  onClick={() => setSubmitStatus(null)}
                  className="px-6 py-3 bg-gradient-to-r from-brand-orange to-brand-orangeLight hover:shadow-glow-orange-lg border border-brand-orange/30 text-white font-outfit font-bold rounded-lg uppercase tracking-wider text-sm transition-all"
                >
                  Apply For Another Position
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-8 md:p-10 rounded-2xl border border-white/5 shadow-2xl relative"
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  {submitStatus === 'error' && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center space-x-3 text-red-400 text-sm">
                      <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                      <span>{statusMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <label htmlFor="name" className="font-outfit text-sm font-semibold text-slate-300 block">Full Name</label>
                      <input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className={`w-full bg-brand-navy/50 border ${errors.name ? 'border-red-500' : 'border-white/10'} focus:border-brand-orange rounded-lg px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none transition-colors duration-200`}
                      />
                      {errors.name && <p className="text-red-500 text-xs font-inter font-medium">{errors.name}</p>}
                    </div>

                    {/* Position */}
                    <div className="space-y-2">
                      <label htmlFor="position" className="font-outfit text-sm font-semibold text-slate-300 block">Applying For Position</label>
                      <select
                        id="position"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        className="w-full bg-[#0b1528] border border-white/10 focus:border-brand-orange rounded-lg px-4 py-3 text-slate-200 focus:outline-none transition-colors duration-200"
                      >
                        {positions.map(pos => (
                          <option key={pos} value={pos}>{pos}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Phone */}
                    <div className="space-y-2">
                      <label htmlFor="phone" className="font-outfit text-sm font-semibold text-slate-300 block">Phone Number</label>
                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="e.g. +91 99329 88615"
                        className={`w-full bg-brand-navy/50 border ${errors.phone ? 'border-red-500' : 'border-white/10'} focus:border-brand-orange rounded-lg px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none transition-colors duration-200`}
                      />
                      {errors.phone && <p className="text-red-500 text-xs font-inter font-medium">{errors.phone}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label htmlFor="email" className="font-outfit text-sm font-semibold text-slate-300 block">Email Address</label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g. candidate@example.com"
                        className={`w-full bg-brand-navy/50 border ${errors.email ? 'border-red-500' : 'border-white/10'} focus:border-brand-orange rounded-lg px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none transition-colors duration-200`}
                      />
                      {errors.email && <p className="text-red-500 text-xs font-inter font-medium">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Current Location */}
                    <div className="space-y-2">
                      <label htmlFor="location" className="font-outfit text-sm font-semibold text-slate-300 block">Current Location</label>
                      <input
                        id="location"
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="e.g. Kharagpur, West Bengal"
                        className={`w-full bg-brand-navy/50 border ${errors.location ? 'border-red-500' : 'border-white/10'} focus:border-brand-orange rounded-lg px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none transition-colors duration-200`}
                      />
                      {errors.location && <p className="text-red-500 text-xs font-inter font-medium">{errors.location}</p>}
                    </div>

                    {/* Experience */}
                    <div className="space-y-2">
                      <label htmlFor="experience" className="font-outfit text-sm font-semibold text-slate-300 block">Total Experience</label>
                      <input
                        id="experience"
                        type="text"
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        placeholder="e.g. 5 Years in Heavy Machinery"
                        className={`w-full bg-brand-navy/50 border ${errors.experience ? 'border-red-500' : 'border-white/10'} focus:border-brand-orange rounded-lg px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none transition-colors duration-200`}
                      />
                      {errors.experience && <p className="text-red-500 text-xs font-inter font-medium">{errors.experience}</p>}
                    </div>
                  </div>

                  {/* Resume Upload Box */}
                  <div className="space-y-2">
                    <label className="font-outfit text-sm font-semibold text-slate-300 block">Upload CV/Resume (PDF, DOC, DOCX - Max 5MB)</label>
                    
                    <div className="relative border-2 border-dashed border-white/10 hover:border-brand-orange/45 rounded-xl p-6 bg-brand-navy/20 text-center transition-colors">
                      <input
                        id="resume-file"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      
                      <div className="flex flex-col items-center space-y-2">
                        {resume ? (
                          <>
                            <FileText className="w-10 h-10 text-brand-orange shadow-glow-orange-sm" />
                            <p className="text-white text-sm font-medium font-outfit">{resume.name}</p>
                            <p className="text-xs text-slate-400 font-inter">{(resume.size / (1024 * 1024)).toFixed(2)} MB</p>
                          </>
                        ) : (
                          <>
                            <Upload className="w-10 h-10 text-slate-400" />
                            <p className="text-slate-300 text-sm font-semibold font-outfit">Click to select file or drag it here</p>
                            <p className="text-xs text-slate-500 font-inter">Supports PDF, DOC, or DOCX formats up to 5MB</p>
                          </>
                        )}
                      </div>
                    </div>
                    {errors.resume && <p className="text-red-500 text-xs font-inter font-medium">{errors.resume}</p>}
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label htmlFor="message" className="font-outfit text-sm font-semibold text-slate-300 block">Brief Introduction / Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Briefly tell us about your skills and why you want to join Shree Nathji Transport..."
                      className="w-full bg-brand-navy/50 border border-white/10 focus:border-brand-orange rounded-lg px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none transition-colors duration-200 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-brand-orange to-brand-orangeLight hover:shadow-glow-orange-lg border border-brand-orange/30 text-white font-outfit font-bold tracking-wider uppercase py-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 hover:scale-[1.01]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Application</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
