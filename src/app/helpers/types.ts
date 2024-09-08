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
