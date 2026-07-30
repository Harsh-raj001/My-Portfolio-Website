import { create } from "zustand";

export type ChapterId = 
  | "LAUNCHPAD" 
  | "PLANET_CURIOSITY" 
  | "ASTEROID_SLALOM" 
  | "SYNTHESIS_V" 
  | "WORMHOLE" 
  | "ORBITAL_NEXUS" 
  | "DYSON_SPHERE";

interface MissionState {
  currentChapter: ChapterId;
  activeObjectiveId: string | null;
  isScannerActive: boolean;
  isIdle: boolean;
  breadcrumbs: string[];
  visitedNodes: string[];
  
  // Computed Progression (Will be calculated based on total nodes later, or tracked via this array)
  // Actions
  setCurrentChapter: (chapter: ChapterId) => void;
  setActiveObjectiveId: (id: string | null) => void;
  setScannerActive: (active: boolean) => void;
  setIdle: (idle: boolean) => void;
  updateBreadcrumbs: (crumb: string) => void;
  markNodeVisited: (id: string) => void;
}

export const useMissionStore = create<MissionState>((set) => ({
  currentChapter: "LAUNCHPAD",
  activeObjectiveId: null,
  isScannerActive: false,
  isIdle: false,
  breadcrumbs: ["Mission Control"],
  visitedNodes: [],

  setCurrentChapter: (chapter) => set({ currentChapter: chapter }),
  
  setActiveObjectiveId: (id) => set({ activeObjectiveId: id }),
  
  setScannerActive: (active) => set({ isScannerActive: active }),
  
  setIdle: (idle) => set({ isIdle: idle }),
  
  updateBreadcrumbs: (crumb) => set((state) => {
    // Only keep up to 3 breadcrumbs to prevent overflow
    const newCrumbs = [...state.breadcrumbs, crumb];
    if (newCrumbs.length > 3) newCrumbs.shift();
    return { breadcrumbs: newCrumbs };
  }),

  markNodeVisited: (id) => set((state) => {
    if (!state.visitedNodes.includes(id)) {
      return { visitedNodes: [...state.visitedNodes, id] };
    }
    return state;
  })
}));
