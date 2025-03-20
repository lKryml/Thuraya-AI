import { create } from 'zustand';
import {
  summarizeDocument,
  compareDocuments,
  imageToText,
} from '../lib/docsService';

type DocOperation = 'summarize' | 'compare' | 'image-to-text' | null;

interface DocsState {
  selectedOp: DocOperation;
  setSelectedOp: (op: DocOperation) => void;
  recentDocs: string[];
  addRecentDoc: (doc: string) => void;
  processDocument: (file: File, files?: FileList) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  response: any;
  setResponse: (response: any) => void;
  clearResponse: () => void;
}

export const useDocsStore = create<DocsState>((set, get) => ({
  selectedOp: 'summarize',
  setSelectedOp: (op) => set({ selectedOp: op }),
  recentDocs: [],
  addRecentDoc: (doc: string) =>
    set((state) => ({ recentDocs: [...state.recentDocs, doc] })),
  isLoading: false,
  error: null,
  response: null,
  setResponse: (response) => set({ response }),
  processDocument: async (file, files) => {
    set({ isLoading: true, error: null });

    try {
      let response;
      if (get().selectedOp === 'summarize') {
        response = await summarizeDocument(file);
      } else if (get().selectedOp === 'compare' && files) {
        response = await compareDocuments(files);
      } else if (get().selectedOp === 'image-to-text') {
        response = await imageToText(file);
      }
      set({ response: response });
    } catch (error: any) {
      console.error('Error processing document:', error);
      set({ error: error.message, response: null });
    } finally {
      set({ isLoading: false });
    }
  },
  clearResponse: () => set({ response: null, error: null }),
}));
