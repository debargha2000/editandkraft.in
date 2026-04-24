import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
// ⚠️ THIS IMPORT IS CRITICAL:
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { projectService } from '../../services/projectService';
import { FirebaseErrorHandler } from '../../utils/firebaseError';
import { pageTransition, fadeUp } from '../../utils/animations';
import ProjectForm from '../../components/admin/ProjectForm';
import MagneticButton from '../../components/ui/MagneticButton';
import './Dashboard.css';

// RBAC Permissions (Hardcoded for simplicity in this turn)
const ADMIN_PERMISSIONS = {
  MANAGE_PROJECTS: 'manage_projects',
  CREATE_PROJECT: 'create_project',
  UPDATE_PROJECT: 'update_project',
  DELETE_PROJECT: 'delete_project',
  MANAGE_USERS: 'manage_users'
};

const USER_ROLES = {
  ADMIN: {
    name: 'Admin',
    permissions: [
      ADMIN_PERMISSIONS.MANAGE_PROJECTS,
      ADMIN_PERMISSIONS.CREATE_PROJECT,
      ADMIN_PERMISSIONS.UPDATE_PROJECT,
      ADMIN_PERMISSIONS.DELETE_PROJECT
    ]
  }
};

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Simple RBAC check
  const hasPermission = useCallback((permission) => {
    // For this build, if you're in the dashboard, you're an admin
    return USER_ROLES.ADMIN.permissions.includes(permission);
  }, []);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (error) {
      FirebaseErrorHandler.handle(error, 'fetching projects');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin/login');
    } catch (error) {
      console.error("Logout error:", error);
      FirebaseErrorHandler.handle(error, 'logging out');
    }
  };

  const handleAddProject = () => {
    if (!hasPermission(ADMIN_PERMISSIONS.CREATE_PROJECT)) {
      alert("You don't have permission to create projects.");
      return;
    }
    setEditingProject(null);
    setIsFormOpen(true);
  };

  const handleEditProject = (project) => {
    if (!hasPermission(ADMIN_PERMISSIONS.UPDATE_PROJECT)) {
      alert("You don't have permission to edit projects.");
      return;
    }
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleDeleteProject = async (id, imageUrl) => {
    if (!hasPermission(ADMIN_PERMISSIONS.DELETE_PROJECT)) {
      alert("You don't have permission to delete projects.");
      return;
    }
    
    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      try {
        await projectService.deleteProject(id, imageUrl);
        setProjects(projects.filter(p => p.id !== id));
      } catch (error) {
        FirebaseErrorHandler.handle(error, 'deleting project');
      }
    }
  };

  const handleFormSubmit = async (formData, imageFile) => {
    try {
      if (editingProject) {
        await projectService.updateProject(editingProject.id, formData, imageFile, editingProject.imageUrl);
      } else {
        await projectService.createProject(formData, imageFile);
      }
      setIsFormOpen(false);
      fetchProjects();
    } catch (error) {
      FirebaseErrorHandler.handle(error, 'saving project');
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(p => 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [projects, searchQuery]);

  const stats = useMemo(() => ({
    total: projects.length,
    favorites: projects.filter(p => p.isFavorite).length,
    recent: projects.filter(p => {
      const date = p.createdAt?.toDate ? p.createdAt.toDate() : new Date(p.createdAt);
      return new Date() - date < 7 * 24 * 60 * 60 * 1000;
    }).length
  }), [projects]);

  return (
    <motion.main className="admin-dashboard container" {...pageTransition}>
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Work CMS</h1>
          <p>Logged in as {auth.currentUser?.email}</p>
        </div>
        <div className="header-right">
          <MagneticButton>
            <button className="button logout-btn" onClick={handleLogout}>Logout</button>
          </MagneticButton>
          <MagneticButton>
            <button className="button button--primary add-btn" onClick={handleAddProject}>+ New Project</button>
          </MagneticButton>
        </div>
      </header>

      {/* Quick Stats */}
      <section className="dashboard-stats">
        {[
          { label: 'Total Projects', value: stats.total, icon: '📂' },
          { label: 'Showcase Items', value: stats.favorites, icon: '⭐️' },
          { label: 'Active Category', value: 'Creative', icon: '🎨' }
        ].map((s, i) => {
          const anim = fadeUp(0.1 + i * 0.1, 0.6, 20);
          return (
            <motion.div key={s.label} className="stat-card glass" {...anim}>
              <span className="stat-icon">{s.icon}</span>
              <div className="stat-info">
                <span className="stat-label">{s.label}</span>
                <span className="stat-value">{s.value}</span>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* Projects List */}
      <section className="dashboard-projects">
        <div className="projects-controls">
          <div className="search-bar glass">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Search projects by title, client, or category..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="projects-table-wrapper glass">
          {loading ? (
            <div className="loader-container">
              <div className="minimal-loader"></div>
              <p>Fetching projects from Firestore...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="empty-state">
              <p>No projects found. Click "New Project" to get started.</p>
            </div>
          ) : (
            <table className="projects-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Category</th>
                  <th>Showcase</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {filteredProjects.map((project, i) => (
                    <motion.tr 
                      key={project.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <td>
                        <div className="project-cell">
                          <div 
                            className="project-thumb" 
                            style={{ backgroundColor: project.color || '#1a1a1a' }}
                          >
                            {project.imageUrl && <img src={project.imageUrl} alt="" />}
                          </div>
                          <div className="project-names">
                            <span className="project-title-cell">{project.title}</span>
                            <span className="project-client-cell">{project.client}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="category-badge">{project.category}</span>
                      </td>
                      <td>
                        {project.isFavorite ? (
                          <span className="showcase-badge">
                            Slot {project.showcaseSlot}
                          </span>
                        ) : (
                          <span className="no-showcase">—</span>
                        )}
                      </td>
                      <td className="actions-cell">
                        <button className="action-btn" onClick={() => handleEditProject(project)} title="Edit">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        <button className="action-btn delete" onClick={() => handleDeleteProject(project.id, project.imageUrl)} title="Delete">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Project Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <ProjectForm 
            initialData={editingProject}
            onClose={() => setIsFormOpen(false)}
            onSubmit={handleFormSubmit}
            hasPermission={hasPermission}
            permissions={ADMIN_PERMISSIONS}
          />
        )}
      </AnimatePresence>
    </motion.main>
  );
}
