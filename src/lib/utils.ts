import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  features: string[];
  createdAt: any;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image: string;
  createdAt: any;
}

export interface Order {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  instagram: string;
  userId?: string;
  serviceId?: string;
  serviceName?: string;
  message: string;
  status: 'pending' | 'processing' | 'completed';
  createdAt: any;
}
