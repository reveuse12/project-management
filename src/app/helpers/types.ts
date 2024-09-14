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
  icon?: keyof typeof Icons; // Correctly type icon to be keyof Icons
  label?: string;
  description?: string;
}
