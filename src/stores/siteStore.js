import { create } from 'zustand';
import { SITE, NAV_LINKS, HERO, SERVICES, PLANS, PORTFOLIO, STATS, PROCESS, TESTIMONIALS, ABOUT, CONTACT, FOOTER } from '../data/content';

/**
 * Site Store - Centralized state management for all site data
 */
export const useSiteStore = create((set) => ({
  // Site data
  site: SITE,
  navLinks: NAV_LINKS,
  hero: HERO,
  services: SERVICES,
  plans: PLANS,
  portfolio: PORTFOLIO,
  stats: STATS,
  process: PROCESS,
  testimonials: TESTIMONIALS,
  about: ABOUT,
  contact: CONTACT,
  footer: FOOTER,
  
  // Actions to update site data
  updateSiteData: (data) => set((state) => ({ ...state, ...data })),
  
  // Service actions
  updateService: (id, updatedService) => set((state) => ({
    services: {
      ...state.services,
      items: state.services.items.map(service => 
        service.id === id ? { ...service, ...updatedService } : service
      )
    }
  })),
  
  // Portfolio actions
  addProject: (project) => set((state) => ({
    portfolio: {
      ...state.portfolio,
      projects: [project, ...state.portfolio.projects]
    }
  })),
  
  updateProject: (id, updatedProject) => set((state) => ({
    portfolio: {
      ...state.portfolio,
      projects: state.portfolio.projects.map(project => 
        project.id === id ? { ...project, ...updatedProject } : project
      )
    }
  })),
  
  removeProject: (id) => set((state) => ({
    portfolio: {
      ...state.portfolio,
      projects: state.portfolio.projects.filter(project => project.id !== id)
    }
  })),
  
  // Testimonial actions
  addTestimonial: (testimonial) => set((state) => ({
    testimonials: [...state.testimonials, testimonial]
  })),
  
  // Plan actions
  updatePlan: (id, updatedPlan) => set((state) => ({
    plans: state.plans.map(plan => 
      plan.id === id ? { ...plan, ...updatedPlan } : plan
    )
  })),
}));
