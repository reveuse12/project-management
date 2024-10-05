"use client";
import { create } from "zustand";
import { PersistOptions, StorageValue, persist } from "zustand/middleware";
import {
  AuthState,
  OrganizationState,
  User,
  Project,
  Task,
  Role,
} from "../helpers/types";

// Auth Store (already implemented)
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

const organizationStorage: PersistOptions<OrganizationState>["storage"] = {
  getItem: (name: string) => {
    const str = localStorage.getItem(name);
    return str ? JSON.parse(str) : null;
  },
  setItem: (name: string, value: StorageValue<OrganizationState>) =>
    localStorage.setItem(name, JSON.stringify(value)),
  removeItem: (name: string) => localStorage.removeItem(name),
};

export const useOrganizationStore = create<OrganizationState>()(
  persist(
    (set) => ({
      organizations: [],
      setOrganizations: (organizations) => set({ organizations }),
      addOrganization: (organization) =>
        set((state) => ({
          organizations: [...state.organizations, organization],
        })),
      updateOrganization: (updatedOrg) =>
        set((state) => ({
          organizations: state.organizations.map((org) =>
            org._id === updatedOrg._id ? updatedOrg : org
          ),
        })),
      deleteOrganization: (orgId) =>
        set((state) => ({
          organizations: state.organizations.filter((org) => org._id !== orgId),
        })),
    }),
    {
      name: "organization",
      storage: organizationStorage,
    }
  )
);

// Project Store
interface ProjectState {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  deleteAllProjects: () => void;
}

const projectStorage: PersistOptions<ProjectState>["storage"] = {
  getItem: (name: string) => {
    const str = localStorage.getItem(name);
    return str ? JSON.parse(str) : null;
  },
  setItem: (name: string, value: StorageValue<ProjectState>) =>
    localStorage.setItem(name, JSON.stringify(value)),
  removeItem: (name: string) => localStorage.removeItem(name),
};

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      projects: [],
      setProjects: (projects) => set({ projects }),
      addProject: (project) =>
        set((state) => ({ projects: [...state.projects, project] })),
      updateProject: (updatedProject) =>
        set((state) => ({
          projects: state.projects.map((project) =>
            project._id === updatedProject._id ? updatedProject : project
          ),
        })),
      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((project) => project._id !== id),
        })),
      deleteAllProjects: () => set({ projects: [] }),
    }),
    {
      name: "project",
      storage: projectStorage,
    }
  )
);

// Task Store
interface TaskState {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  deleteAllTasks: () => void;
}

const taskStorage: PersistOptions<TaskState>["storage"] = {
  getItem: (name: string) => {
    const str = localStorage.getItem(name);
    return str ? JSON.parse(str) : null;
  },
  setItem: (name: string, value: StorageValue<TaskState>) =>
    localStorage.setItem(name, JSON.stringify(value)),
  removeItem: (name: string) => localStorage.removeItem(name),
};

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      setTasks: (tasks) => set({ tasks }),
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      updateTask: (updatedTask) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task._id === updatedTask._id ? updatedTask : task
          ),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task._id !== id),
        })),
      deleteAllTasks: () => set({ tasks: [] }),
    }),
    {
      name: "task",
      storage: taskStorage,
    }
  )
);

// Role Store
interface RoleState {
  roles: Role[];
  setRoles: (roles: Role[]) => void;
  addRole: (role: Role) => void;
  updateRole: (role: Role) => void;
  deleteRole: (id: string) => void;
}

const roleStorage: PersistOptions<RoleState>["storage"] = {
  getItem: (name: string) => {
    const str = localStorage.getItem(name);
    return str ? JSON.parse(str) : null;
  },
  setItem: (name: string, value: StorageValue<RoleState>) =>
    localStorage.setItem(name, JSON.stringify(value)),
  removeItem: (name: string) => localStorage.removeItem(name),
};

export const useRoleStore = create<RoleState>()(
  persist(
    (set) => ({
      roles: [],
      setRoles: (roles) => set({ roles }),
      addRole: (role) => set((state) => ({ roles: [...state.roles, role] })),
      updateRole: (updatedRole) =>
        set((state) => ({
          roles: state.roles.map((role) =>
            role._id === updatedRole._id ? updatedRole : role
          ),
        })),
      deleteRole: (id) =>
        set((state) => ({
          roles: state.roles.filter((role) => role._id !== id),
        })),
    }),
    {
      name: "role",
      storage: roleStorage,
    }
  )
);
