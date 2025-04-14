import { create } from "zustand";

interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

interface FileStore {
  files: FileItem[];
  setFiles: (files: FileItem[]) => void;
  addFile: (file: FileItem) => void;
}

export const useFileStore = create<FileStore>((set) => ({
  files: [],
  setFiles: (files) => set({ files }),
  addFile: (file) => set((state) => ({ files: [...state.files, file] })),
}));
