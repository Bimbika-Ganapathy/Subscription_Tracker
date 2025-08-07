import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, CreditCard, Calendar, DollarSign, TrendingUp, Bell } from 'lucide-react';
import SummaryCard from './SummaryCard';
import TrackerCard from './TrackerCard';
import { useTrackers } from '../hooks/useTrackers';
import { useAuth } from '../hooks/useAuth';
import { Tracker } from '../types';

const Dashboard: React.FC = () => {
  const { trackers, loading, deleteTracker } = useTrackers();
  const { user } = useAuth();
  
  const upcomingTrackers = trackers
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 4);

  const monthlySpend = trackers
    .filter(t => t.frequency === 'Monthly')
    .reduce((sum, t) => sum + t.amount, 0);

  const upcomingPayments = trackers.filter(t => {
    const dueDate = new Date(t.due_date);
    const today = new Date();
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return dueDate >= today && dueDate <= weekFromNow;
  }).length;

  const userName = user?.user_metadata?.full_name?.split(' ')[0] || 'there';

  const recentActivity = [
    { type: 'payment', description: 'Netflix subscription renewed', amount: 15.99, date: '2 days ago' },
    { type: 'reminder', description: 'Electricity bill reminder sent', date: '1 week ago' },
    { type: 'added', description: 'Adobe Creative Cloud tracker added', date: '2 weeks ago' },
  ];

  const handleDeleteTracker = async (id: string) => {
    await deleteTracker(id);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {userName}! 👋
            </h1>
            <p className="text-gray-600 mt-1">
              Here's what's happening with your subscriptions and bills
            </p>
          </div>
          <Link
            to="/add-tracker"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Add Tracker
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SummaryCard
          title="Active Trackers"
          value={trackers.length}
          icon={CreditCard}
          color="bg-blue-500"
          subtitle="Subscriptions & Bills"
        />
        <SummaryCard
          title="Upcoming Payments"
          value={upcomingPayments}
          icon={Calendar}
          color="bg-orange-500"
          subtitle="Next 7 days"
        />
        <SummaryCard
          title="Monthly Spend"
          value={`$${monthlySpend.toFixed(2)}`}
          icon={DollarSign}
          color="bg-green-500"
          subtitle="Recurring monthly"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Payments */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Payments</h2>
              <Link
                to="/trackers"
                className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                View all
              </Link>
            </div>
            
            <div className="grid gap-4">
              {upcomingTrackers.map((tracker) => (
                <TrackerCard 
                  key={tracker.id} 
                  tracker={{
                    id: tracker.id,
                    name: tracker.name,
                    amount: tracker.amount,
                    category: tracker.category,
                    frequency: tracker.frequency,
                    dueDate: tracker.due_date,
                    notes: tracker.notes || '',
                    icon: tracker.icon,
                    color: tracker.color,
                    isActive: tracker.is_active
                  }}
                  onDelete={handleDeleteTracker}
                />
              ))}
            </div>

            {upcomingTrackers.length === 0 && (
              <div className="text-center py-12">
                <Calendar size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {trackers.length === 0 ? 'No trackers yet' : 'No upcoming payments'}
                </p>
                {trackers.length === 0 && (
                  <Link
                    to="/add-tracker"
                    className="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    <Plus size={16} className="mr-2" />
                    Add Your First Tracker
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp size={16} className="text-green-500" />
                  <span className="text-sm text-gray-600">This month</span>
                </div>
               <span className="font-medium text-gray-900">${monthlySpend.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar size={16} className="text-blue-500" />
                  <span className="text-sm text-gray-600">This year</span>
                </div>
               <span className="font-medium text-gray-900">${(monthlySpend * 12).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell size={16} className="text-orange-500" />
                  <span className="text-sm text-gray-600">Overdue</span>
                </div>
                <span className="font-medium text-red-600">$0.00</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;