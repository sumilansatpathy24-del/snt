import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Trash2, Image as ImageIcon, Loader2, CheckCircle2, AlertCircle, Eye } from 'lucide-react';

const categories = [
  'Awards & Recognition',
  'Events',
  'Business Promotion',
  'Team Activities',
  'Industrial Operations',
  'Fleet Showcase'
];

export default function GalleryManager({ galleryItems = [], onUploadSuccess, onDeleteSuccess }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check size limit (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image file must be under 10MB.');
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    // Check type limit
    if (!file.type.startsWith('image/')) {
      setError('Only image files (JPG, PNG, GIF, WEBP) are allowed.');
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError('');
  };

  // Clean up object URL when component unmounts to prevent memory leak
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !imageFile) {
      setError('Title and image file are required.');
      return;
    }

    const token = localStorage.getItem('adminToken');
    if (!token) return;

    setUploading(true);
    setError('');
    setSuccess(false);

    const uploadData = new FormData();
    uploadData.append('title', title);
    uploadData.append('category', category);
    uploadData.append('image', imageFile);

    try {
      const res = await fetch('/api/gallery/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: uploadData
      });

      let data = {};
      try {
        data = await res.json();
      } catch (jsonErr) {
        throw new Error('Invalid server response');
      }

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Failed to upload photo');
      }

      setSuccess(true);
      setTitle('');
      setImageFile(null);
      setImagePreview(null);
      // Reset input element
      const fileInput = document.getElementById('gallery-file-input');
      if (fileInput) fileInput.value = '';

      if (onUploadSuccess) onUploadSuccess();

      // Clear success toast after 4s
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      console.error('[Admin Gallery Upload Error]:', err);
      setError(err.message || 'An error occurred during image upload.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    if (!window.confirm('Are you sure you want to permanently delete this photo?')) {
      return;
    }

    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      let data = {};
      try {
        data = await res.json();
      } catch (jsonErr) {}

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Failed to delete photo');
      }

      if (onDeleteSuccess) onDeleteSuccess(id);
    } catch (err) {
      console.error('[Admin Gallery Delete Error]:', err);
      alert(err.message || 'An error occurred while deleting the photo.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div>
        <h2 className="font-outfit font-black text-xl md:text-2xl text-white">
          Gallery Management Panel
        </h2>
        <p className="text-xs text-slate-400 font-inter mt-1">
          Upload operation milestones, company events photos, and manage corporate media cards instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Upload Form (Left Column, 5 cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-xl border border-white/5 space-y-5">
          <h3 className="font-outfit font-bold text-base text-white border-b border-white/5 pb-3">
            Publish New Photo
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center space-x-2.5 text-red-400 text-xs font-inter font-medium">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3.5 bg-brand-orange/10 border border-brand-orange/20 rounded-lg flex items-center space-x-2.5 text-brand-orange text-xs font-inter font-medium">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Photo published successfully and added to the gallery!</span>
              </div>
            )}

            {/* Photo Title */}
            <div className="space-y-1.5">
              <label className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">
                Photo Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Slag Transport Operations"
                className="w-full bg-[#0a0f1d] border border-white/10 focus:border-brand-orange rounded-lg px-3.5 py-2.5 text-slate-200 focus:outline-none text-xs font-inter transition-colors"
                required
                disabled={uploading}
              />
            </div>

            {/* Gallery Category Dropdown */}
            <div className="space-y-1.5">
              <label className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">
                Operations Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#0b1528] border border-white/10 focus:border-brand-orange rounded-lg px-3.5 py-2.5 text-slate-200 focus:outline-none text-xs font-outfit transition-colors"
                disabled={uploading}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Image File Selector */}
            <div className="space-y-1.5">
              <label className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Select Image File (Max 10MB)
              </label>
              <input
                id="gallery-file-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="w-full text-slate-400 font-inter text-xs file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-navy file:text-brand-orange hover:file:bg-brand-orange/10 file:cursor-pointer"
                required
              />
            </div>

            {/* Live Image Preview Component */}
            {imagePreview && (
              <div className="space-y-1.5">
                <span className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Image Preview
                </span>
                <div className="relative h-44 rounded-lg overflow-hidden border border-white/10 shadow-lg bg-brand-navy flex items-center justify-center">
                  <img
                    src={imagePreview}
                    alt="Preview upload"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 p-1.5 rounded-md bg-black/60 text-white text-[10px] font-outfit font-bold uppercase tracking-wider flex items-center space-x-1 backdrop-blur-sm border border-white/5">
                    <Eye className="w-3.5 h-3.5 text-brand-orange" />
                    <span>Upload Ready</span>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-brand-orange/20 hover:bg-brand-orange border border-brand-orange/30 text-white font-outfit font-bold uppercase py-3 rounded-lg text-xs flex items-center justify-center space-x-2 tracking-wider transition-colors"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading Image...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Publish to Gallery</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Gallery Grid Manager List (Right Column, 7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <h3 className="font-outfit font-bold text-base text-white border-b border-white/5 pb-3 flex justify-between items-center">
            <span>Published Media Library</span>
            <span className="bg-brand-navy border border-white/5 text-slate-400 px-2.5 py-0.5 rounded-lg text-[10px] font-outfit font-black">
              {galleryItems.length} photos
            </span>
          </h3>

          {galleryItems.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-white/10 rounded-xl p-8 max-w-md mx-auto space-y-3">
              <ImageIcon className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="font-outfit font-bold text-white text-base">Media Library Empty</h4>
              <p className="text-xs text-slate-500 font-inter">
                There are no published photos. Initial seed photos will seed on server launch if database is reset.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-1 select-none scrollbar-none">
              {galleryItems.map((item) => (
                <div 
                  key={item.id} 
                  className="glass-panel rounded-xl overflow-hidden border border-white/5 hover:border-brand-orange/20 flex flex-col justify-between shadow-md relative group transition-all duration-300"
                >
                  <div className="relative h-28 overflow-hidden bg-brand-navy">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                      loading="lazy"
                    />
                    
                    {/* Hover delete trash trigger */}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="absolute top-2 right-2 p-1.5 bg-red-600/90 hover:bg-red-700 text-white rounded-lg transition-colors shadow backdrop-blur-sm border border-red-500/10 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100"
                      title="Permanently Delete Image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    
                    {/* Category overlay */}
                    <div className="absolute inset-0 bg-[#020617]/50 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />
                  </div>
                  <div className="p-3 space-y-1">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-brand-orange block font-outfit leading-none">
                      {item.category}
                    </span>
                    <h4 className="font-outfit font-bold text-white text-xs line-clamp-1 leading-tight">
                      {item.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
