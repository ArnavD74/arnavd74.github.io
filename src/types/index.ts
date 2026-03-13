export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  category: 'projects' | 'coursework' | 'oss' | 'work';
  image: string;
  technologies: string[];
  links: {
    label: string;
    url: string;
  }[];
  archived?: boolean;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  period: string;
  role: string;
  tagline?: string;
  points: string[];
  technologies?: string[];
  subSections?: {
    title: string;
    period?: string;
    tagline?: string;
    points: string[];
  }[];
}

export interface ContactInfo {
  email: string;
  github: string;
  linkedin: string;
  resumeUrl: string;
}
