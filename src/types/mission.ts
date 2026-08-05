export interface UniversalNodeContent {
  id: string;
  topic: string; // The primary title (replaces title/name)
  category: string;
  coordinates: [number, number, number];
  color?: string;
  
  // Standardized Narrative Content
  overview: string;
  context: string;
  approach: string;
  decisions: string; // Trade-offs & Decisions
  outcome: string; // Outcomes & Learnings
  
  // Evidence
  evidenceType?: "PRD" | "Case Study" | "GitHub" | "Demo" | "Research" | "Resume" | "Notion" | "None";
  evidenceUrl?: string;
}

export interface CuriosityStory extends UniversalNodeContent {
  question?: string;
  locationName?: string;
}

export type ProductThinkingNode = UniversalNodeContent;

export interface PRDVaultItem {
  id: string;
  title: string;
  domain: string;
  problem: string;
  readingTime: string;
  prdUrl: string;
}

export interface ResearchTeardown {
  id: string;
  title: string;
  category: "User Research" | "Competitive Analysis" | "Product Teardowns" | "UX Audits" | "Feature Analysis" | "Product Analytics";
  description: string;
  pdfUrl: string;
}

export interface PortfolioProject extends UniversalNodeContent {
  type: "PRODUCT" | "CASE_STUDY";
  metrics?: string;
  deliverables?: string[];
}

export type ExperienceNode = UniversalNodeContent;

export interface AIMissionLogEntry {
  id: string;
  scrollThreshold: number;
  text: string;
  category: "OBSERVATION" | "EVIDENCE" | "DECISION" | "TRADE-OFF" | "LESSON" | "ALERT" | "TELEMETRY" | "RESEARCH" | "PHILOSOPHY" | "STATUS" | "SEARCH ANALYST" | "EXEC ASSISTANT" | "ASSISTANCE";
}

export interface ChapterMetadata {
  id: string;
  title: string;
  subtitle: string;
  startScroll: number;
  endScroll: number;
}

export interface CertificationCapability {
  id: string;
  title: string;
  issuer: string;
  category: string;
  whatILearned: string;
  whereAppliedIt: string;
}

export interface SkillSystem {
  category: string;
  skills: string[];
}

export interface MissionTimelineItem {
  year: string;
  title: string;
  subtitle: string;
  status?: string;
  highlights: string[];
  milestone?: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  type: string;
  readUrl: string;
}

export interface MissionMilestone {
  id: string;
  title: string;
  date: string;
  category: "Prototype" | "Publication" | "Corporate" | "Competition" | "Launch" | "Milestone";
  description: string;
  significance: string;
}

export interface LiveMetrics {
  prds: number;
  caseStudies: number;
  aiProducts: number;
  productAnalytics: number;
  userResearch: number;
  publications: number;
  certifications: number;
  internships: number;
}

export interface ProjectData {
  id: string;
  title: string;
  category: "AI Product" | "Product Project" | "Analytics" | "User Research" | "Publication";
  overview: string;
  problem?: string;
  solution?: string;
  tech?: string;
  impact?: string;
  
  // Cinematic Narrative Fields (Used when merged with PortfolioProject)
  type?: "PRODUCT" | "CASE_STUDY" | "RESEARCH";
  topic?: string;
  coordinates?: [number, number, number];
  context?: string;
  approach?: string;
  decisions?: string;
  outcome?: string;
  evidenceType?: string;
  evidenceUrl?: string;
  metrics?: string;
  
  // Single Source of Truth for all external project resources
  resources?: {
    liveDemo?: string;
    github?: string;
    prd?: string;
    caseStudy?: string;
    documentation?: string;
    demoVideo?: string;
    analytics?: string;
    research?: string;
    publication?: string;
  };
}


