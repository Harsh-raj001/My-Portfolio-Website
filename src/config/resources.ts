/**
 * MASTER RESOURCES REGISTRY (V3.5 / V2 Fast Track)
 * 
 * Single source of truth for all external resources, live demos, and professional profiles.
 * Rather than hardcoding URLs across components, all links MUST reference this file.
 * 
 * Empty strings ("") signify that a resource is currently unavailable.
 * The UI will intercept these clicks and show a "currently unavailable" message.
 */

export const RESOURCES = {
  CONTACT: {
    email: "hello@harshraj.com",
    mailto: "mailto:hello@harshraj.com",
    phone: "", // To be provided by candidate
  },
  
  PROFILES: {
    portfolio: "https://gravel-citrine-12a.notion.site/Product-Management-Portfolio-Harsh-Raj-386142fbea2d8019af20d18aa7aa5ea6?source=copy_link",
    linkedin: "https://www.linkedin.com/in/harsh-raj-in/",
    github: "https://github.com/Harsh-raj001",
    resume: "https://drive.google.com/file/d/1XmrA5FU_U1tIO3o4sEEKQWEyhn-kYDqq/view?usp=drive_link",
    website: "https://gravel-citrine-12a.notion.site/HARSH-RAJ-PRODUCT-MANAGER-e34142fbea2d830b80ab0176010b3ce6?source=copy_link"
  },

  FEATURED_PRODUCTS: {
    doclens: {
      github: "https://github.com/Harsh-raj001/DocLens-System-v1.0",
      live: "https://doc-lens-system-v1-0-uzh2.vercel.app/",
      prd: "https://gravel-citrine-12a.notion.site/DocLens-System-v1-0-3a1142fbea2d804dacd7e03b8536396b?source=copy_link"
    },
    resumeAnalyzer: {
      github: "https://github.com/Harsh-raj001/Resume-Analyzer-v1",
      prd: "https://gravel-citrine-12a.notion.site/AI-Resume-Analyser-v0-5-39d142fbea2d805486edd3956309ba12?source=copy_link"
    },
    jobAgent: {
      github: "https://github.com/Harsh-raj001/Autonomous-Job-Agent",
      live: "https://autonomous-job-agent-4i37h6k4k-harshproj1.vercel.app/",
      prd: "https://gravel-citrine-12a.notion.site/Autonomous-Job-Agent-3ab142fbea2d8053ac19de395f618b6a?source=copy_link"
    }
  },

  PRDS: {
    doclens: "https://gravel-citrine-12a.notion.site/DocLens-System-v1-0-3a1142fbea2d804dacd7e03b8536396b?source=copy_link",
    resumeAnalyzer: "https://gravel-citrine-12a.notion.site/AI-Resume-Analyser-v0-5-39d142fbea2d805486edd3956309ba12?source=copy_link",
    jobAgent: "https://gravel-citrine-12a.notion.site/Autonomous-Job-Agent-3ab142fbea2d8053ac19de395f618b6a?source=copy_link",
    hyundaiDealer: "https://gravel-citrine-12a.notion.site/PRD-Hyundai-Dealer-Field-Rep-Mobile-Companion-d8c142fbea2d832aa58981046328f94d?source=copy_link",
    niftySwing: "https://gravel-citrine-12a.notion.site/PRD-NIFTY-Swing-Trade-Journal-565142fbea2d83dc8ae901d526eb9c07?source=copy_link",
    investorSignal: "https://gravel-citrine-12a.notion.site/PRD-Investor-Signal-Layer-3bf142fbea2d82139be801cda71256f0?source=copy_link",
    campusPlacement: "https://gravel-citrine-12a.notion.site/PRD-Campus-Placement-Management-Tier-2-MBA-Colleges-ee3142fbea2d8370bfe181a0889a7bb9?source=copy_link",
    darkKiosk: "https://gravel-citrine-12a.notion.site/PRD-Dark-Kiosk-Expansion-5aa142fbea2d82ae94408180be26907b?source=copy_link",
    nativeTipping: "https://gravel-citrine-12a.notion.site/PRD-Native-In-Feed-Tipping-7dd142fbea2d8320b7b9011099575384?source=copy_link",
  },

  CASE_STUDIES: {
    hyundaiDealer: "https://gravel-citrine-12a.notion.site/Hyundai-Dealer-Connect-38c142fbea2d8094b276e9518ad476ec?source=copy_link",
    tradelog: "https://gravel-citrine-12a.notion.site/TradeLog-NIFTY-50-Swing-Trade-Journal-38c142fbea2d800cbee3cced11c3674a?source=copy_link",
    metroPlaybook: "https://gravel-citrine-12a.notion.site/The-Metro-Playbook-Doesn-t-Transfer-397142fbea2d809daea8c60c3431f818?source=copy_link",
  },

  ANALYTICS: {
    fifa2026: "https://gravel-citrine-12a.notion.site/FIFA-World-Cup-2026-38c142fbea2d8087842ac39b8198a9d9?source=copy_link",
  },

  RESEARCH: {
    naksh: "https://gravel-citrine-12a.notion.site/User-Research-Naksh-38c142fbea2d805485d6c8712ec32e58?source=copy_link",
  },

  PUBLICATION: {
    blockchain: "https://www.researchgate.net/publication/384203856_BLOCKCHAIN_A_PATH_OF_RESILIENCY",
  }
};
