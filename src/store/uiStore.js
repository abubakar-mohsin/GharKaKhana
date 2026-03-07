import { create } from 'zustand';

/**
 * Global UI state store (client-side only).
 * For server state (data fetching) use React Query instead.
 */
export const useUIStore = create((set) => ({
  // ─── Sidebar ─────────────────────────────────────────────────────────────
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (value) => set({ sidebarOpen: value }),

  // ─── Global loading overlay ───────────────────────────────────────────────
  isLoading: false,
  setLoading: (value) => set({ isLoading: value }),

  // ─── Toast / notification queue ───────────────────────────────────────────
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { id: Date.now(), ...toast }],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  // ─── Active modal ─────────────────────────────────────────────────────────
  activeModal: null,
  openModal: (name) => set({ activeModal: name }),
  closeModal: () => set({ activeModal: null }),
}));
