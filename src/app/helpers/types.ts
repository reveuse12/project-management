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
  _id: string;
  name: string;
  email: string;
  fullname: string;
  username: string;
}

export interface Organization {
  _id: string;
  name: string;
}

export interface Task {
  _id?: string;
  name?: string;
  description?: string;
  status?: "OPEN" | "IN_PROGRESS";
}
export interface Role {
  _id: string;
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

export interface Memberss {
  _id: string;
  username: string;
  fullname: string;
  email: string;
}

export interface Organization {
  _id: string;
  name: string;
  description: string;
  projects?: Array<{
    _id?: string;
    title?: string;
    status?: string;
    members?: Array<{
      _id?: string;
      email?: string;
      name?: string;
      role?: string;
    }>;
  }>;
  admin?: {
    _id: string;
    email?: string;
    name?: string;
    fullname?: string;
  };
  members?: Array<{ user: { _id: string; fullname: string }; role?: string }>;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  status: string;
  organization: {
    _id: string;
    name: string | null;
  };
  members?: Array<{ _id?: string; email?: string; name?: string }>;
  admin?: Array<{ _id?: string; email?: string }>;
}

export interface MemberType {
  userId: string;
  roleId: string;
  organizationId: string;
}
