import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Upload, Loader2, Image as ImageIcon, CheckCircle, ChevronDown, ChevronRight, Eye } from 'lucide-react';

const editorSections = [
  { id: 'hero', name: 'Hero Section' },
  { id: 'about', name: 'About Content & Stats' },
  { id: 'services', name: 'Services Configuration' },
  { id: 'fleet', name: 'Fleet & Partnerships' },
  { id: 'contact', name: 'Contact & Addresses' },
  { id: 'footer', name: 'Footer Settings' }
];

export default function ContentEditor({ websiteData, updateWebsiteData }) {
  const [tempData, setTempData] = useState(websiteData);
  const [activeSection, setActiveSection] = useState('hero');
  const [uploadingField, setUploadingField] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleInputChange = (section, field, value) => {
    setTempData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNestedListChange = (section, index, field, value) => {
    setTempData(prev => {
      const newList = [...(prev[section]?.list || [])];
      newList[index] = { ...newList[index], [field]: value };
      return {
        ...prev,
        [section]: {
          ...prev[section],
          list: newList
        }
      };
    });
  };

  const handleImageUpload = async (e, sectionKey, fieldKey) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check size limit (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be under 10MB.');
      return;
    }

    const token = localStorage.getItem('adminToken');
    if (!token) return;

    setUploadingField(`${sectionKey}.${fieldKey}`);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('https://snt-server.onrender.com/api/admin/upload-media', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
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
        throw new Error(data.message || data.error || 'Upload failed');
      }

      handleInputChange(sectionKey, fieldKey, data.url);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Media upload failed. Please verify format.');
    } finally {
      setUploadingField(null);
    }
  };

  const handleSave = () => {
    updateWebsiteData(tempData);
    setSaveSuccess(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-outfit font-black text-xl md:text-2xl text-white">
            Website Content & Copy Editor
          </h2>
          <p className="text-xs text-slate-400 font-inter mt-1">
            Modify text content, update metrics stats, and upload background images. Changes display immediately.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-brand-orange to-brand-orangeLight hover:shadow-glow-orange-lg text-white font-outfit font-bold rounded-lg uppercase tracking-wider text-xs transition-all hover:scale-[1.01]"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Success banner */}
      {saveSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-brand-orange/15 border border-brand-orange/30 rounded-xl flex items-center space-x-2.5 text-brand-orange text-xs font-inter font-bold"
        >
          <CheckCircle className="w-5 h-5 flex-shrink-0 animate-bounce" />
          <span>Website contents updated successfully! Open the main website to check the live changes.</span>
        </motion.div>
      )}

      {/* Layout Editor grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Selector tabs (3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-2">
          {editorSections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-outfit text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                activeSection === sec.id
                  ? 'text-white bg-brand-orange/10 border border-brand-orange/20'
                  : 'text-slate-400 hover:text-slate-200 bg-brand-navy/30 border border-white/5'
              }`}
            >
              <span>{sec.name}</span>
              <ChevronRight className={`w-3.5 h-3.5 ${activeSection === sec.id ? 'text-brand-orange' : 'text-slate-500'}`} />
            </button>
          ))}
        </div>

        {/* Right Column: Editable fields (9 cols) */}
        <div className="lg:col-span-9 glass-panel p-6 md:p-8 rounded-xl border border-white/5 space-y-6 bg-brand-navy/10">
          
          {/* ==================== HERO SECTION EDITOR ==================== */}
          {activeSection === 'hero' && (
            <div className="space-y-4">
              <h3 className="font-outfit font-bold text-base text-white border-b border-white/5 pb-3">Hero Content</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-1 md:col-span-2">
                  <label className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">Badge Tagline</label>
                  <input
                    type="text"
                    value={tempData.hero?.badgeText || ''}
                    onChange={(e) => handleInputChange('hero', 'badgeText', e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-3.5 py-2.5 text-slate-200 focus:outline-none text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">Heading Line 1</label>
                  <input
                    type="text"
                    value={tempData.hero?.titleLine1 || ''}
                    onChange={(e) => handleInputChange('hero', 'titleLine1', e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-3.5 py-2.5 text-slate-200 focus:outline-none text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">Heading Line 2 (Highlight)</label>
                  <input
                    type="text"
                    value={tempData.hero?.titleLine2 || ''}
                    onChange={(e) => handleInputChange('hero', 'titleLine2', e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-3.5 py-2.5 text-slate-200 focus:outline-none text-xs"
                  />
                </div>

                <div className="space-y-1.5 col-span-1 md:col-span-2">
                  <label className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">Description Text</label>
                  <textarea
                    rows="3"
                    value={tempData.hero?.description || ''}
                    onChange={(e) => handleInputChange('hero', 'description', e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-3.5 py-2.5 text-slate-200 focus:outline-none text-xs resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">Feature Bullet 1</label>
                  <input
                    type="text"
                    value={tempData.hero?.point1 || ''}
                    onChange={(e) => handleInputChange('hero', 'point1', e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-3.5 py-2.5 text-slate-200 focus:outline-none text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">Feature Bullet 2</label>
                  <input
                    type="text"
                    value={tempData.hero?.point2 || ''}
                    onChange={(e) => handleInputChange('hero', 'point2', e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-3.5 py-2.5 text-slate-200 focus:outline-none text-xs"
                  />
                </div>

                {/* Hero Background Image Uploader */}
                <div className="space-y-1.5 col-span-1 md:col-span-2 border-t border-white/5 pt-4">
                  <label className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider block">Hero Background Image</label>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {tempData.hero?.bgImage && (
                      <div className="w-24 h-16 rounded-lg overflow-hidden border border-white/10 bg-brand-navy flex-shrink-0">
                        <img src={tempData.hero.bgImage?.startsWith('/uploads') ? `https://snt-server.onrender.com${tempData.hero.bgImage}` : tempData.hero.bgImage} className="w-full h-full object-cover" alt="Hero Bg" />
                      </div>
                    )}
                    <div className="flex-grow w-full relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'hero', 'bgImage')}
                        disabled={uploadingField === 'hero.bgImage'}
                        className="w-full text-slate-400 font-inter text-xs file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-navy file:text-brand-orange hover:file:bg-brand-orange/10 file:cursor-pointer"
                      />
                      {uploadingField === 'hero.bgImage' && (
                        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center text-xs text-brand-orange font-bold space-x-1.5">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Uploading image...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== ABOUT SECTION EDITOR ==================== */}
          {activeSection === 'about' && (
            <div className="space-y-4">
              <h3 className="font-outfit font-bold text-base text-white border-b border-white/5 pb-3">About Content</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">Subtitle Badge</label>
                  <input
                    type="text"
                    value={tempData.about?.subtitle || ''}
                    onChange={(e) => handleInputChange('about', 'subtitle', e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-3.5 py-2.5 text-slate-200 focus:outline-none text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">Title Heading (Use \n to separate lines)</label>
                  <input
                    type="text"
                    value={tempData.about?.title || ''}
                    onChange={(e) => handleInputChange('about', 'title', e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-3.5 py-2.5 text-slate-200 focus:outline-none text-xs"
                  />
                </div>

                <div className="space-y-1.5 col-span-1 md:col-span-2">
                  <label className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">Mission Statement Paragraph 1</label>
                  <textarea
                    rows="4"
                    value={tempData.about?.description1 || ''}
                    onChange={(e) => handleInputChange('about', 'description1', e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-3.5 py-2.5 text-slate-200 focus:outline-none text-xs resize-none"
                  />
                </div>

                <div className="space-y-1.5 col-span-1 md:col-span-2">
                  <label className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">Mission Statement Paragraph 2</label>
                  <textarea
                    rows="3"
                    value={tempData.about?.description2 || ''}
                    onChange={(e) => handleInputChange('about', 'description2', e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-3.5 py-2.5 text-slate-200 focus:outline-none text-xs resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">Floating Card Title</label>
                  <input
                    type="text"
                    value={tempData.about?.floatingStatTitle || ''}
                    onChange={(e) => handleInputChange('about', 'floatingStatTitle', e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-3.5 py-2.5 text-slate-200 focus:outline-none text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">Floating Card Desc</label>
                  <input
                    type="text"
                    value={tempData.about?.floatingStatDesc || ''}
                    onChange={(e) => handleInputChange('about', 'floatingStatDesc', e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-3.5 py-2.5 text-slate-200 focus:outline-none text-xs"
                  />
                </div>

                {/* Bullets */}
                <div className="space-y-1.5">
                  <label className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">Check Bullet 1</label>
                  <input
                    type="text"
                    value={tempData.about?.bullet1 || ''}
                    onChange={(e) => handleInputChange('about', 'bullet1', e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-3.5 py-2.5 text-slate-200 focus:outline-none text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">Check Bullet 2</label>
                  <input
                    type="text"
                    value={tempData.about?.bullet2 || ''}
                    onChange={(e) => handleInputChange('about', 'bullet2', e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-3.5 py-2.5 text-slate-200 focus:outline-none text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">Check Bullet 3</label>
                  <input
                    type="text"
                    value={tempData.about?.bullet3 || ''}
                    onChange={(e) => handleInputChange('about', 'bullet3', e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-3.5 py-2.5 text-slate-200 focus:outline-none text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">Check Bullet 4</label>
                  <input
                    type="text"
                    value={tempData.about?.bullet4 || ''}
                    onChange={(e) => handleInputChange('about', 'bullet4', e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-3.5 py-2.5 text-slate-200 focus:outline-none text-xs"
                  />
                </div>

                {/* Counters */}
                <div className="space-y-1.5 col-span-1 md:col-span-2 border-t border-white/5 pt-4">
                  <h4 className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider block">Counter Statistics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500 font-outfit">Active Fleet</label>
                      <input
                        type="text"
                        value={tempData.about?.stat1_val || ''}
                        onChange={(e) => handleInputChange('about', 'stat1_val', e.target.value)}
                        className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none text-xs"
                      />
                      <input
                        type="text"
                        value={tempData.about?.stat1_desc || ''}
                        onChange={(e) => handleInputChange('about', 'stat1_desc', e.target.value)}
                        className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-2.5 py-1 text-slate-400 focus:outline-none text-[10px] mt-1"
                        placeholder="Description"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500 font-outfit">Years Experience</label>
                      <input
                        type="text"
                        value={tempData.about?.stat2_val || ''}
                        onChange={(e) => handleInputChange('about', 'stat2_val', e.target.value)}
                        className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none text-xs"
                      />
                      <input
                        type="text"
                        value={tempData.about?.stat2_desc || ''}
                        onChange={(e) => handleInputChange('about', 'stat2_desc', e.target.value)}
                        className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-2.5 py-1 text-slate-400 focus:outline-none text-[10px] mt-1"
                        placeholder="Description"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500 font-outfit">Annual Revenue</label>
                      <input
                        type="text"
                        value={tempData.about?.stat3_val || ''}
                        onChange={(e) => handleInputChange('about', 'stat3_val', e.target.value)}
                        className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none text-xs"
                      />
                      <input
                        type="text"
                        value={tempData.about?.stat3_desc || ''}
                        onChange={(e) => handleInputChange('about', 'stat3_desc', e.target.value)}
                        className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-2.5 py-1 text-slate-400 focus:outline-none text-[10px] mt-1"
                        placeholder="Description"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500 font-outfit">Satisfaction</label>
                      <input
                        type="text"
                        value={tempData.about?.stat4_val || ''}
                        onChange={(e) => handleInputChange('about', 'stat4_val', e.target.value)}
                        className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none text-xs"
                      />
                      <input
                        type="text"
                        value={tempData.about?.stat4_desc || ''}
                        onChange={(e) => handleInputChange('about', 'stat4_desc', e.target.value)}
                        className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-2.5 py-1 text-slate-400 focus:outline-none text-[10px] mt-1"
                        placeholder="Description"
                      />
                    </div>
                  </div>
                </div>

                {/* About Main Image Uploader */}
                <div className="space-y-1.5 col-span-1 md:col-span-2 border-t border-white/5 pt-4">
                  <label className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider block">About Section Image</label>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {tempData.about?.image && (
                      <div className="w-24 h-16 rounded-lg overflow-hidden border border-white/10 bg-brand-navy flex-shrink-0">
                        <img src={tempData.about.image?.startsWith('/uploads') ? `https://snt-server.onrender.com${tempData.about.image}` : tempData.about.image} className="w-full h-full object-cover" alt="About img" />
                      </div>
                    )}
                    <div className="flex-grow w-full relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'about', 'image')}
                        disabled={uploadingField === 'about.image'}
                        className="w-full text-slate-400 font-inter text-xs file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-navy file:text-brand-orange hover:file:bg-brand-orange/10 file:cursor-pointer"
                      />
                      {uploadingField === 'about.image' && (
                        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center text-xs text-brand-orange font-bold space-x-1.5">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Uploading image...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ==================== SERVICES EDITOR ==================== */}
          {activeSection === 'services' && (
            <div className="space-y-4">
              <h3 className="font-outfit font-bold text-base text-white border-b border-white/5 pb-3">Services Heading & Content</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">Services Subtitle</label>
                  <input
                    type="text"
                    value={tempData.services?.subtitle || ''}
                    onChange={(e) => handleInputChange('services', 'subtitle', e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-3.5 py-2.5 text-slate-200 focus:outline-none text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">Services Title (Highlight with &)</label>
                  <input
                    type="text"
                    value={tempData.services?.title || ''}
                    onChange={(e) => handleInputChange('services', 'title', e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-3.5 py-2.5 text-slate-200 focus:outline-none text-xs"
                  />
                </div>

                <div className="space-y-1.5 col-span-1 md:col-span-2">
                  <label className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">Section Description</label>
                  <input
                    type="text"
                    value={tempData.services?.description || ''}
                    onChange={(e) => handleInputChange('services', 'description', e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-3.5 py-2.5 text-slate-200 focus:outline-none text-xs"
                  />
                </div>
              </div>

              {/* Editable Services List */}
              <div className="space-y-4 border-t border-white/5 pt-4">
                <h4 className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider block">Service Category Cards</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {(tempData.services?.list || []).map((service, index) => (
                    <div key={index} className="p-4 bg-brand-navy/30 border border-white/5 rounded-xl space-y-3 shadow-md">
                      <span className="text-[10px] font-outfit uppercase font-bold text-brand-orange">Service Category Card {index + 1}</span>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-outfit">Card Title</label>
                        <input
                          type="text"
                          value={service.title || ''}
                          onChange={(e) => handleNestedListChange('services', index, 'title', e.target.value)}
                          className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-outfit">Description</label>
                        <textarea
                          rows="3"
                          value={service.description || ''}
                          onChange={(e) => handleNestedListChange('services', index, 'description', e.target.value)}
                          className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-2.5 py-2 text-slate-300 focus:outline-none text-xs resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================== FLEET EDITOR ==================== */}
          {activeSection === 'fleet' && (
            <div className="space-y-4">
              <h3 className="font-outfit font-bold text-base text-white border-b border-white/5 pb-3">Fleet Layout</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">Fleet Subtitle</label>
                  <input
                    type="text"
                    value={tempData.fleet?.subtitle || ''}
                    onChange={(e) => handleInputChange('fleet', 'subtitle', e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-3.5 py-2.5 text-slate-200 focus:outline-none text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">Fleet Title (Split by \n for gradient highlight)</label>
                  <input
                    type="text"
                    value={tempData.fleet?.title || ''}
                    onChange={(e) => handleInputChange('fleet', 'title', e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-3.5 py-2.5 text-slate-200 focus:outline-none text-xs"
                  />
                </div>

                <div className="space-y-1.5 col-span-1 md:col-span-2">
                  <label className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">Fleet Description</label>
                  <input
                    type="text"
                    value={tempData.fleet?.description || ''}
                    onChange={(e) => handleInputChange('fleet', 'description', e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-3.5 py-2.5 text-slate-200 focus:outline-none text-xs"
                  />
                </div>
              </div>

              {/* Partner Card details */}
              <div className="space-y-4 border-t border-white/5 pt-4">
                <h4 className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider block">Valued Partnership details (Rashmi Group)</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">Card Tag</label>
                    <input
                      type="text"
                      value={tempData.fleet?.partner?.tag || ''}
                      onChange={(e) => setTempData(prev => ({
                        ...prev,
                        fleet: {
                          ...prev.fleet,
                          partner: { ...prev.fleet.partner, tag: e.target.value }
                        }
                      }))}
                      className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-3.5 py-2.5 text-slate-200 focus:outline-none text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">Partner Name</label>
                    <input
                      type="text"
                      value={tempData.fleet?.partner?.name || ''}
                      onChange={(e) => setTempData(prev => ({
                        ...prev,
                        fleet: {
                          ...prev.fleet,
                          partner: { ...prev.fleet.partner, name: e.target.value }
                        }
                      }))}
                      className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-3.5 py-2.5 text-slate-200 focus:outline-none text-xs"
                    />
                  </div>

                  <div className="space-y-1.5 col-span-1 md:col-span-2">
                    <label className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">Billing Description</label>
                    <textarea
                      rows="3"
                      value={tempData.fleet?.partner?.desc || ''}
                      onChange={(e) => setTempData(prev => ({
                        ...prev,
                        fleet: {
                          ...prev.fleet,
                          partner: { ...prev.fleet.partner, desc: e.target.value }
                        }
                      }))}
                      className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-3.5 py-2.5 text-slate-200 focus:outline-none text-xs resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">Billing Stat Value</label>
                    <input
                      type="text"
                      value={tempData.fleet?.partner?.billing || ''}
                      onChange={(e) => setTempData(prev => ({
                        ...prev,
                        fleet: {
                          ...prev.fleet,
                          partner: { ...prev.fleet.partner, billing: e.target.value }
                        }
                      }))}
                      className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-3.5 py-2.5 text-slate-200 focus:outline-none text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">Billing Stat Label</label>
                    <input
                      type="text"
                      value={tempData.fleet?.partner?.label || ''}
                      onChange={(e) => setTempData(prev => ({
                        ...prev,
                        fleet: {
                          ...prev.fleet,
                          partner: { ...prev.fleet.partner, label: e.target.value }
                        }
                      }))}
                      className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-3.5 py-2.5 text-slate-200 focus:outline-none text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== CONTACT EDITOR ==================== */}
          {activeSection === 'contact' && (
            <div className="space-y-4">
              <h3 className="font-outfit font-bold text-base text-white border-b border-white/5 pb-3">Contact details & Address</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">Helpline Title</label>
                  <input
                    type="text"
                    value={tempData.contact?.helplinesTitle || ''}
                    onChange={(e) => handleInputChange('contact', 'helplinesTitle', e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-3.5 py-2.5 text-slate-200 focus:outline-none text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">Contact Persons</label>
                  <input
                    type="text"
                    value={tempData.contact?.contactPersons || ''}
                    onChange={(e) => handleInputChange('contact', 'contactPersons', e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-3.5 py-2.5 text-slate-200 focus:outline-none text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">Helpline Mobile 1</label>
                  <input
                    type="text"
                    value={tempData.contact?.phone1 || ''}
                    onChange={(e) => handleInputChange('contact', 'phone1', e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-3.5 py-2.5 text-slate-200 focus:outline-none text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">Helpline Mobile 2</label>
                  <input
                    type="text"
                    value={tempData.contact?.phone2 || ''}
                    onChange={(e) => handleInputChange('contact', 'phone2', e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-3.5 py-2.5 text-slate-200 focus:outline-none text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">Helpline Mobile 3</label>
                  <input
                    type="text"
                    value={tempData.contact?.phone3 || ''}
                    onChange={(e) => handleInputChange('contact', 'phone3', e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-3.5 py-2.5 text-slate-200 focus:outline-none text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">WhatsApp Prefill Text</label>
                  <input
                    type="text"
                    value={tempData.contact?.whatsappPrefill || ''}
                    onChange={(e) => handleInputChange('contact', 'whatsappPrefill', e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-3.5 py-2.5 text-slate-200 focus:outline-none text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">Corporate Email Address</label>
                  <input
                    type="email"
                    value={tempData.contact?.email || ''}
                    onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-3.5 py-2.5 text-slate-200 focus:outline-none text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">Website URL</label>
                  <input
                    type="text"
                    value={tempData.contact?.website || ''}
                    onChange={(e) => handleInputChange('contact', 'website', e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-3.5 py-2.5 text-slate-200 focus:outline-none text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Office Title</label>
                  <input
                    type="text"
                    value={tempData.contact?.registeredOfficeTitle || ''}
                    onChange={(e) => handleInputChange('contact', 'registeredOfficeTitle', e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-3.5 py-2.5 text-slate-200 focus:outline-none text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">Workshop Office Title</label>
                  <input
                    type="text"
                    value={tempData.contact?.workshopOfficeTitle || ''}
                    onChange={(e) => handleInputChange('contact', 'workshopOfficeTitle', e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-3.5 py-2.5 text-slate-200 focus:outline-none text-xs"
                  />
                </div>

                <div className="space-y-1.5 col-span-1 md:col-span-2">
                  <label className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Address Content (Use \n for newlines)</label>
                  <textarea
                    rows="3"
                    value={tempData.contact?.registeredOfficeAddress || ''}
                    onChange={(e) => handleInputChange('contact', 'registeredOfficeAddress', e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-3.5 py-2.5 text-slate-200 focus:outline-none text-xs resize-none"
                  />
                </div>

                <div className="space-y-1.5 col-span-1 md:col-span-2">
                  <label className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">Workshop Address Content (Use \n for newlines)</label>
                  <textarea
                    rows="3"
                    value={tempData.contact?.workshopOfficeAddress || ''}
                    onChange={(e) => handleInputChange('contact', 'workshopOfficeAddress', e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-3.5 py-2.5 text-slate-200 focus:outline-none text-xs resize-none"
                  />
                </div>

                <div className="space-y-1.5 col-span-1 md:col-span-2 border-t border-white/5 pt-4">
                  <label className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">Google Maps Address Coordinates (Or Business Name)</label>
                  <input
                    type="text"
                    value={tempData.contact?.mapQ || ''}
                    onChange={(e) => handleInputChange('contact', 'mapQ', e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-3.5 py-2.5 text-slate-200 focus:outline-none text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ==================== FOOTER EDITOR ==================== */}
          {activeSection === 'footer' && (
            <div className="space-y-4">
              <h3 className="font-outfit font-bold text-base text-white border-b border-white/5 pb-3">Footer Configuration</h3>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                  <label className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">About Company Brand Title</label>
                  <input
                    type="text"
                    value={tempData.footer?.aboutTitle || ''}
                    onChange={(e) => handleInputChange('footer', 'aboutTitle', e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-3.5 py-2.5 text-slate-200 focus:outline-none text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">About Company Short Description</label>
                  <textarea
                    rows="3"
                    value={tempData.footer?.aboutDesc || ''}
                    onChange={(e) => handleInputChange('footer', 'aboutDesc', e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-3.5 py-2.5 text-slate-200 focus:outline-none text-xs resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">Copyright Label</label>
                  <input
                    type="text"
                    value={tempData.footer?.copyrightText || ''}
                    onChange={(e) => handleInputChange('footer', 'copyrightText', e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-3.5 py-2.5 text-slate-200 focus:outline-none text-xs"
                  />
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
