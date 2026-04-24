import { db, storage } from '../firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy,
  serverTimestamp,
  getDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { useSiteStore } from '../stores/siteStore';

const COLLECTION_NAME = 'projects';

// Security utility functions
const validateProjectData = (projectData) => {
  const requiredFields = ['title', 'description', 'category'];
  const errors = [];
  
  requiredFields.forEach(field => {
    if (!projectData[field] || projectData[field].trim() === '') {
      errors.push(`${field} is required`);
    }
  });
  
  if (projectData.category && !['Social Media', 'Motion Graphics', 'YouTube', 'Short-Form'].includes(projectData.category)) {
    errors.push('Invalid category');
  }
  
  return errors;
};

const sanitizeFileName = (fileName) => {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
};

export const projectService = {
  // Fetch all projects, ordered by newest first
  async getProjects() {
    if (!db) {
      console.warn('Firebase Firestore not configured');
      return [];
    }
    
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const projects = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Update global store with fetched projects
      useSiteStore.getState().updateSiteData({ portfolio: { ...useSiteStore.getState().portfolio, projects } });
      
      return projects;
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw new Error('Failed to fetch projects. Please try again later.');
    }
  },

  // Fetch a single project by ID
  async getProjectById(id) {
    if (!db) {
      throw new Error('Firebase Firestore not configured');
    }
    
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error('Project not found');
      }
    } catch (error) {
      console.error("Error fetching project:", error);
      throw new Error('Failed to fetch project. Please try again later.');
    }
  },

  // Add a new project
  async addProject(projectData, imageFile) {
    if (!db) {
      throw new Error('Firebase Firestore not configured');
    }
    
    // Validate project data
    const validationErrors = validateProjectData(projectData);
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }
    
    try {
      let imageUrl = '';
      if (imageFile) {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
        if (!allowedTypes.includes(imageFile.type)) {
          throw new Error('Invalid file type. Please upload a JPEG, PNG, WEBP, or AVIF image.');
        }
        
        // Validate file size (max 10MB)
        if (imageFile.size > 10 * 1024 * 1024) {
          throw new Error('File too large. Maximum file size is 10MB.');
        }
        
        imageUrl = await this.uploadImage(imageFile);
      }

      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...projectData,
        imageUrl,
        timestamp: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Add project to global store
      useSiteStore.getState().addProject({ id: docRef.id, ...projectData, imageUrl });
      
      return docRef.id;
    } catch (error) {
      console.error("Error adding project:", error);
      throw new Error(`Failed to add project: ${error.message || 'Unknown error'}`);
    }
  },

  // Update an existing project
  async updateProject(id, projectData, newImageFile, oldImageUrl) {
    if (!db) {
      throw new Error('Firebase Firestore not configured');
    }
    
    // Validate project data
    const validationErrors = validateProjectData(projectData);
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }
    
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      let imageUrl = projectData.imageUrl;

      if (newImageFile) {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
        if (!allowedTypes.includes(newImageFile.type)) {
          throw new Error('Invalid file type. Please upload a JPEG, PNG, WEBP, or AVIF image.');
        }
        
        // Validate file size (max 10MB)
        if (newImageFile.size > 10 * 1024 * 1024) {
          throw new Error('File too large. Maximum file size is 10MB.');
        }
        
        imageUrl = await this.uploadImage(newImageFile);
        if (oldImageUrl) {
          await this.deleteImage(oldImageUrl);
        }
      }

      await updateDoc(docRef, {
        ...projectData,
        imageUrl,
        updatedAt: serverTimestamp()
      });
      
      // Update project in global store
      useSiteStore.getState().updateProject(id, { ...projectData, imageUrl });
    } catch (error) {
      console.error("Error updating project:", error);
      throw new Error(`Failed to update project: ${error.message || 'Unknown error'}`);
    }
  },

  // Delete a project
  async deleteProject(id, imageUrl) {
    if (!db) {
      throw new Error('Firebase Firestore not configured');
    }
    
    try {
      if (imageUrl) {
        await this.deleteImage(imageUrl);
      }
      await deleteDoc(doc(db, COLLECTION_NAME, id));
      
      // Remove project from global store
      useSiteStore.getState().removeProject(id);
    } catch (error) {
      console.error("Error deleting project:", error);
      throw new Error(`Failed to delete project: ${error.message || 'Unknown error'}`);
    }
  },

  // Upload an image to Firebase Storage
  async uploadImage(file) {
    if (!storage) {
      throw new Error('Firebase Storage not configured');
    }
    if (!file) return null;
    
    try {
      const sanitizedFileName = sanitizeFileName(file.name);
      const storageRef = ref(storage, `projects/${Date.now()}_${sanitizedFileName}`);
      await uploadBytes(storageRef, file);
      return getDownloadURL(storageRef);
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error(`Failed to upload image: ${error.message || 'Unknown error'}`);
    }
  },

  // Delete an image from Firebase Storage
  async deleteImage(imageUrl) {
    if (!storage) {
      console.warn('Firebase Storage not configured');
      return;
    }
    if (!imageUrl) return;
    
    try {
      const decodedUrl = decodeURIComponent(imageUrl.split('/o/')[1].split('?')[0]);
      const storageRef = ref(storage, decodedUrl);
      await deleteObject(storageRef);
    } catch (error) {
      console.error("Error deleting image from storage:", error);
      // Don't throw error here as we want to continue with project deletion
    }
  }
};
