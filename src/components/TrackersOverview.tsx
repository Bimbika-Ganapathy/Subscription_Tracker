import React, { useState } from 'react';
import { Search, Filter, SortAsc, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import TrackerCard from './TrackerCard';
import { useTrackers } from '../hooks/useTrackers';
import { Tracker } from '../types';

const TrackersOverview: React.FC = () => {
  const { trackers, loading, deleteTracker } = useTrackers();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('dueDate');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = ['all', ...Array.from(new Set(trackers.map(t => t.category)))];

  const filteredAndSortedTrackers = trackers
    .filter(tracker => {
      const matchesSearch = tracker.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || tracker.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'amount':
          return b.amount - a.amount;
        case 'dueDate':
        default:
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      }
    });

  const handleDeleteTracker = async (id: string) => {
    await deleteTracker(id);
  };

  const totalMonthlySpend = filteredAndSortedTrackers
    .filter(t => t.frequency === 'Monthly')
    .reduce((sum, t) => sum + t.amount, 0);

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
            <h1 className="text-2xl font-bold text-gray-900">All Trackers</h1>
            <p className="text-gray-600 mt-1">
              Manage all your subscription and bill trackers
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-600">Total Active</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{filteredAndSortedTrackers.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-600">Monthly Spend</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">${totalMonthlySpend.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-600">Due This Week</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {filteredAndSortedTrackers.filter(t => {
              const dueDate = new Date(t.due_date);
              const today = new Date();
              const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
              return dueDate >= today && dueDate <= weekFromNow;
            }).length}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search trackers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none bg-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="relative">
            <SortAsc className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none bg-white"
            >
              <option value="dueDate">Sort by Due Date</option>
              <option value="name">Sort by Name</option>
              <option value="amount">Sort by Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Trackers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedTrackers.map((tracker) => (
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

      {filteredAndSortedTrackers.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No trackers found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || filterCategory !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first tracker'}
          </p>
          <Link
            to="/add-tracker"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Add Your First Tracker
          </Link>
        </div>
      )}
    </div>
  );
};

export default TrackersOverview;