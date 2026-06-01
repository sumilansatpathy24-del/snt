import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon, Loader2 } from 'lucide-react';

const categories = [
  'All Photos',
  'Awards & Recognition',
  'Events',
  'Business Promotion',
  'Team Activities',
  'Industrial Operations',
  'Fleet Showcase'
];

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All Photos');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/gallery');

      if (!response.ok) {
        throw new Error('API failed');
      }

      const data = await response.json();

      console.log('Fetched gallery data:', data);

      if (!Array.isArray(data)) {
        throw new Error('Invalid gallery response');
      }

      localStorage.setItem(
        'galleryImages',
        JSON.stringify(data)
      );

      setImages(data);
      setError(null);
    } catch (error) {
      console.error(error);

      const fallback =
        JSON.parse(localStorage.getItem('galleryImages')) || [];

      console.log('Fetched gallery data:', fallback);

      setImages(fallback);
      
      if (fallback.length === 0) {
        setError(error.message || 'API failed');
      } else {
        setError(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = selectedCategory === 'All Photos'
    ? images
    : images.filter(img => img.category === selectedCategory);

  const openLightbox = (index) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const navigateLightbox = (direction) => {
    if (lightboxIndex === null) return;
    let nextIndex = lightboxIndex + direction;
    if (nextIndex < 0) {
      nextIndex = filteredImages.length - 1;
    } else if (nextIndex >= filteredImages.length) {
      nextIndex = 0;
    }
    setLightboxIndex(nextIndex);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredImages]);

  return (
    <section className="relative py-24 md:py-32 bg-[#020617] min-h-screen overflow-hidden pt-28">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-[0.03] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-brand-orange font-outfit text-sm font-bold uppercase tracking-wider block">
            Media & Operations
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold font-outfit text-white tracking-tight leading-tight">
            Corporate <span className="orange-gradient-text text-glow">Gallery</span>
          </h1>
          <p className="text-slate-400 font-inter text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Take a look at our heavy transport operations, company milestones, events, and operational excellence.
          </p>
        </div>

        {/* Filter Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`relative px-4 py-2 rounded-lg font-outfit text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                selectedCategory === category
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-200 bg-brand-navy/40 border border-white/5'
              }`}
            >
              <span className="relative z-10">{category}</span>
              {selectedCategory === category && (
                <motion.div
                  layoutId="activeGalleryFilter"
                  className="absolute inset-0 bg-gradient-to-r from-brand-orange to-brand-orangeLight rounded-lg shadow-glow-orange border border-brand-orange/20"
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="w-10 h-10 text-brand-orange animate-spin" />
            <p className="text-slate-400 font-inter text-sm">Loading gallery assets...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 glass-panel rounded-2xl border border-red-500/10 max-w-lg mx-auto p-8 space-y-4">
            <p className="text-red-400 font-medium font-outfit">Error Loading Images</p>
            <p className="text-slate-400 font-inter text-sm">{error}</p>
            <button
              onClick={fetchGallery}
              className="px-5 py-2 bg-brand-orange/20 hover:bg-brand-orange border border-brand-orange/40 text-white rounded-lg text-sm font-bold transition-all"
            >
              Try Again
            </button>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-24 glass-panel rounded-2xl border border-white/5 max-w-md mx-auto p-10 flex flex-col items-center space-y-4">
            <div className="p-4 rounded-full bg-brand-navy text-slate-500">
              <ImageIcon className="w-10 h-10" />
            </div>
            <h3 className="font-outfit font-bold text-white text-lg">No Images Available</h3>
            <p className="text-slate-400 font-inter text-sm">There are no uploaded photos available under this category yet.</p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredImages.map((img, index) => (
                <motion.div
                  key={img.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => openLightbox(index)}
                  className="glass-panel rounded-xl overflow-hidden group border border-white/5 hover:border-brand-orange/20 transition-all duration-300 shadow-lg cursor-pointer"
                >
                  <div className="relative h-64 overflow-hidden bg-brand-navy">
                    <img
                      src={img.imageUrl}
                      alt={img.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/90 via-[#020617]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-1 flex flex-col justify-end p-5" />
                    
                    {/* Hover text */}
                    <div className="absolute bottom-0 left-0 w-full p-5 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-brand-orange font-outfit">
                        {img.category}
                      </span>
                      <h3 className="font-outfit font-extrabold text-white text-base mt-1 line-clamp-1">
                        {img.title}
                      </h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Fullscreen Lightbox Overlay */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 z-50 p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation buttons */}
            {filteredImages.length > 1 && (
              <>
                <button
                  onClick={() => navigateLightbox(-1)}
                  className="absolute left-6 z-50 p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10"
                  aria-label="Previous Image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => navigateLightbox(1)}
                  className="absolute right-6 z-50 p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10"
                  aria-label="Next Image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Image display */}
            <div className="relative max-w-5xl max-h-[85vh] w-full h-full flex flex-col items-center justify-center">
              <motion.img
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                src={filteredImages[lightboxIndex].imageUrl}
                alt={filteredImages[lightboxIndex].title}
                className="max-w-full max-h-[75vh] object-contain rounded-lg border border-white/5"
              />
              
              {/* Lightbox Meta */}
              <div className="text-center mt-6 space-y-1">
                <span className="text-xs uppercase font-bold tracking-widest text-brand-orange font-outfit">
                  {filteredImages[lightboxIndex].category}
                </span>
                <h2 className="text-white font-outfit font-extrabold text-lg md:text-xl">
                  {filteredImages[lightboxIndex].title}
                </h2>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
