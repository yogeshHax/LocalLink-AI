// Domain Models for LocalLink

export enum TransactionType {
  MONETARY = 'MONETARY',
  CREDIT = 'CREDIT', // Time-Credits
}

export enum SkillCategory {
  EDUCATION = 'Education',
  MANUAL_LABOR = 'Home & Repair',
  TECH = 'Technology',
  CREATIVE = 'Creative & Arts',
  WELLNESS = 'Health & Wellness',
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
  hourlyRate?: number; // USD
  creditValue: number; // usually 1 credit per hour
  images?: string[];
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  location: string;
  coordinates: { lat: number; lng: number }; // For map mock
  trustScore: number; // 0-100
  isVerified: boolean;
  bio?: string;
  
  // Dual-State Profile
  skillsOffered: Skill[];
  skillsNeeded: string[]; // List of tags/skills they are looking for
  
  // Wallet
  credits: number;
}

export interface Booking {
  id: string;
  providerId: string;
  seekerId: string;
  skillId: string;
  date: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED';
  paymentType: TransactionType;
  totalAmount: number; // Either USD or Credits
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: Date;
  isSystem?: boolean; // For automated negotiation prompts
}

export interface ChatSession {
  id: string;
  participantId: string; // The other person
  lastMessage: string;
  updatedAt: Date;
  unreadCount: number;
}