import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Tracker } from '../types';
import { useAuth } from './useAuth';

export function useTrackers() {
  const [trackers, setTrackers] = useState<Tracker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchTrackers = async () => {
    if (!user) {
      setTrackers([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('trackers')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('due_date', { ascending: true });

      if (error) throw error;

      setTrackers(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addTracker = async (tracker: Omit<Tracker, 'id' | 'isActive'>) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('trackers')
        .insert([
          {
            user_id: user.id,
            name: tracker.name,
            amount: tracker.amount,
            category: tracker.category,
            frequency: tracker.frequency,
            due_date: tracker.dueDate,
            notes: tracker.notes || '',
            icon: tracker.icon,
            color: tracker.color,
            is_active: true,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      await fetchTrackers();
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      return { data: null, error: errorMessage };
    }
  };

  const updateTracker = async (id: string, updates: Partial<Tracker>) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('trackers')
        .update({
          name: updates.name,
          amount: updates.amount,
          category: updates.category,
          frequency: updates.frequency,
          due_date: updates.dueDate,
          notes: updates.notes,
          icon: updates.icon,
          color: updates.color,
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      await fetchTrackers();
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      return { data: null, error: errorMessage };
    }
  };

  const deleteTracker = async (id: string) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('trackers')
        .update({ is_active: false })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchTrackers();
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      return { error: errorMessage };
    }
  };

  useEffect(() => {
    fetchTrackers();
  }, [user]);

  return {
    trackers,
    loading,
    error,
    addTracker,
    updateTracker,
    deleteTracker,
    refetch: fetchTrackers,
  };
}