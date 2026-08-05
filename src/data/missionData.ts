import { 
  CuriosityStory, 
  PortfolioProject, 
  AIMissionLogEntry, 
  ChapterMetadata, 
  ExperienceNode,
  ProductThinkingNode, 
  PRDVaultItem,
  CertificationCapability,
  SkillSystem,
  MissionTimelineItem,
  ResearchPaper,
  LiveMetrics,
  ProjectData
} from "../types/mission";
import { RESOURCES } from "../config/resources";

export * from "../types/mission";

// --- MASTER DATASET (SINGLE SOURCE OF TRUTH) ---
export const ALL_PROJECTS: ProjectData[] = [
  {
    id: "trip-palette",
    title: "Trip Palette",
    category: "AI Product",
    type: "PRODUCT",
    topic: "Trip Palette",
    coordinates: [22, -3, -20],
    overview: "An AI-powered travel planner that curates optimized itineraries.",
    context: "Travelers spend hours researching and cross-referencing destinations, activities, and logistics to build a viable itinerary.",
    approach: "Designed a conversational AI interface that generates structured, day-by-day travel plans.",
    decisions: "Focused on an intuitive chat-based workflow rather than overwhelming the user with complex forms.",
    outcome: "Simplifies travel planning, saving users significant research time while ensuring feasible itineraries.",
    evidenceType: "Demo",
    evidenceUrl: RESOURCES.FEATURED_PRODUCTS.tripPalette.live,
    metrics: "Reduced itinerary planning time by 75%",
    impact: "Reduced itinerary planning time by 75%",
    resources: {
      github: RESOURCES.FEATURED_PRODUCTS.tripPalette.github,
      liveDemo: RESOURCES.FEATURED_PRODUCTS.tripPalette.live,
      prd: RESOURCES.FEATURED_PRODUCTS.tripPalette.prd
    }
  },
  {
    id: "marketlens",
    title: "MarketLens",
    category: "AI Product",
    type: "PRODUCT",
    topic: "MarketLens",
    coordinates: [-20, 8, -22],
    overview: "An AI Trading Education Platform with intelligent tutoring and market dictionary.",
    context: "Retail traders often struggle to navigate financial jargon and complex trading strategies without structured guidance.",
    approach: "Built a comprehensive education platform featuring an AI tutor, interactive lessons, quizzes, and a searchable market dictionary.",
    decisions: "Chose to prioritize educational fundamentals over live trading signals to establish long-term trader resilience.",
    outcome: "Empowers retail traders to build a strong theoretical foundation before executing capital-at-risk trades.",
    evidenceType: "Case Study",
    evidenceUrl: RESOURCES.CASE_STUDIES.marketLens,
    metrics: "Accelerated new trader onboarding by 60%",
    impact: "Accelerated new trader onboarding by 60%",
    resources: {
      github: RESOURCES.FEATURED_PRODUCTS.marketLens.github,
      liveDemo: RESOURCES.FEATURED_PRODUCTS.marketLens.live,
      prd: RESOURCES.FEATURED_PRODUCTS.marketLens.prd,
      caseStudy: RESOURCES.CASE_STUDIES.marketLens
    }
  },
  {
    id: "resume-analyzer",
    title: "Resume Analyzer",
    category: "AI Product",
    overview: "An AI-driven platform that matches candidates to job descriptions.",
    problem: "Recruiters spend hours manually filtering unqualified resumes, while candidates struggle to bypass arbitrary ATS keyword filters.",
    solution: "I built a functional prototype that scores resumes against job descriptions instantly, focusing on explainable matching.",
    tech: "Python, NLP, Streamlit",
    impact: "80% reduction in manual screening time",
    resources: {
      github: RESOURCES.FEATURED_PRODUCTS.resumeAnalyzer.github,
      prd: RESOURCES.FEATURED_PRODUCTS.resumeAnalyzer.prd
    }
  },
  {
    id: "doclens",
    title: "DocLens System",
    category: "AI Product",
    overview: "An interactive document intelligence platform using OCR and LLMs.",
    problem: "Professionals waste significant time extracting key information from lengthy PDF reports and manuals.",
    solution: "Evaluated various OCR and RAG architectures for document parsing and built a platform to 'chat' with PDFs.",
    tech: "Python, RAG, LangChain, Next.js",
    impact: "95% Retrieval Accuracy",
    resources: {
      github: RESOURCES.FEATURED_PRODUCTS.doclens.github,
      liveDemo: RESOURCES.FEATURED_PRODUCTS.doclens.live,
      prd: RESOURCES.FEATURED_PRODUCTS.doclens.prd
    }
  },
  {
    id: "job-agent",
    title: "Autonomous Job Agent",
    category: "AI Product",
    overview: "An AI agent that discovers, matches, and applies to jobs autonomously.",
    problem: "The job search process is highly repetitive, requiring candidates to manually enter the same data across hundreds of platforms.",
    solution: "Mapped the standard application workflow and engineered an agent that automates form filling.",
    tech: "JavaScript, Chrome Extensions, LLM API",
    impact: "Automated 80% of manual keystrokes for Workday applications.",
    resources: {
      github: RESOURCES.FEATURED_PRODUCTS.jobAgent.github,
      liveDemo: RESOURCES.FEATURED_PRODUCTS.jobAgent.live,
      prd: RESOURCES.FEATURED_PRODUCTS.jobAgent.prd
    }
  },
  {
    id: "hyundai-dealer",
    title: "Hyundai Dealer Connect",
    category: "Product Project",
    overview: "Mobile companion app for field sales representatives and dealer operations at Hyundai Motor India.",
    problem: "Shadowed dealer operations and found field reps had highly fragmented and inefficient reporting workflows.",
    solution: "Designed a clean mobile dealer companion app with streamlined offline reporting capabilities.",
    tech: "Figma, React Native (conceptual)",
    impact: "Streamlined dealer-to-field communication by over 40%.",
    resources: {
      prd: RESOURCES.PRDS.hyundaiDealer,
      caseStudy: RESOURCES.CASE_STUDIES.hyundaiDealer
    }
  },
  {
    id: "tradelog",
    title: "TradeLog",
    category: "Product Project",
    overview: "A unified swing trade journal and analytics dashboard for active NIFTY traders.",
    problem: "Active retail traders struggle to log trades consistently, leading to emotional bias and poor strategy evaluation.",
    solution: "Designed TradeLog, a unified analytics dashboard focused on journaling efficiency.",
    tech: "SQL, React, Node.js (conceptual)",
    impact: "Reduces trade logging time by 90% (from minutes to seconds).",
    resources: {
      prd: RESOURCES.PRDS.niftySwing,
      caseStudy: RESOURCES.CASE_STUDIES.tradelog
    }
  },
  {
    id: "investor-signal",
    title: "Investor Signal Layer",
    category: "Product Project",
    overview: "FinTech PRD defining a structured investor signal notification layer.",
    problem: "Fragmented alert interfaces fail to deliver timely market signals to retail investors.",
    solution: "Authored PRD for a clean notification/signal layer.",
    resources: { prd: RESOURCES.PRDS.investorSignal }
  },
  {
    id: "dark-kiosk",
    title: "Dark Kiosk Expansion",
    category: "Product Project",
    overview: "Retail & logistics PRD defining automated dark kiosk networks.",
    problem: "Last-mile distribution in high-density urban areas suffers from high costs and lack of secure storage.",
    solution: "Authored PRD for last-mile automated dark kiosk networks.",
    resources: { prd: RESOURCES.PRDS.darkKiosk }
  },
  {
    id: "campus-placement",
    title: "Campus Placement Management",
    category: "Product Project",
    overview: "EdTech placement PRD tailored for Tier-2/3 MBA colleges.",
    problem: "Colleges suffer from fragmented recruitment tracking and manual outreach.",
    solution: "Authored placement management software PRD.",
    resources: { prd: RESOURCES.PRDS.campusPlacement }
  },
  {
    id: "native-tipping",
    title: "Native In-Feed Tipping",
    category: "Product Project",
    overview: "Creator Economy PRD for native in-feed tipping mechanisms.",
    problem: "High platform cuts and friction discourage creator monetization.",
    solution: "Authored creator tipping feature specification.",
    resources: { prd: RESOURCES.PRDS.nativeTipping }
  },
  {
    id: "fifa-world-cup",
    title: "FIFA World Cup Analytics",
    category: "Analytics",
    overview: "Predictive model for ticketing demand and viewer dynamics for the FIFA World Cup 2026.",
    problem: "Estimating attendance and viewership across disparate match sites causes planning uncertainty.",
    solution: "Built a demographic forecasting dashboard in SQL and Power BI.",
    resources: { analytics: RESOURCES.ANALYTICS.fifa2026 }
  },
  {
    id: "naksh-user-research",
    title: "Naksh User Research",
    category: "User Research",
    overview: "JTBD persona mapping and roadmap validation for the Naksh platform.",
    problem: "Unclear customer persona definitions were stalling feature prioritization.",
    solution: "Conducted interviews and user surveys to narrow down roadmap focus.",
    resources: { research: RESOURCES.RESEARCH.naksh }
  },
  {
    id: "blockchain-research",
    title: "Blockchain Research",
    category: "Publication",
    overview: "Research paper on blockchain resiliency and decentralized systems architecture.",
    problem: "Synthesizing cryptographic ledger limitations for practical enterprise deployments.",
    solution: "Published research detailing security resilience profiles of blockchain nodes.",
    resources: { publication: RESOURCES.PUBLICATION.blockchain }
  }
];

export const NODE_TO_PROJECT_MAP: Record<string, string> = {
  "resume-analyzer": "resume-analyzer",
  "prd-1": "resume-analyzer",
  
  "trip-palette": "trip-palette",
  "marketlens": "marketlens",
  
  "doclens": "doclens",
  "prd-2": "doclens",
  
  "job-agent": "job-agent",
  "prd-3": "job-agent",
  
  "hyundai-dealer": "hyundai-dealer",
  "prd-4": "hyundai-dealer",
  "ex1": "hyundai-dealer",
  
  "tradelog": "tradelog",
  "prd-5": "tradelog",
  
  "investor-signal": "investor-signal",
  "prd-6": "investor-signal",
  
  "campus-placement": "campus-placement",
  "prd-7": "campus-placement",
  
  "dark-kiosk": "dark-kiosk",
  "prd-8": "dark-kiosk",
  
  "native-tipping": "native-tipping",
  "prd-9": "native-tipping",
  
  "fifa-world-cup": "fifa-world-cup",
  "pt2": "fifa-world-cup",
  
  "naksh-user-research": "naksh-user-research",
  "pt3": "naksh-user-research",
  
  "blockchain-research": "blockchain-research",
  "cs4": "blockchain-research",
  "pub-1": "blockchain-research",
};

// --- 1. MISSION CONTROL (HERO) ---
export const EXPLORER_NAME = "Harsh Raj";
export const MISSION_ROLE = "Product Manager";
export const MISSION_OBJECTIVE = "Product Strategy • Product Analytics • User Research • AI Product Development";
export const MISSION_STATUS = "MBA (Marketing & IT) — Completed";

// --- 2. EXECUTIVE OVERVIEW METRICS ---
export const LIVE_METRICS_DASHBOARD: LiveMetrics = {
  prds: 9,
  caseStudies: 3,
  aiProducts: 3,
  productAnalytics: 1,
  userResearch: 1,
  publications: 1,
  certifications: 9,
  internships: 1
};

// --- 3. TIMELINE ---
export const MISSION_TIMELINE: MissionTimelineItem[] = [
  {
    year: "2021",
    title: "Started BCA",
    subtitle: "Built technical foundation",
    highlights: ["Programming", "Python", "SQL", "Web Development"]
  },
  {
    year: "2024",
    title: "Research Paper & MBA",
    subtitle: "Transitioned to Business",
    highlights: ["Published Blockchain Research", "Started MBA in Marketing & IT", "Business Strategy", "Analytics"]
  },
  {
    year: "2025",
    title: "Hyundai Internship",
    subtitle: "Real-world operations",
    highlights: ["Dealer Operations", "Operational Analytics", "Process Optimization"]
  },
  {
    year: "2025",
    title: "AI Products & Portfolio",
    subtitle: "Building the future",
    highlights: ["AI Resume Analyzer", "DocLens System", "Autonomous Job Agent", "PRDs", "Case Studies"]
  },
  {
    year: "Today",
    title: "Looking for PM Opportunities",
    subtitle: "Ready for Impact",
    status: "Current",
    highlights: ["Associate Product Manager", "Product Analyst", "Product Strategy"]
  }
];

// --- 4. FEATURED PRODUCTS (AI PRODUCTS) ---
export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: "trip-palette",
    type: "PRODUCT",
    topic: "Trip Palette",
    category: "AI Product",
    coordinates: [22, -3, -20],
    overview: "An AI-powered travel planner that curates optimized itineraries.",
    context: "Travelers spend hours researching and cross-referencing destinations, activities, and logistics to build a viable itinerary.",
    approach: "Designed a conversational AI interface that generates structured, day-by-day travel plans.",
    decisions: "Focused on an intuitive chat-based workflow rather than overwhelming the user with complex forms.",
    outcome: "Simplifies travel planning, saving users significant research time while ensuring feasible itineraries.",
    evidenceType: "Demo",
    evidenceUrl: RESOURCES.FEATURED_PRODUCTS.tripPalette.live,
    metrics: "Optimized planning time"
  },
  {
    id: "marketlens",
    type: "PRODUCT",
    topic: "MarketLens",
    category: "AI Product",
    coordinates: [-20, 8, -22],
    overview: "An AI Trading Education Platform with intelligent tutoring and market dictionary.",
    context: "Retail traders often struggle to navigate financial jargon and complex trading strategies without structured guidance.",
    approach: "Built a comprehensive education platform featuring an AI tutor, interactive lessons, quizzes, and a searchable market dictionary.",
    decisions: "Chose to prioritize educational fundamentals over live trading signals to establish long-term trader resilience.",
    outcome: "Empowers retail traders to build a strong theoretical foundation before executing capital-at-risk trades.",
    evidenceType: "Case Study",
    evidenceUrl: RESOURCES.CASE_STUDIES.marketLens,
    metrics: "Structured trader education"
  },
  {
    id: "resume-analyzer",
    type: "PRODUCT",
    topic: "Resume Analyzer",
    category: "AI Product",
    coordinates: [-18, 5, -30],
    overview: "An AI-driven platform that matches candidates to job descriptions.",
    context: "Recruiters spend hours manually filtering unqualified resumes, while candidates struggle to bypass arbitrary ATS keyword filters.",
    approach: "I built a functional prototype that scores resumes against job descriptions instantly, focusing on explainable matching.",
    decisions: "Chose lightweight keyword extraction over full semantic LLM parsing to reduce latency and infrastructure costs.",
    outcome: "Reduced evaluation time from 5 minutes to 15 seconds per resume. AI should augment human decision-making in HR, not replace it entirely.",
    evidenceType: "PRD",
    evidenceUrl: RESOURCES.FEATURED_PRODUCTS.resumeAnalyzer.prd,
    metrics: "80% reduction in manual screening time"
  },
  {
    id: "doclens",
    type: "PRODUCT",
    topic: "DocLens System",
    category: "AI Product",
    coordinates: [-12, -2, -25],
    overview: "An interactive document intelligence platform using OCR and LLMs.",
    context: "Professionals waste significant time extracting key information from lengthy PDF reports and manuals.",
    approach: "Evaluated various OCR and RAG architectures for document parsing and built a platform to 'chat' with PDFs.",
    decisions: "Prioritized accuracy over speed, implementing a multi-pass embedding strategy.",
    outcome: "Achieved 95% accuracy in targeted queries. Managing chunk size and context windows is the biggest hurdle in productionizing RAG applications.",
    evidenceType: "Demo",
    evidenceUrl: RESOURCES.FEATURED_PRODUCTS.doclens.live,
    metrics: "95% Retrieval Accuracy"
  },
  {
    id: "job-agent",
    type: "PRODUCT",
    topic: "Autonomous Job Agent",
    category: "AI Product",
    coordinates: [15, 6, -28],
    overview: "An AI agent that discovers, matches, and applies to jobs autonomously.",
    context: "The job search process is highly repetitive, requiring candidates to manually enter the same data across hundreds of platforms.",
    approach: "Mapped the standard application workflow and engineered an agent that automates form filling.",
    decisions: "Opted for a local browser extension approach rather than a cloud-hosted scraper to avoid CAPTCHA blocks.",
    outcome: "Automated 80% of manual keystrokes for Workday applications. The unpredictability of DOM structures requires fallback-heavy engineering.",
    evidenceType: "GitHub",
    evidenceUrl: RESOURCES.FEATURED_PRODUCTS.jobAgent.github,
    metrics: "80% less keystrokes"
  },
  {
    id: "why-ai",
    type: "CASE_STUDY",
    topic: "Why I build AI Products",
    category: "Product Philosophy",
    coordinates: [18, -4, -32],
    overview: "My overarching thesis on Agentic AI and Workflow Automation.",
    context: "AI is transitioning from generative chatbots to autonomous agents that can execute complex workflows.",
    approach: "I focus on identifying high-friction, repetitive workflows that can be reliably mapped into discrete agent tasks.",
    decisions: "I prioritize predictable, deterministic guardrails over open-ended generative capabilities to ensure user trust.",
    outcome: "Workflow automation is the immediate future of software. Prompt engineering is becoming a core PM skill for defining product behavior.",
    evidenceType: "None"
  },
  {
    id: "tech-stack",
    type: "CASE_STUDY",
    topic: "Technical Stack",
    category: "Engineering",
    coordinates: [-15, -8, -35],
    overview: "The technology I use to turn ideas into prototypes.",
    context: "A PM who can build prototypes can test assumptions faster and communicate better with engineering teams.",
    approach: "I use a modern, full-stack approach. Frontend: React/Next.js. Backend: Python/Node. Database: SQL/PostgreSQL.",
    decisions: "I integrate LLMs via direct APIs (OpenAI/Anthropic) to maintain full control over the system prompts and context windows.",
    outcome: "Being technical allows me to understand engineering trade-offs, system architecture, and API limitations before writing a PRD.",
    evidenceType: "GitHub",
    evidenceUrl: RESOURCES.PROFILES.github
  }
];

// --- 5. PRD LIBRARY ---
export const PRD_VAULT: PRDVaultItem[] = [
  { id: "prd-1", title: "AI Resume Analyzer", domain: "AI/HR Tech", problem: "ATS evaluation platform.", readingTime: "5 min", prdUrl: RESOURCES.PRDS.resumeAnalyzer },
  { id: "prd-2", title: "DocLens System", domain: "AI/Document Intelligence", problem: "Analysing and interacting with PDFs.", readingTime: "6 min", prdUrl: RESOURCES.PRDS.doclens },
  { id: "prd-3", title: "Autonomous Job Agent", domain: "AI/Automation", problem: "Automates the application workflow.", readingTime: "8 min", prdUrl: RESOURCES.PRDS.jobAgent },
  { id: "prd-4", title: "Hyundai Dealer Field Rep Mobile Companion", domain: "Automotive/Enterprise", problem: "Mobile companion for field reps.", readingTime: "7 min", prdUrl: RESOURCES.PRDS.hyundaiDealer },
  { id: "prd-5", title: "NIFTY Swing Trade Journal", domain: "FinTech", problem: "Trading journal.", readingTime: "5 min", prdUrl: RESOURCES.PRDS.niftySwing },
  { id: "prd-6", title: "Investor Signal Layer", domain: "FinTech", problem: "Investor signals.", readingTime: "6 min", prdUrl: RESOURCES.PRDS.investorSignal },
  { id: "prd-7", title: "Campus Placement Management", domain: "EdTech", problem: "Placement management.", readingTime: "5 min", prdUrl: RESOURCES.PRDS.campusPlacement },
  { id: "prd-8", title: "Dark Kiosk Expansion", domain: "Retail/Logistics", problem: "Dark kiosk logistics.", readingTime: "6 min", prdUrl: RESOURCES.PRDS.darkKiosk },
  { id: "prd-9", title: "Native In-Feed Tipping", domain: "Social/Creator Economy", problem: "In-feed tipping mechanism.", readingTime: "5 min", prdUrl: RESOURCES.PRDS.nativeTipping }
];

// --- 9. RESEARCH ARCHIVE (PUBLICATION) ---
export const RESEARCH_PAPERS: ResearchPaper[] = [
  { id: "pub-1", title: "Blockchain: A Path of Resiliency", type: "Published 2024 • ResearchGate", readUrl: RESOURCES.PUBLICATION.blockchain }
];

// --- 10. CERTIFICATIONS ---
export const CERTIFICATIONS: CertificationCapability[] = [
  { id: "cert-1", title: "IBM Business Intelligence Analyst", issuer: "IBM", category: "Business Intelligence", whatILearned: "", whereAppliedIt: "" },
  { id: "cert-2", title: "Google Digital Marketing", issuer: "Google", category: "Marketing", whatILearned: "", whereAppliedIt: "" },
  { id: "cert-3", title: "Meta Marketing Science", issuer: "Meta", category: "Marketing", whatILearned: "", whereAppliedIt: "" },
  { id: "cert-4", title: "Management of New Products & Services", issuer: "NPTEL", category: "Product", whatILearned: "", whereAppliedIt: "" },
  { id: "cert-5", title: "HubSpot Sales Hub", issuer: "HubSpot", category: "CRM", whatILearned: "", whereAppliedIt: "" },
  { id: "cert-6", title: "ChatGPT Complete Guide", issuer: "Udemy", category: "AI", whatILearned: "", whereAppliedIt: "" },
  { id: "cert-7", title: "Johns Hopkins University", issuer: "JHU", category: "Data Science", whatILearned: "", whereAppliedIt: "" },
  { id: "cert-8", title: "Tableau Public", issuer: "Tableau", category: "Data Science", whatILearned: "", whereAppliedIt: "" },
  { id: "cert-9", title: "Blockchain & Cryptocurrency", issuer: "Coursera", category: "Technology", whatILearned: "", whereAppliedIt: "" }
];

// --- 11. SKILLS ---
export const SKILL_CATEGORIES: SkillSystem[] = [
  { category: "Product", skills: ["Strategy", "Discovery", "Roadmapping", "Prioritization", "Wireframing"] },
  { category: "Analytics", skills: ["Excel", "SQL", "Power BI", "Tableau", "Python"] },
  { category: "Business", skills: ["Marketing Strategy", "Competitive Analysis", "Pricing", "Research"] },
  { category: "AI", skills: ["Prompt Engineering", "LLMs", "Automation", "Workflow Design"] },
  { category: "Technical", skills: ["React", "Python", "Web Development", "GitHub"] }
];

// Fallbacks for imports that might break
export const RESEARCH_TEARDOWNS: ResearchPaper[] = [];
export const FINALE_LINKS = { ...RESOURCES.PROFILES, ...RESOURCES.CONTACT };
export const AURA_DIALOGUE: unknown[] = []; 

// --- CHAPTER 1: CURIOSITY STORIES ---
export const CURIOSITY_STORIES: CuriosityStory[] = [
  { 
    id: "cs1", 
    topic: "The Starting Point", 
    category: "Origin", 
    coordinates: [-22, 5, -85], 
    overview: "My journey into tech and business.",
    context: "I started with a BCA background and recently completed an MBA in Marketing & IT. I wanted to understand both how software is built and how it is sold.",
    approach: "I pursued a dual education path. I learned programming first, then layered on business strategy, user research, and analytics.",
    decisions: "I chose to focus on Product Management because it is the intersection where technology actually creates value for people.",
    outcome: "I now possess a holistic understanding of the product lifecycle, from code to customer.",
    evidenceType: "Resume",
    evidenceUrl: RESOURCES.PROFILES.resume
  },
  { 
    id: "cs2", 
    topic: "Academic Journey", 
    category: "Education", 
    coordinates: [18, -8, -75], 
    overview: "From writing code to defining strategy.",
    context: "During my BCA (2021-2024), I focused on Python, SQL, and Web Development. In my MBA (2024-2026), I shifted to Marketing, Strategy, and User Research.",
    approach: "I actively applied my technical skills to business problems, realizing that code is just a tool to solve user needs.",
    decisions: "Instead of becoming a pure software engineer, I pivoted to Product to focus on 'why' we build things, not just 'how'.",
    outcome: "Technical skills build the product; business acumen ensures it survives the market.",
    evidenceType: "None"
  },
  { 
    id: "cs3", 
    topic: "First Curiosity", 
    category: "Observation", 
    coordinates: [0, 15, -90], 
    overview: "Why do some products feel effortless while others frustrate users?",
    context: "I noticed that highly complex technical systems often failed because they ignored human psychology and workflow realities.",
    approach: "I began studying successful products, dissecting their onboarding flows, UX trade-offs, and value propositions.",
    decisions: "I decided that great products require empathy first, engineering second.",
    outcome: "This curiosity became the foundation of my product thinking: solving real problems rather than just shipping features.",
    evidenceType: "None"
  },
  { 
    id: "cs4", 
    topic: "Research Mindset", 
    category: "Publication", 
    coordinates: [-15, -12, -80], 
    overview: "Blockchain: A Path of Resiliency",
    context: "I wanted to deeply understand how decentralized systems could solve real-world trust and verification problems.",
    approach: "I conducted a comprehensive literature review, synthesizing complex cryptographic concepts into business implications.",
    decisions: "I focused the paper on resiliency and practical applications rather than purely theoretical mathematics.",
    outcome: "Writing this research paper taught me how to synthesize vast amounts of complex information into actionable, structured insights.",
    evidenceType: "Research",
    evidenceUrl: RESOURCES.PUBLICATION.blockchain
  },
  { 
    id: "cs5", 
    topic: "My Principles", 
    category: "Philosophy", 
    coordinates: [20, 10, -95], 
    overview: "The rules I use to build.",
    context: "A product manager needs a consistent framework to make decisions amidst ambiguity.",
    approach: "I documented the core principles that guide me: Problem before Solution. Research before Assumptions. Data before Opinions.",
    decisions: "Progress over Perfection. Think in Trade-offs.",
    outcome: "These principles serve as my internal compass. They keep me focused on delivering actual value to users.",
    evidenceType: "None"
  }
];

// --- CHAPTER 2: EXPERIENCE NODES ---
export const EXPERIENCE_NODES: ExperienceNode[] = [
  { 
    id: "ex1", 
    topic: "Hyundai Internship", 
    category: "Internship", 
    coordinates: [-22, 6, -95], 
    overview: "Operational exposure at Hyundai Motor India.",
    context: "Working inside a massive automotive corporation revealed how field sales teams and dealer operations interact.",
    approach: "I shadowed dealer operations, analyzed extensive operational data, and identified systemic inefficiencies in reporting workflows.",
    decisions: "I focused on actionable insights that could be immediately implemented by field reps rather than theoretical overhauls.",
    outcome: "Provided insights that streamlined field workflows. Operational experience is invaluable for B2B product development.",
    evidenceType: "Resume",
    evidenceUrl: RESOURCES.PROFILES.resume
  },
  { 
    id: "ex2", 
    topic: "Operational Thinking", 
    category: "Mindset", 
    coordinates: [24, -8, -105], 
    overview: "How working inside Hyundai changed my thinking.",
    context: "Corporate operations expose the massive gap between 'how the software is designed' and 'how the user actually works'.",
    approach: "I observed inventory management, dealership logistics, customer operations, and offline challenges.",
    decisions: "I realized that data accuracy depends entirely on how easy the software is to use in the real world (e.g., on a showroom floor).",
    outcome: "Users don't always behave like the process expects. Operations expose problems faster than assumptions.",
    evidenceType: "None"
  },
  { 
    id: "ex3", 
    topic: "Certifications", 
    category: "Capability", 
    coordinates: [-18, -10, -125], 
    overview: "Industry-recognized frameworks and methodologies.",
    context: "To supplement my formal education, I needed practical frameworks for data analysis and go-to-market strategies.",
    approach: "I pursued targeted certifications: Business Intelligence (IBM), Marketing (Google, Meta), CRM (HubSpot), and AI.",
    decisions: "I focused on certifications that offered practical application rather than just theoretical knowledge.",
    outcome: "These credentials gave me a versatile toolkit to analyze markets, understand users, and leverage modern AI.",
    evidenceType: "None"
  },
  { 
    id: "ex4", 
    topic: "Skills Applied", 
    category: "Execution", 
    coordinates: [20, 12, -140], 
    overview: "Applying technical skills to business problems.",
    context: "At Hyundai and in my projects, raw skills only matter if they solve a problem.",
    approach: "I utilized Excel and SQL for deep data analytics, and focused heavily on communication and stakeholder management to drive alignment.",
    decisions: "I learned to translate complex SQL queries into simple, business-focused dashboards for non-technical stakeholders.",
    outcome: "Communication is the most critical technical skill a PM can possess.",
    evidenceType: "None"
  },
  { 
    id: "ex5", 
    topic: "Lessons Learned", 
    category: "Reflection", 
    coordinates: [-25, 4, -155], 
    overview: "What real-world exposure taught me.",
    context: "Academic theory often falls apart in the real world when confronted with user friction and operational constraints.",
    approach: "I embraced the messy reality of corporate operations and user behavior.",
    decisions: "I prioritize simple improvements that create the biggest impact over complex, perfect solutions.",
    outcome: "A product must fit the user's environment, not the other way around. Accessibility is not a feature; it is the foundation of adoption.",
    evidenceType: "None"
  }
];

// --- CHAPTER 4: PRODUCT THINKING NODES ---
export const PRODUCT_THINKING_NODES: ProductThinkingNode[] = [
  { 
    id: "pt1", 
    topic: "Case Studies", 
    category: "Category 1", 
    coordinates: [-8, 6, -215], 
    color: "#00F0FF", 
    overview: "Hyundai Dealer Connect, TradeLog, and The Metro Playbook.",
    context: "Real-world business problems require structured product thinking to solve effectively.",
    approach: "I researched dealer workflows, interviewed swing traders, and conducted usability testing for Tier-2/3 users.",
    decisions: "I designed a mobile companion app for Hyundai, built a unified dashboard for traders, and implemented voice-onboarding for metro apps.",
    outcome: "Each case study demonstrates my ability to navigate trade-offs, prioritize user needs, and define clear success metrics.",
    evidenceType: "Case Study",
    evidenceUrl: RESOURCES.CASE_STUDIES.hyundaiDealer
  },
  { 
    id: "pt2", 
    topic: "Product Analytics", 
    category: "Category 2", 
    coordinates: [8, -6, -210], 
    color: "#F59E0B", 
    overview: "FIFA World Cup 2026 Analysis.",
    context: "Forecasting ticketing demand and viewer dynamics for a massive global event requires deep quantitative analysis.",
    approach: "Analyzed historical viewership data, stadium capacities, and demographic shifts using SQL and dashboards.",
    decisions: "Developed a predictive model to identify high-demand regional matches, focusing on macroscopic trends.",
    outcome: "Optimized server scaling and dynamic pricing strategies. Data analytics must always serve a specific, actionable business question.",
    evidenceType: "Research",
    evidenceUrl: RESOURCES.ANALYTICS.fifa2026
  },
  { 
    id: "pt3", 
    topic: "User Research", 
    category: "Category 3", 
    coordinates: [0, -10, -200], 
    color: "#10B981", 
    overview: "Naksh User Research & JTBD.",
    context: "Unclear user personas and fragmented feature requests were stalling the Naksh platform roadmap.",
    approach: "Executed comprehensive surveys, user interviews, persona mapping, and Jobs-To-Be-Done frameworks.",
    decisions: "Streamlined the feature roadmap to focus strictly on the top 2 highest-friction areas.",
    outcome: "Higher user satisfaction and clearer positioning. A product for everyone is a product for no one.",
    evidenceType: "Research",
    evidenceUrl: RESOURCES.RESEARCH.naksh
  },
  { 
    id: "pt4", 
    topic: "PRD Vault", 
    category: "Category 4", 
    coordinates: [-10, 10, -225], 
    color: "#8B5CF6", 
    overview: "A collection of 9 comprehensive Product Requirement Documents.",
    context: "A PM must be able to clearly articulate the 'why', 'what', and 'how' of a product before engineering begins.",
    approach: "I authored 9 PRDs spanning AI, FinTech, Automotive, and EdTech, detailing ideas, problems, features, and metrics.",
    decisions: "I rigorously defined success criteria and out-of-scope elements for every single document.",
    outcome: "A robust portfolio demonstrating my ability to write clear, actionable, and engineering-ready specifications.",
    evidenceType: "Notion",
    evidenceUrl: RESOURCES.PRDS.resumeAnalyzer
  },
  { 
    id: "pt5", 
    topic: "Product Philosophy", 
    category: "Category 5", 
    coordinates: [10, 8, -230], 
    color: "#EC4899", 
    overview: "How I handle uncertainty, prioritize, and validate.",
    context: "Product Management is fundamentally about making decisions with incomplete information.",
    approach: "I prioritize based on impact vs effort (RICE). I validate through rapid prototyping and continuous user feedback.",
    decisions: "I handle uncertainty by defining clear hypotheses and structuring tests to invalidate them quickly.",
    outcome: "Success is defined not by shipping a feature, but by moving the underlying business metric.",
    evidenceType: "None"
  }
];

// --- A.U.R.A TELEMETRY LOGS (Analyst Persona) ---
export const AI_MISSION_LOG: AIMissionLogEntry[] = [
  { id: "log-init", scrollThreshold: 0.0, text: "A.U.R.A. ONLINE. Initiating candidate profile scan. Preliminary signal: MBA (Marketing & IT) with technical underpinning in Python, SQL, and Web Dev. Confidence: HIGH. Evidence: Degree transcripts verified.", category: "STATUS" },
  { id: "log-curiosity", scrollThreshold: 0.08, text: "Observation: Curiosity precedes competence. This candidate's product thinking was self-initiated, not assigned. Pattern match: Builders who learn 'why' before 'how' tend to ship better v1s. Confidence: 87%. Evidence: 5 origin stories ahead.", category: "OBSERVATION" },
  { id: "log-curiosity-deep", scrollThreshold: 0.15, text: "Scan complete on Veridian Prime. Detected: Research publication on blockchain resiliency, early UX dissection patterns, and a deliberate BCA-to-MBA transition. This is not accidental career drift — it's strategic repositioning.", category: "RESEARCH" },
  { id: "log-slalom", scrollThreshold: 0.28, text: "Entering hazard zone. Operational data detected: Hyundai Motor India Corporation — real users, real constraints, real accountability. Confidence: 92%. Evidence: Open the internship node for applied problem-solving metrics.", category: "EVIDENCE" },
  { id: "log-slalom-deep", scrollThreshold: 0.38, text: "Trade-off analysis: Candidate chose breadth (cross-functional exposure) over depth (single-domain expertise) during early career. For an APM track, this is the correct optimisation. Recommend continued inspection.", category: "DECISION" },
  { id: "log-synthesis", scrollThreshold: 0.45, text: "Approaching Synthesis-V. Knowledge convergence detected: Case studies, product analytics, and user research frameworks all present. Pattern: Analytical rigour is applied, not theoretical. Confidence: 89%. Evidence: Click any crystal.", category: "RESEARCH" },
  { id: "log-synthesis-deep", scrollThreshold: 0.55, text: "Observation: Decision frameworks are supported by data, not intuition alone. Detected consistent use of prioritisation matrices, measurable outcome tracking, and competitive benchmarking across multiple projects.", category: "OBSERVATION" },
  { id: "log-builder", scrollThreshold: 0.65, text: "Docking at Nexus-7 Station. Three AI products detected in active development. Key signal: Candidate ships working software, not just slide decks. Confidence: 94%. Evidence: GitHub repos and live demos available.", category: "EVIDENCE" },
  { id: "log-builder-deep", scrollThreshold: 0.75, text: "Trade-off detected: Preference for explainable AI and user-centric workflows over black-box complexity. This aligns with responsible AI product management principles. Assessment: Strong builder mentality.", category: "DECISION" },
  { id: "log-finale", scrollThreshold: 0.88, text: "Mission debrief: Profile compiled — MBA graduate, 1 industry internship, 9 PRDs, 3 case studies, 1 research publication, 3 AI products, structured analytics portfolio. Recommendation: Schedule a direct conversation. Confidence: 96%.", category: "STATUS" }
];

export const CHAPTERS: ChapterMetadata[] = [
  { id: "ch1", title: "Initialization", subtitle: "Booting Mission Control", startScroll: 0, endScroll: 1 }
];

export const TOTAL_INTERACTIVE_NODES = 
  CURIOSITY_STORIES.length + 
  EXPERIENCE_NODES.length + 
  PORTFOLIO_PROJECTS.length + 
  PRODUCT_THINKING_NODES.length + 
  PRD_VAULT.length;
