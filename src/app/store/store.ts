"use client";
import { create } from "zustand";
import { PersistOptions, StorageValue, persist } from "zustand/middleware";
import { AuthState, ConfigurationsState } from "../helpers/types";

const storage: PersistOptions<AuthState, AuthState>["storage"] = {
  getItem: (name: string) => {
    const str = localStorage.getItem(name);
    return str ? JSON.parse(str) : null;
  },
  setItem: (name: string, value: StorageValue<AuthState>) =>
    localStorage.setItem(name, JSON.stringify(value)),
  removeItem: (name: string) => localStorage.removeItem(name),
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: "",
      refreshToken: "",
      organizations: [],
      projects: [],
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setRefreshToken: (refreshToken) => set({ refreshToken }),
      setOrganizations: (organizations) => set({ organizations }),
      setProjects: (projects) => set({ projects }),
    }),
    {
      name: "auth",
      storage,
    }
  )
);

export const useConfigurationsStore = create<ConfigurationsState>()(
  persist(
    (set) => ({
      configurations: {
        jobs: [],
        departments: [],
        employees: [],
      },
      setConfigurations: (configurations) => set({ configurations }),
    }),
    {
      name: "configurations",
      storage,
    }
  )
);
