export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  category: 'projects' | 'coursework' | 'oss' | 'work';
  image: string;
  technologies: string[];
  links: ExternalLink[];
  archived?: boolean;
}

export interface ExternalLink {
  label: string;
  url: string;
}

export interface ExperienceRole {
  title: string;
  period?: string;
  tagline?: string;
  points: string[];
}

export interface Experience {
  id: string;
  company: string;
  location: string;
  period: string;
  /** Omitted when the entry's roles are listed individually in `subSections`. */
  title?: string;
  tagline?: string;
  points: string[];
  technologies?: string[];
  links?: ExternalLink[];
  subSections?: ExperienceRole[];
}

export interface ContactInfo {
  email: string;
  github: string;
  linkedin: string;
  resumeUrl: string;
}
