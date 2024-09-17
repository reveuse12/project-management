import { Icons } from "@/components/icons";

export interface SendEmailParams {
  email: string;
  emailType: "VERIFY" | "RESET";
  userId: string;
}

export interface MailResponse {
  accepted?: string[];
  rejected?: string[];
  envelopeTime: number;
  messageTime: number;
  messageSize: number;
  response: string;
}

export interface LoginRequestBody {
  username: string;
  password: string;
}

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Organization {
  id: string;
  name: string;
}

export interface Project {
  id: string;
  name: string;
}
export interface AuthState {
  token: string;
  refreshToken: string;
  user: User | null;
  organizations: Organization[];
  projects: Project[];
  setUser: (user: User | null) => void;
  setToken: (token: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  setOrganizations: (organizations: Organization[]) => void;
  setProjects: (projects: Project[]) => void;
}

export interface Configuration {
  jobs: string[];
  departments: string[];
  employees: string[];
}

export interface ConfigurationsState {
  configurations: Configuration;
  setConfigurations: (configurations: Configuration) => void;
}
