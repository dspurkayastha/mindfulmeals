import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import Toast from 'react-native-toast-message';
import { PANTRY_CATEGORIES } from '@/config/constants';

export interface PantryItem {
  id: string;
  name: string;
  category: typeof PANTRY_CATEGORIES[number];
  quantity: number;
  unit: string;
  expiryDate?: string;
  lowStockThreshold?: number;
  notes?: string;
  gratitudeNote?: string; // Mindfulness feature
  addedAt: string;
  updatedAt: string;
}

interface CreatePantryItemData {
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expiryDate?: string;
  lowStockThreshold?: number;
  notes?: string;
  gratitudeNote?: string;
}

interface UpdatePantryItemData extends Partial<CreatePantryItemData> {
  id: string;
}

// Get all pantry items
export const usePantryItems = () => {
  return useQuery({
    queryKey: ['pantryItems'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ items: PantryItem[] }>('/pantry/items');
      return data.items;
    },
  });
};

// Get single pantry item
export const usePantryItem = (id: string) => {
  return useQuery({
    queryKey: ['pantryItems', id],
    queryFn: async () => {
      const { data } = await apiClient.get<{ item: PantryItem }>(`/pantry/items/${id}`);
      return data.item;
    },
    enabled: !!id,
  });
};

// Add pantry item
export const useAddPantryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemData: CreatePantryItemData) => {
      const { data } = await apiClient.post<{ item: PantryItem }>('/pantry/items', itemData);
      return data.item;
    },
    onSuccess: (newItem) => {
      // Update cache
      queryClient.invalidateQueries({ queryKey: ['pantryItems'] });
      
      // Show mindful success message
      const message = newItem.gratitudeNote 
        ? 'Added with gratitude! 🙏' 
        : 'Item added to your pantry!';
        
      Toast.show({
        type: 'success',
        text1: message,
        text2: `${newItem.name} is now in your pantry`,
        position: 'top',
      });
    },
  });
};

// Update pantry item
export const useUpdatePantryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdatePantryItemData) => {
      const { data } = await apiClient.patch<{ item: PantryItem }>(
        `/pantry/items/${id}`,
        updates
      );
      return data.item;
    },
    onSuccess: (updatedItem) => {
      // Update cache
      queryClient.invalidateQueries({ queryKey: ['pantryItems'] });
      queryClient.invalidateQueries({ queryKey: ['pantryItems', updatedItem.id] });
      
      Toast.show({
        type: 'success',
        text1: 'Updated successfully',
        text2: `${updatedItem.name} has been updated`,
        position: 'top',
      });
    },
  });
};

// Delete pantry item
export const useDeletePantryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/pantry/items/${id}`);
      return id;
    },
    onSuccess: (deletedId) => {
      // Update cache
      queryClient.invalidateQueries({ queryKey: ['pantryItems'] });
      
      Toast.show({
        type: 'info',
        text1: 'Item removed',
        text2: 'Thank you for using it mindfully',
        position: 'top',
      });
    },
  });
};

// Get expiring items
export const useExpiringItems = (daysAhead: number = 7) => {
  return useQuery({
    queryKey: ['pantryItems', 'expiring', daysAhead],
    queryFn: async () => {
      const { data } = await apiClient.get<{ items: PantryItem[] }>(
        `/pantry/items/expiring?days=${daysAhead}`
      );
      return data.items;
    },
  });
};

// Get low stock items
export const useLowStockItems = () => {
  return useQuery({
    queryKey: ['pantryItems', 'lowStock'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ items: PantryItem[] }>('/pantry/items/low-stock');
      return data.items;
    },
  });
};

// Bulk update for shopping
export const useBulkUpdatePantryItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Array<{ id: string; quantity: number }>) => {
      const { data } = await apiClient.post('/pantry/items/bulk-update', { updates });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pantryItems'] });
      
      Toast.show({
        type: 'success',
        text1: 'Pantry restocked!',
        text2: 'Enjoy your fresh ingredients mindfully',
        position: 'top',
      });
    },
  });
};