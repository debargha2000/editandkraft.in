import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MagneticButton from '../ui/MagneticButton';
import './ProjectForm.css';

const CATEGORIES = ['Social Media', 'Motion Graphics', 'YouTube', 'Short-Form'];
const SHOWCASE_SLOTS = [
  { id: 1, label: 'Slot 1 (Left Large)' },
  { id: 2, label: 'Slot 2 (Top Right)' },
  { id: 3, label: 'Slot 3 (Middle Right)' },
  { id: 4, label: 'Slot 4 (Bottom Right)' },
  { id: 5, label: 'Slot 5 (Bottom Left)' },
  { id: 6, label: 'Slot 6 (Bottom Center)' }
];

export default function ProjectForm({ initialData = null, onSubmit, onClose, hasPermission, permissions }) {
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    year: new Date().getFullYear().toString(),
    description: '',
    projectUrl: '',
    category: CATEGORIES[0],
    color: '#1a1a1a',
    isFavorite: false,
    showcaseSlot: 1,
    showcaseLabel: ''
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        client: initialData.client || '',
        year: initialData.year || new Date().getFullYear().toString(),
        description: initialData.description || '',
        projectUrl: initialData.projectUrl || '',
        category: initialData.category || CATEGORIES[0],
        color: initialData.color || '#1a1a1a',
        isFavorite: initialData.isFavorite || false,
        showcaseSlot: initialData.showcaseSlot || 1,
        showcaseLabel: initialData.showcaseLabel || ''
      });
      if (initialData.imageUrl) {
        setImagePreview(initialData.imageUrl);
      }
    }
  }, [initialData]);

  // Sync showcase label with description if not manually edited yet
  useEffect(() => {
    if (!initialData && formData.description && !formData.showcaseLabel) {
      setFormData(prev => ({ ...prev, showcaseLabel: prev.description }));
    }
  }, [formData.description, initialData, formData.showcaseLabel]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check permissions before submitting
    if (initialData && !hasPermission(permissions.UPDATE_PROJECT)) {
      alert('You do not have permission to update projects.');
      return;
    }
    if (!initialData && !hasPermission(permissions.CREATE_PROJECT)) {
      alert('You do not have permission to create projects.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData, imageFile);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="project-form-overlay">
      <motion.div 
        className="project-form-modal glass"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
      >
        <div className="form-header">
          <h2>{initialData ? 'Edit Project' : 'Add New Project'}</h2>
          <button type="button" className="close-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="project-form">
          <div className="form-row">
            <div className="form-group flex-2">
              <label>Project Title</label>
              <input 
                type="text" 
                name="title" 
                required 
                value={formData.title} 
                onChange={handleChange} 
                placeholder="e.g. Viral Series - 50M Views" 
              />
            </div>
            <div className="form-group flex-1">
              <label>Client</label>
              <input 
                type="text" 
                name="client" 
                value={formData.client} 
                onChange={handleChange} 
                placeholder="e.g. Luxury Brand" 
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="form-group flex-1">
              <label>Year</label>
              <input 
                type="text" 
                name="year" 
                required 
                value={formData.year} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Project URL (Link to content)</label>
            <input 
              type="url" 
              name="projectUrl" 
              value={formData.projectUrl} 
              onChange={handleChange} 
              placeholder="https://youtube.com/..." 
            />
          </div>

          <div className="form-group">
            <label>Main Description (Shown on Work page)</label>
            <textarea 
              name="description" 
              required 
              rows="3" 
              value={formData.description} 
              onChange={handleChange} 
              placeholder="Detailed description of the project..."
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Brand Color (Card Background)</label>
              <div className="color-picker-wrapper">
                <input 
                  type="color" 
                  name="color" 
                  value={formData.color} 
                  onChange={handleChange} 
                />
                <span className="color-hex">{formData.color}</span>
              </div>
            </div>
            
            <div className="form-group flex-2">
              <label>Thumbnail Media (Image/Video Placeholder)</label>
              <div className="file-upload">
                <label className="file-upload-label">
                  <input type="file" accept="image/*" onChange={handleImageChange} />
                  <span>{imageFile ? imageFile.name : 'Choose an image'}</span>
                </label>
              </div>
            </div>
          </div>

          {imagePreview && (
            <div className="image-preview" style={{ backgroundColor: formData.color }}>
              <img src={imagePreview} alt="Preview" />
            </div>
          )}

          <div className="showcase-section glass">
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  name="isFavorite" 
                  checked={formData.isFavorite} 
                  onChange={handleChange} 
                />
                <span className="custom-checkbox"></span>
                <strong>Favorite (Show on Home Page Showcase)</strong>
              </label>
              <p className="help-text">If checked, this project will appear in the "Selected Work" section on the home page.</p>
            </div>

            <AnimatePresence>
              {formData.isFavorite && (
                <motion.div 
                  className="showcase-options"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <div className="form-row">
                    <div className="form-group flex-1">
                      <label>Home Page Slot (1-6)</label>
                      <select name="showcaseSlot" value={formData.showcaseSlot} onChange={handleChange}>
                        {SHOWCASE_SLOTS.map(slot => (
                          <option key={slot.id} value={slot.id}>{slot.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Home Page Overlay Title/Label</label>
                    <input 
                      type="text" 
                      name="showcaseLabel" 
                      value={formData.showcaseLabel} 
                      onChange={handleChange} 
                      placeholder="e.g. Creator Empire — Reel" 
                    />
                    <p className="help-text">This label forms the typography overlay strictly on the home page layout. It won't alter the description on the actual portfolio page.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <MagneticButton>
              <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : (initialData ? 'Update Project' : 'Save Project')}
              </button>
            </MagneticButton>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
