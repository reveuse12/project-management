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
  _id: string;
  name: string;
  description?: string;
}

export interface Task {
  _id?: string;
  name?: string;
  description?: string;
  status?: "OPEN" | "IN_PROGRESS";
}
export interface Role {
  _id?: string;
  name?: string;
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

export interface Organization {
  _id: string | null;
  name: string;
  description?: string | null;
  members?: User[];
  projects?: Project[];
  admin?: User | null;
}

export interface OrganizationState {
  organizations: Organization[];
  setOrganizations: (organisations: Organization[]) => void;
  addOrganization: (organization: Organization) => void;
  updateOrganization: (organization: Organization) => void;
  deleteOrganization: (organizationId: string) => void;
}

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "dashboard",
    label: "Dashboard",
  },
  {
    title: "User profile",
    href: "/dashboard/profile",
    icon: "profile",
    label: "profile",
  },
  {
    title: "Organization",
    href: "/dashboard/organization",
    icon: "employee",
    label: "employee",
  },
  {
    title: "Projects",
    href: "/dashboard/project",
    icon: "kanban",
    label: "kanban",
  },
  {
    title: "Logout",
    href: "/",
    icon: "login",
    label: "login",
  },
];
