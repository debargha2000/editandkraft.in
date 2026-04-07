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
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { useSiteStore } from '../stores/siteStore';

const COLLECTION_NAME = 'projects';

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
      throw error;
    }
  },

  // Add a new project
  async addProject(projectData, imageFile) {
    if (!db) {
      throw new Error('Firebase Firestore not configured');
    }
    
    try {
      let imageUrl = '';
      if (imageFile) {
        imageUrl = await this.uploadImage(imageFile);
      }

      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...projectData,
        imageUrl,
        timestamp: serverTimestamp()
      });
      
      // Add project to global store
      useSiteStore.getState().addProject({ id: docRef.id, ...projectData, imageUrl });
      
      return docRef.id;
    } catch (error) {
      console.error("Error adding project:", error);
      throw error;
    }
  },

  // Update an existing project
  async updateProject(id, projectData, newImageFile, oldImageUrl) {
    if (!db) {
      throw new Error('Firebase Firestore not configured');
    }
    
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      let imageUrl = projectData.imageUrl;

      if (newImageFile) {
        imageUrl = await this.uploadImage(newImageFile);
        if (oldImageUrl) {
          await this.deleteImage(oldImageUrl);
        }
      }

      await updateDoc(docRef, {
        ...projectData,
        imageUrl,
        timestamp: projectData.timestamp || serverTimestamp() // Preserve original timestamp if it exists
      });
      
      // Update project in global store
      useSiteStore.getState().updateProject(id, { ...projectData, imageUrl });
    } catch (error) {
      console.error("Error updating project:", error);
      throw error;
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
      throw error;
    }
  },

  // Upload an image to Firebase Storage
  async uploadImage(file) {
    if (!storage) {
      throw new Error('Firebase Storage not configured');
    }
    if (!file) return null;
    const storageRef = ref(storage, `projects/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
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
    }
  }
};
