import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { DbApiKey } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export interface ApiKey extends Omit<DbApiKey, 'created_at'> {
  createdAt: string;
}

export interface NotificationState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notificationState, setNotificationState] = useState<NotificationState>({
    show: false,
    message: '',
    type: 'success'
  });

  const fetchApiKeys = async () => {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setApiKeys(
        data.map(key => ({
          ...key,
          createdAt: key.created_at,
        }))
      );
    } catch (error) {
      console.error('Error fetching API keys:', error);
      showNotification('Failed to fetch API keys', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const createApiKey = async (name: string, _monthlyLimit: string) => {
    try {
      const newKey: Omit<DbApiKey, 'id'> = {
        name,
        key: `dandi-${uuidv4()}`,
        created_at: new Date().toISOString(),
        usage: 0,
      };

      const { data, error } = await supabase
        .from('api_keys')
        .insert([newKey])
        .select()
        .single();

      if (error) throw error;

      setApiKeys(keys => [{
        ...data,
        createdAt: data.created_at,
      }, ...keys]);
      
      showNotification('API Key created successfully', 'success');
      return true;
    } catch (error) {
      console.error('Error creating API key:', error);
      showNotification('Failed to create API Key', 'error');
      return false;
    }
  };

  const updateApiKey = async (id: string, name: string) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ name })
        .eq('id', id);

      if (error) throw error;

      setApiKeys(keys => keys.map(key => 
        key.id === id 
          ? { ...key, name }
          : key
      ));
      
      showNotification('API Key updated successfully', 'success');
      return true;
    } catch (error) {
      console.error('Error updating API key:', error);
      showNotification('Failed to update API Key', 'error');
      return false;
    }
  };

  const deleteApiKey = async (id: string) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setApiKeys(keys => keys.filter(key => key.id !== id));
      
      showNotification('API Key deleted successfully', 'error');
      return true;
    } catch (error) {
      console.error('Error deleting API key:', error);
      showNotification('Failed to delete API Key', 'error');
      return false;
    }
  };

  const showNotification = (message: string, type: NotificationState['type']) => {
    setNotificationState({
      show: true,
      message,
      type
    });
  };

  const closeNotification = () => {
    setNotificationState(prev => ({ ...prev, show: false }));
  };

  return {
    apiKeys,
    isLoading,
    notificationState,
    fetchApiKeys,
    createApiKey,
    updateApiKey,
    deleteApiKey,
    showNotification,
    closeNotification
  };
} 