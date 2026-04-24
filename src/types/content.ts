export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  email: string;
  phone: string;
  website: string;
  location: string;
  copyright: string;
}

export interface NavLink {
  label: string;
  path: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  shortTitle?: string;
}

export interface PortfolioProject {
  id: number | string;
  title: string;
  category: string;
  description: string;
  year: string;
  client: string;
  color?: string;
  imageUrl?: string;
  projectUrl?: string;
  isFavorite?: boolean;
  showcaseSlot?: number | string;
  showcaseLabel?: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  project: string;
}

export interface Milestone {
  year: string;
  event: string;
}

export interface AboutConfig {
  headline: string;
  intro: string;
  story: string[];
  philosophy: {
    title: string;
    text: string;
  };
  milestones: Milestone[];
}
