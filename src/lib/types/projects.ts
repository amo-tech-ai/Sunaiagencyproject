export interface Screenshot {
  url: string;
  caption: string;
  type: 'desktop' | 'mobile';
}

export interface TechStack {
  name: string;
  icon: string;
}

export interface Project {
  id: string;
  name: string;
  tagline: string;
  industry: string[];
  problem: string[];
  solution: string;
  aiCapabilities: string[];
  results: string[];
  techStack: TechStack[];
  screenshots: Screenshot[];
  caseStudyUrl?: string;
}
