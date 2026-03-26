import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { projectService } from '../../services/projectService';
import { pageTransition, fadeUp } from '../../utils/animations';
import MagneticButton from '../../components/ui/MagneticButton';
import ProjectForm from '../../components/admin/ProjectForm';
import './Dashboard.css';

const CATEGORIES = ['All', 'Social Media', 'Motion Graphics', 'YouTube', 'Short-Form'];

export default function Dashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Editor State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (error) {
      console.error("Failed to load projects", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const handleAddNew = () => {
    setEditingProject(null);
    setIsFormOpen(true);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleDelete = async (id, imageUrl) => {
    if (window.confirm('Are you sure you want to delete this project? This cannot be undone.')) {
      try {
        await projectService.deleteProject(id, imageUrl);
        fetchProjects(); // Refresh list
      } catch (error) {
        console.error("Failed to delete", error);
        alert('Failed to delete project. Check console for details.');
      }
    }
  };

  const handleFormSubmit = async (formData, imageFile) => {
    try {
      if (editingProject) {
        await projectService.updateProject(editingProject.id, formData, imageFile, editingProject.imageUrl);
      } else {
        await projectService.addProject(formData, imageFile);
      }
      setIsFormOpen(false);
      fetchProjects(); // Refresh list
    } catch (error) {
      console.error("Submission failed", error);
      alert('Failed to save project. Ensure your image is not too large.');
    }
  };

  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  const headerAnim = fadeUp(0.1, 0.8, 30);

  return (
    <motion.main className="admin-dashboard-page" {...pageTransition}>
      <div className="container">
        
        <motion.div 
          className="dashboard-header"
          initial={headerAnim.initial}
          animate={headerAnim.animate}
          transition={headerAnim.transition}
        >
          <div className="dashboard-header__content">
            <h1>CMS Dashboard</h1>
            <p>Manage your portfolio projects, categories, and home page showcases.</p>
          </div>
          
          <div className="dashboard-header__actions">
            <MagneticButton>
              <button className="btn-add" onClick={handleAddNew}>
                + Add Project
              </button>
            </MagneticButton>

            <MagneticButton>
              <button className="btn-logout" onClick={handleLogout}>
                Sign Out
              </button>
            </MagneticButton>
          </div>
        </motion.div>

        <div className="dashboard-tabs">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`dashboard-tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="dashboard-content">
          {loading ? (
            <div className="dashboard-loading">Loading your portfolio...</div>
          ) : filteredProjects.length === 0 ? (
            <div className="dashboard-empty">
              <p>No projects found in this category.</p>
              <button onClick={handleAddNew} className="btn-outline mt-4">Add your first project</button>
            </div>
          ) : (
            <div className="project-grid">
              <AnimatePresence>
                {filteredProjects.map((project) => (
                  <motion.div 
                    key={project.id}
                    className="admin-project-card glass"
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="card-image" style={{ backgroundColor: project.color }}>
                      {project.imageUrl && <img src={project.imageUrl} alt={project.title} />}
                      <div className="card-actions">
                        <button onClick={() => handleEdit(project)} className="btn-icon edit">Edit</button>
                        <button onClick={() => handleDelete(project.id, project.imageUrl)} className="btn-icon delete">Delete</button>
                      </div>
                      
                      {project.isFavorite && (
                        <div className="favorite-badge">
                          ★ Slot {project.showcaseSlot}
                        </div>
                      )}
                    </div>
                    
                    <div className="card-info">
                      <div className="card-meta">
                        <span className="card-category">{project.category}</span>
                        <span className="card-year">{project.year}</span>
                      </div>
                      <h3>{project.title}</h3>
                      {project.projectUrl && (
                        <a href={project.projectUrl} target="_blank" rel="noreferrer" className="card-link">
                          View Link ↗
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

      </div>

      <AnimatePresence>
        {isFormOpen && (
          <ProjectForm 
            initialData={editingProject} 
            onSubmit={handleFormSubmit} 
            onClose={() => setIsFormOpen(false)} 
          />
        )}
      </AnimatePresence>
    </motion.main>
  );
}
