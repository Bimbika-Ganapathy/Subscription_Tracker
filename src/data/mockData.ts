import { Tracker, SummaryData, User } from '../types';

export const mockUser: User = {
  name: 'Sarah Johnson',
  email: 'sarah.johnson@email.com',
  avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
};

export const mockTrackers: Tracker[] = [
  {
    id: '1',
    name: 'Netflix',
    amount: 15.99,
    category: 'Entertainment',
    frequency: 'Monthly',
    dueDate: '2025-01-15',
    notes: 'Premium subscription',
    icon: 'Tv',
    color: 'bg-red-500',
    isActive: true
  },
  {
    id: '2',
    name: 'Spotify',
    amount: 9.99,
    category: 'Entertainment',
    frequency: 'Monthly',
    dueDate: '2025-01-20',
    notes: 'Individual plan',
    icon: 'Music',
    color: 'bg-green-500',
    isActive: true
  },
  {
    id: '3',
    name: 'Electricity Bill',
    amount: 85.50,
    category: 'Utilities',
    frequency: 'Monthly',
    dueDate: '2025-01-25',
    icon: 'Zap',
    color: 'bg-yellow-500',
    isActive: true
  },
  {
    id: '4',
    name: 'Adobe Creative Cloud',
    amount: 52.99,
    category: 'Software',
    frequency: 'Monthly',
    dueDate: '2025-01-10',
    icon: 'Palette',
    color: 'bg-purple-500',
    isActive: true
  },
  {
    id: '5',
    name: 'Car Insurance',
    amount: 156.00,
    category: 'Insurance',
    frequency: 'Monthly',
    dueDate: '2025-01-30',
    icon: 'Car',
    color: 'bg-blue-500',
    isActive: true
  },
  {
    id: '6',
    name: 'Amazon Prime',
    amount: 139.00,
    category: 'Shopping',
    frequency: 'Yearly',
    dueDate: '2025-03-15',
    icon: 'Package',
    color: 'bg-orange-500',
    isActive: true
  }
];

export const mockSummary: SummaryData = {
  totalTrackers: mockTrackers.filter(t => t.isActive).length,
  upcomingPayments: 3,
  monthlySpend: mockTrackers
    .filter(t => t.isActive && t.frequency === 'Monthly')
    .reduce((sum, t) => sum + t.amount, 0)
};

export const categories = [
  { name: 'Entertainment', icon: 'Tv', color: 'bg-red-500' },
  { name: 'Utilities', icon: 'Zap', color: 'bg-yellow-500' },
  { name: 'Software', icon: 'Palette', color: 'bg-purple-500' },
  { name: 'Insurance', icon: 'Shield', color: 'bg-blue-500' },
  { name: 'Shopping', icon: 'Package', color: 'bg-orange-500' },
  { name: 'Finance', icon: 'CreditCard', color: 'bg-green-500' },
  { name: 'Health', icon: 'Heart', color: 'bg-pink-500' },
  { name: 'Transportation', icon: 'Car', color: 'bg-indigo-500' }
];