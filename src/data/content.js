// ============================================================
// EDIT & KRAFT — CONTENT DATA FILE
// ============================================================
// This is the SINGLE SOURCE OF TRUTH for all website content.
// To update any text, service, project, or info on the website,
// simply edit the values below. No code knowledge required.
// ============================================================

export const SITE = {
  name: "Edit & Kraft",
  tagline: "Elevate Your Brand With Timeless Marketing Solutions",
  description:
    "Premium digital marketing & creative agency specializing in scroll-stopping visual experiences that transform brands across India.",
  email: "teams@editandkraft.in",
  phone: "+91 83368 76464",
  website: "https://editandkraft.in",
  location: "India",
  copyright: `© ${new Date().getFullYear()} Edit & Kraft. All rights reserved.`,
};

export const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Work", path: "/work" },
  { label: "Services", path: "/services" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

export const HERO = {
  headline: ["Elevate Your Brand", "With Timeless Marketing", "Solutions"],
  subtext:
    "We craft scroll-stopping visual experiences — from social media campaigns to cinematic motion graphics — that transform how India's leading brands connect with their audience.",
  cta: { label: "View Our Work", path: "/work" },
  scrollIndicator: "Scroll to explore",
};

export const SERVICES = {
  sectionTitle: "What We Craft",
  sectionSubtitle:
    "A full spectrum of premium creative services designed to make your brand unforgettable.",
  items: [
    {
      id: "content-creation",
      title: "Content Creation",
      description: "Captivating videos, posts, and carousels crafted that showcases brand excellence."
    },
    {
      id: "seo-optimization",
      title: "SEO Optimization",
      description: "Strategic SEO to boost visibility and attract qualified organic traffic."
    },
    {
      id: "advertising",
      title: "Advertising",
      description: "Targeted campaigns across platforms for maximum reach and conversion."
    },
    {
      id: "influencer-marketing",
      title: "Influencer Marketing",
      description: "Strategic partnerships with industry leaders leading to amplifying brand message."
    },
    {
      id: "analytics-reporting",
      title: "Analytics & Reporting",
      description: "Data-driven insights to measure performance and optimize strategies."
    },
    {
      id: "scheduling-tools",
      title: "Scheduling Tools",
      description: "Advanced content scheduling for optimal posting times and engagement."
    }
  ],
};

export const PLANS = [
  {
    id: "gold",
    name: "Gold Service Plan",
    description: "Ideal for growing brands needing consistent high-quality output and visibility.",
    features: [
      "15 Reels & Posts: High-quality, engaging content designed to increase reach and brand awareness.",
      "SEO Optimization: Intermediate keyword targeting & search visibility improvement.",
      "Two Ad Campaigns Per Month: Professionally managed social media ads to generate leads and engagement.",
      "Content Strategy Planning: Structured monthly calendar aligned with your business goals.",
      "Monthly Performance Report: Clear insights on growth, reach & engagement."
    ],
    popular: false,
    purchaseOptions: [
      {
        type: "one-time",
        price: "Rs. 30,000",
        period: "one-time",
        ctaText: "Buy Now (One-Time)",
        ctaLink: "https://rzp.io/rzp/VLcGCkLY",
        isExternal: true,
      },
      {
        type: "subscription",
        price: "Rs. 30,000",
        period: "monthly",
        billingCycleMonths: 12,
        paidMonths: 11,
        ctaText: "Subscribe Now (11 Months Paid, 1 Free)",
        ctaLink: "https://rzp.io/l/gold-subscription-placeholder",
        isExternal: true,
      },
    ],
  },
  {
    id: "diamond",
    name: "Diamond Service Plan",
    description: "Premium offering for brands demanding massive growth, elite reach, and cinematic quality.",
    features: [
      "25 Reels and Posts Including Carousels: High-end creative content for deeper engagement.",
      "Three Ad Campaigns Per Month: Advanced audience targeting & optimized ad scaling.",
      "Advanced SEO Optimization: Technical SEO + Keyword ranking strategy.",
      "Influencer Marketing Collaboration: Strategic influencer tie-ups to increase credibility.",
      "Premium Content Strategy & Branding: Luxury visual identity with strong storytelling.",
      "Detailed Performance Analytics Report: Data-driven monthly growth report."
    ],
    popular: false,
    purchaseOptions: [
      {
        type: "one-time",
        price: "Rs. 70,000",
        period: "one-time",
        ctaText: "Buy Now (One-Time)",
        ctaLink: "https://rzp.io/rzp/SZc4AYN",
        isExternal: true,
      },
      {
        type: "subscription",
        price: "Rs. 70,000",
        period: "monthly",
        billingCycleMonths: 12,
        paidMonths: 9,
        ctaText: "Subscribe Now (9 Months Paid, 3 Free)",
        ctaLink: "https://rzp.io/l/diamond-subscription-placeholder",
        isExternal: true,
      },
    ],
  },
  {
    id: "custom",
    name: "Custom Plan",
    price: "Tailored Strategy",
    period: "for Your Unique Goals",
    description: "Not every brand is the same. We create a fully personalized marketing strategy based on your industry, target audience & growth objectives.",
    features: [
      "Personalized Content Strategy",
      "Custom Campaign Volumes & Types",
      "Dedicated Account Management",
      "Advanced Brand Design Integrations",
      "Scalable Advertising Solutions"
    ],
    ctaText: "Get In Touch",
    ctaLink: "/#/contact",
    isExternal: false,
    popular: false
  }
];

export const PORTFOLIO = {
  sectionTitle: "Selected Work",
  sectionSubtitle: "A curated collection of our finest craft.",
  categories: [
    "All",
    "Social Media",
    "Motion Graphics",
    "YouTube",
    "Short-Form",
  ],
  projects: [
    {
      id: 1,
      title: "Luxe Brand Campaign",
      category: "Social Media",
      description:
        "A premium social media campaign for India's leading steel brand, driving engagement increase.",
      year: "2024",
      client: "Shyam Steel",
      color: "#1a1a2e",
    },
    {
      id: 2,
      title: "Velocity — Product Launch",
      category: "Motion Graphics",
      description:
        "Cinematic motion graphics package for a tech startup's flagship product launch event.",
      year: "2024",
      client: "Velocity Tech",
      color: "#16213e",
    },
    {
      id: 3,
      title: "Creator Empire",
      category: "YouTube",
      description:
        "Complete YouTube channel overhaul — branding, thumbnails, and editing style that grew subscribers by 500K in 6 months.",
      year: "2023",
      client: "Top Creator",
      color: "#0f3460",
    },
    {
      id: 4,
      title: "Viral Series — 50M Views",
      category: "Short-Form",
      description:
        "A series of short-form videos that accumulated over 50 million views across Instagram and YouTube Shorts.",
      year: "2024",
      client: "Lifestyle Brand Co.",
      color: "#533483",
    },
    {
      id: 6,
      title: "Heritage Spices Rebrand",
      category: "Social Media",
      description:
        "Complete social media identity redesign for a century-old spice brand entering the modern D2C market.",
      year: "2024",
      client: "Heritage Spices",
      color: "#3d1c00",
    },
    {
      id: 7,
      title: "AutoDrive — Reveal Film",
      category: "Motion Graphics",
      description:
        "A high-octane reveal film for an electric vehicle brand's India launch, combining CGI and motion design.",
      year: "2023",
      client: "AutoDrive EV",
      color: "#1b1b2f",
    },
  ],
};

export const STATS = [
  { value: 10, suffix: "+", label: "Years of Experience" },
  { value: 200, suffix: "+", label: "Projects Delivered" },
  { value: 30, suffix: "+", label: "Brands Transformed" },
  { value: 15, suffix: "M+", label: "Views Generated" },
];

export const PROCESS = {
  sectionTitle: "Our Process",
  sectionSubtitle:
    "Every project follows a refined workflow built on a decade of creative expertise.",
  steps: [
    {
      number: "01",
      title: "Discovery",
      description:
        "Deep-dive into your brand, audience, and objectives. We listen more than we talk.",
    },
    {
      number: "02",
      title: "Strategy",
      description:
        "Craft a tailored creative roadmap that aligns with your brand vision and market positioning.",
    },
    {
      number: "03",
      title: "Create",
      description:
        "Where the magic happens. Every pixel, frame, and transition is obsessively refined.",
    },
    {
      number: "04",
      title: "Review",
      description:
        "Collaborative feedback loops ensure the final output exceeds expectations.",
    },
    {
      number: "05",
      title: "Launch & Optimize",
      description:
        "We don't just deliver — we monitor, analyze, and optimize for maximum impact.",
    },
  ],
};

export const TESTIMONIALS = [
  {
    quote:
      "Edit & Kraft didn't just design our campaign — they reimagined our entire brand presence. The results speak for themselves.",
    author: "Anika Sharma",
    role: "CMO, Fashion Forward Inc.",
    project: "Spring Collection Launch"
  },
  {
    quote:
      "The motion graphics package they delivered was beyond cinematic. Our product launch became the most talked-about event of the quarter.",
    author: "Rajiv Menon",
    role: "Founder, Velocity Tech",
    project: "Velocity Product Launch"
  },
  {
    quote:
      "Working with Edit & Kraft is like having a secret weapon. Their understanding of what stops the scroll is unmatched.",
    author: "Priya Kapoor",
    role: "Head of Digital, Heritage Brands",
    project: "Brand Identity Redesign"
  },
  {
    quote:
      "From concept to delivery, every frame was perfect. They turned our vision into a visual masterpiece.",
    author: "Arjun Desai",
    role: "Creative Director, Skyline Group",
    project: "Corporate Video Series"
  },
  {
    quote:
      "Our YouTube channel went from 100K to 600K subscribers in 6 months. Edit & Kraft's strategy and execution is world-class.",
    author: "Vikram Singh",
    role: "Content Creator",
    project: "Channel Growth Strategy"
  },
];

export const ABOUT = {
  headline: "Crafting Visual Excellence Since 2016",
  intro:
    "What started as one artist's passion for visual storytelling has grown into a trusted creative force behind some of India's most recognized brands.",
  story: [
    "Edit & Kraft was born from a simple belief — that every brand deserves visuals that don't just communicate, but captivate. Founded by a digital artist with a decade of experience and an obsessive eye for detail, we've spent years perfecting the art of scroll-stopping creative.",

    "Today, we partner with brands across India — from ambitious startups to established industry leaders — delivering creative that doesn't just meet the brief, but redefines it.",
  ],
  philosophy: {
    title: "Our Philosophy",
    text: "We believe great design is invisible — it doesn't shout, it resonates. Every project we take on is treated as a piece of art, crafted with the precision of an architect and the soul of a storyteller.",
  },
  milestones: [
    { year: "2016", event: "Founded Edit & Kraft as a solo creative studio" },
    {
      year: "2018",
      event: "Expanded into motion graphics and video production",
    },
    {
      year: "2020",
      event: "Crossed 100+ projects, partnered with first major national brand",
    },

    {
      year: "2024",
      event:
        "200+ projects delivered, recognized as a premium creative partner across India",
    },
  ],
};

export const CONTACT = {
  headline: "Let's Create Something Extraordinary",
  subtext:
    "Have a project in mind? We'd love to hear about it. Drop us a line and let's start crafting.",
  formFields: [
    { name: "name", label: "Your Name", type: "text", required: true },
    { name: "email", label: "Email Address", type: "email", required: true },
    {
      name: "projectType",
      label: "Project Type",
      type: "select",
      required: true,
      options: [
        "Social Media Campaign",
        "Motion Graphics",
        "YouTube Production",
        "Short-Form Content",
        "Gold Service Plan",
        "Diamond Service Plan",
        "Custom Plan",
        "Other",
      ],
    },
    {
      name: "budget",
      label: "Budget Range",
      type: "select",
      required: false,
      options: [
        "Under ₹50,000",
        "₹50,000 – ₹2,00,000",
        "₹2,00,000 – ₹5,00,000",
        "₹5,00,000+",
        "Let's Discuss",
      ],
    },
    {
      name: "message",
      label: "Tell Us About Your Project",
      type: "textarea",
      required: true,
    },
  ],
};

export const FOOTER = {
  cta: "Ready to Elevate Your Brand?",
  ctaButton: { label: "Start a Project", path: "/contact" },
  socialLinks: [
    { label: "Instagram", url: "https://www.instagram.com/editankraft?igsh=bWp6cXBheTN5cXZw" },
    { label: "Facebook", url: "https://www.facebook.com/share/1B3aBpnajp/" },
    { label: "LinkedIn", url: "https://linkedin.com/company/editandkraft" },
    { label: "Twitter", url: "https://twitter.com/editandkraft" },
  ],
};
