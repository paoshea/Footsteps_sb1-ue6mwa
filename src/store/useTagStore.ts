import { create } from 'zustand';

interface TagState {
  suggestedTags: string[];
  frequentTags: string[];
  setSuggestedTags: (tags: string[]) => void;
  setFrequentTags: (tags: string[]) => void;
  addSuggestedTag: (tag: string) => void;
  addFrequentTag: (tag: string) => void;
}

export const useTagStore = create<TagState>((set) => ({
  suggestedTags: [],
  frequentTags: [],
  setSuggestedTags: (tags) => set({ suggestedTags: tags }),
  setFrequentTags: (tags) => set({ frequentTags: tags }),
  addSuggestedTag: (tag) =>
    set((state) => ({
      suggestedTags: [...new Set([...state.suggestedTags, tag])],
    })),
  addFrequentTag: (tag) =>
    set((state) => ({
      frequentTags: [...new Set([...state.frequentTags, tag])],
    })),
}));