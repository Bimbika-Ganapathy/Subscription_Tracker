import React from 'react';
import { Calendar, DollarSign, Edit2, Trash2 } from 'lucide-react';
import { Tracker } from '../types';
import * as Icons from 'lucide-react';

interface TrackerCardProps {
  tracker: Tracker;
  onEdit?: (tracker: Tracker) => void;
  onDelete?: (id: string) => void;
}

const TrackerCard: React.FC<TrackerCardProps> = ({ tracker, onEdit, onDelete }) => {
  // Get the icon component dynamically
  const IconComponent = (Icons as any)[tracker.icon] || Icons.Package;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return 'Overdue';
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else {
      return `Due in ${diffDays} days`;
    }
  };

  const getDueDateColor = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'text-red-600 bg-red-50';
    if (diffDays <= 3) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${tracker.color}`}>
            <IconComponent className="text-white" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{tracker.name}</h3>
            <p className="text-sm text-gray-500">{tracker.category}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {onEdit && (
            <button
              onClick={() => onEdit(tracker)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Edit2 size={16} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(tracker.id)}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DollarSign size={16} className="text-gray-400" />
            <span className="font-semibold text-lg text-gray-900">
              ${tracker.amount.toFixed(2)}
            </span>
          </div>
          <span className="text-sm text-gray-500">{tracker.frequency}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">
              {new Date(tracker.dueDate).toLocaleDateString()}
            </span>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDueDateColor(tracker.dueDate)}`}>
            {formatDate(tracker.dueDate)}
          </span>
        </div>

        {tracker.notes && (
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500">{tracker.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackerCard;