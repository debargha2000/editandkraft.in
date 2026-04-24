import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { SITE, NAV_LINKS, HERO, SERVICES, PLANS, PORTFOLIO, STATS, PROCESS, TESTIMONIALS, ABOUT, CONTACT, FOOTER } from '../data/content';
import { SiteConfig, NavLink, ServiceItem, PortfolioProject, Testimonial, AboutConfig } from '../types/content';

interface SiteState {
  site: SiteConfig;
  navLinks: NavLink[];
  hero: any;
  services: {
    sectionTitle: string;
    sectionSubtitle: string;
    items: ServiceItem[];
  };
  plans: any[];
  portfolio: {
    sectionTitle: string;
    sectionSubtitle: string;
    categories: string[];
    projects: PortfolioProject[];
  };
  stats: any[];
  process: any;
  testimonials: Testimonial[];
  about: AboutConfig;
  contact: any;
  footer: any;
  
  updateSiteData: (data: Partial<SiteState>) => void;
  updateService: (id: string, updatedService: Partial<ServiceItem>) => void;
  addProject: (project: PortfolioProject) => void;
  updateProject: (id: string | number, updatedProject: Partial<PortfolioProject>) => void;
  removeProject: (id: string | number) => void;
  addTestimonial: (testimonial: Testimonial) => void;
  updatePlan: (id: string, updatedPlan: any) => void;
}

/**
 * Site Store - Centralized state management for all site data
 */
export const useSiteStore = create<SiteState>()(
  devtools(
    persist(
      (set) => ({
        // Site data
        site: SITE as SiteConfig,
        navLinks: NAV_LINKS as NavLink[],
        hero: HERO,
        services: SERVICES,
        plans: PLANS,
        portfolio: PORTFOLIO,
        stats: STATS,
        process: PROCESS,
        testimonials: TESTIMONIALS as Testimonial[],
        about: ABOUT as AboutConfig,
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
      }),
      {
        name: 'editandkraft-storage',
        // Only persist portfolio data from Firebase, everything else comes from content.js
        partialize: (state) => ({ 
          portfolio: state.portfolio 
        }),
      }
    )
  )
);
