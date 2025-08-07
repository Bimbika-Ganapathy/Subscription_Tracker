import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { categories } from '../data/mockData';
import { useTrackers } from '../hooks/useTrackers';
import * as Icons from 'lucide-react';

const AddTracker: React.FC = () => {
  const navigate = useNavigate();
  const { addTracker } = useTrackers();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: '',
    frequency: 'Monthly',
    dueDate: '',
    notes: '',
  });
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCategory) {
      setError('Please select a category');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await addTracker({
        name: formData.name,
        amount: parseFloat(formData.amount),
        category: selectedCategory.name,
        frequency: formData.frequency as 'Monthly' | 'Yearly' | 'Custom',
        dueDate: formData.dueDate,
        notes: formData.notes,
        icon: selectedCategory.icon,
        color: selectedCategory.color,
      });

      if (error) throw new Error(error);
      
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCategorySelect = (category: any) => {
    setSelectedCategory(category);
    setFormData({
      ...formData,
      category: category.name,
    });
  };

  const popularServices = [
    { name: 'Netflix', category: 'Entertainment', amount: '15.99', icon: 'Tv', color: 'bg-red-500' },
    { name: 'Spotify', category: 'Entertainment', amount: '9.99', icon: 'Music', color: 'bg-green-500' },
    { name: 'Adobe Creative Cloud', category: 'Software', amount: '52.99', icon: 'Palette', color: 'bg-purple-500' },
    { name: 'Amazon Prime', category: 'Shopping', amount: '139.00', icon: 'Package', color: 'bg-orange-500' },
    { name: 'YouTube Premium', category: 'Entertainment', amount: '11.99', icon: 'Play', color: 'bg-red-600' },
    { name: 'Microsoft 365', category: 'Software', amount: '99.99', icon: 'FileText', color: 'bg-blue-600' },
  ];

  const useTemplate = (service: any) => {
    setFormData({
      ...formData,
      name: service.name,
      amount: service.amount,
      category: service.category,
    });
    const categoryData = categories.find(c => c.name === service.category);
    setSelectedCategory(categoryData);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Add New Tracker</h1>
        <p className="text-gray-600 mt-1">Create a tracker for your subscription or bill</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Service Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="e.g., Netflix, Electricity Bill"
                required
              />
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Amount *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  step="0.01"
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => {
                  const IconComponent = (Icons as any)[category.icon] || Icons.Package;
                  return (
                    <button
                      key={category.name}
                      type="button"
                      onClick={() => handleCategorySelect(category)}
                      className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${
                        selectedCategory?.name === category.name
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`p-1 rounded ${category.color}`}>
                        <IconComponent className="text-white" size={16} />
                      </div>
                      <span className="text-sm font-medium">{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-2">
                Frequency *
              </label>
              <select
                id="frequency"
                name="frequency"
                value={formData.frequency}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              >
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
                <option value="Custom">Custom</option>
              </select>
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                Next Due Date *
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Notes (optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Add any additional notes..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save size={20} className="mr-2" />
                  Create Tracker
                </>
              )}
            </button>
          </form>
        </div>

        {/* Templates */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Popular Services</h3>
            <p className="text-sm text-gray-600 mb-4">Quick setup with pre-filled templates</p>
            
            <div className="space-y-3">
              {popularServices.map((service, index) => {
                const IconComponent = (Icons as any)[service.icon] || Icons.Package;
                return (
                  <button
                    key={index}
                    onClick={() => useTemplate(service)}
                    className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${service.color}`}>
                        <IconComponent className="text-white" size={16} />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">{service.name}</p>
                        <p className="text-sm text-gray-500">{service.category}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-gray-900">${service.amount}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-semibold text-blue-900 mb-2">💡 Pro Tip</h3>
            <p className="text-sm text-blue-800">
              Set your due date a few days before the actual payment to give yourself time to prepare 
              and avoid any last-minute surprises.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTracker;