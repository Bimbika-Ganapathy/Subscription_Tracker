import React, { useState } from 'react';
import { Calendar, Bell, Clock, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useTrackers } from '../hooks/useTrackers';

const ReminderCenter: React.FC = () => {
  const [selectedView, setSelectedView] = useState<'calendar' | 'list'>('calendar');
  const { trackers, loading } = useTrackers();

  const upcomingPayments = trackers
    .map(tracker => ({
      ...tracker,
      daysUntilDue: Math.ceil((new Date(tracker.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    }))
    .sort((a, b) => a.daysUntilDue - b.daysUntilDue);

  const overduePayments = upcomingPayments.filter(p => p.daysUntilDue < 0);
  const dueSoon = upcomingPayments.filter(p => p.daysUntilDue >= 0 && p.daysUntilDue <= 7);
  const upcoming = upcomingPayments.filter(p => p.daysUntilDue > 7);

  const mockNotifications = [
    {
      id: 1,
      type: 'warning',
      title: 'Payment Due Tomorrow',
      message: 'Your Electricity Bill ($85.50) is due tomorrow',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      type: 'info',
      title: 'Payment Reminder',
      message: 'Netflix subscription ($15.99) renews in 3 days',
      time: '1 day ago',
      read: false
    },
    {
      id: 3,
      type: 'success',
      title: 'Payment Confirmed',
      message: 'Adobe Creative Cloud payment was successful',
      time: '3 days ago',
      read: true
    },
    {
      id: 4,
      type: 'error',
      title: 'Payment Failed',
      message: 'Car Insurance payment needs attention',
      time: '1 week ago',
      read: true
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertCircle size={20} className="text-orange-500" />;
      case 'error': return <AlertCircle size={20} className="text-red-500" />;
      case 'success': return <CheckCircle size={20} className="text-green-500" />;
      default: return <Info size={20} className="text-blue-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-orange-50 border-orange-200';
      case 'error': return 'bg-red-50 border-red-200';
      case 'success': return 'bg-green-50 border-green-200';
      default: return 'bg-blue-50 border-blue-200';
    }
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
        <h1 className="text-2xl font-bold text-gray-900">Reminder Center</h1>
        <p className="text-gray-600 mt-1">Stay on top of all your payment deadlines</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600 mb-1">Overdue</p>
              <p className="text-2xl font-bold text-red-900">{overduePayments.length}</p>
            </div>
            <AlertCircle className="text-red-500" size={32} />
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600 mb-1">Due This Week</p>
              <p className="text-2xl font-bold text-orange-900">{dueSoon.length}</p>
            </div>
            <Clock className="text-orange-500" size={32} />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 mb-1">Upcoming</p>
              <p className="text-2xl font-bold text-blue-900">{upcoming.length}</p>
            </div>
            <Calendar className="text-blue-500" size={32} />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Payment Timeline */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Payment Timeline</h2>
          
          <div className="space-y-4">
            {overduePayments.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-red-600 mb-3">⚠️ Overdue</h3>
                <div className="space-y-3">
                  {overduePayments.map(payment => (
                    <div key={payment.id} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{payment.name}</p>
                        <p className="text-sm text-gray-500">{Math.abs(payment.daysUntilDue)} days overdue</p>
                      </div>
                      <span className="font-semibold text-red-600">${payment.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {dueSoon.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-orange-600 mb-3">🔔 Due This Week</h3>
                <div className="space-y-3">
                  {dueSoon.map(payment => (
                    <div key={payment.id} className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{payment.name}</p>
                        <p className="text-sm text-gray-500">
                          {payment.daysUntilDue === 0 ? 'Due today' : 
                           payment.daysUntilDue === 1 ? 'Due tomorrow' : 
                           `Due in ${payment.daysUntilDue} days`}
                        </p>
                      </div>
                      <span className="font-semibold text-orange-600">${payment.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {upcoming.slice(0, 5).length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-blue-600 mb-3">📅 Upcoming</h3>
                <div className="space-y-3">
                  {upcoming.slice(0, 5).map(payment => (
                    <div key={payment.id} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{payment.name}</p>
                        <p className="text-sm text-gray-500">Due in {payment.daysUntilDue} days</p>
                      </div>
                      <span className="font-semibold text-blue-600">${payment.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Notification History */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Notifications</h2>
            <Bell className="text-gray-400" size={20} />
          </div>

          <div className="space-y-4">
            {mockNotifications.map(notification => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border ${getNotificationColor(notification.type)} ${
                  !notification.read ? 'ring-2 ring-blue-500 ring-opacity-20' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">{notification.title}</p>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 py-2 text-sm text-blue-600 hover:text-blue-700 transition-colors">
            View All Notifications
          </button>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Reminder Timing</h4>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                <span className="text-sm text-gray-700">1 day before due date</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                <span className="text-sm text-gray-700">3 days before due date</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm text-gray-700">1 week before due date</span>
              </label>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Notification Methods</h4>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                <span className="text-sm text-gray-700">Email notifications</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm text-gray-700">SMS notifications</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                <span className="text-sm text-gray-700">Browser notifications</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReminderCenter;