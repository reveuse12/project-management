"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const storage = {
  getItem: (name) => JSON.parse(localStorage.getItem(name)),
  setItem: (name, value) => localStorage.setItem(name, JSON.stringify(value)),
  removeItem: (name) => localStorage.removeItem(name),
};

export const AuthStore = create(
  persist(
    (set) => ({
      user: [],
      token: "",
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      clearToken: () => set({ token: "" }),
      refreshToken: "",
      setRefreshToken: (refreshToken) => set({ refreshToken }),
      clearRefreshToken: () => set({ refreshToken: "" }),
    }),
    {
      name: "auth",
      storage,
    }
  )
);

export const useConfigurationsStore = create(
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
