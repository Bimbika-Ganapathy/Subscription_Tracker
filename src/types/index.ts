export interface Tracker {
  id: string;
  name: string;
  amount: number;
  category: string;
  frequency: 'Monthly' | 'Yearly' | 'Custom';
  dueDate: string;
  notes?: string;
  icon: string;
  color: string;
  isActive: boolean;
}

export interface SummaryData {
  totalTrackers: number;
  upcomingPayments: number;
  monthlySpend: number;
}

export interface User {
  name: string;
  email: string;
  avatar: string;
}