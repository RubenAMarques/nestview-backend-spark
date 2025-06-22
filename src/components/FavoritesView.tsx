
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MobileListingCard } from './MobileListingCard';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Heart } from 'lucide-react';

interface FavoritesViewProps {
  onEdit?: (listing: any) => void;
}

export const FavoritesView = ({ onEdit }: FavoritesViewProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ['favorites-mobile'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_favourites')
        .select(`
          listing_id,
          listings (*)
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data.map(f => f.listings).filter(Boolean);
    },
    enabled: !!user,
  });

  const { data: favoriteIds = [] } = useQuery({
    queryKey: ['favorite-ids'],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('user_favourites')
        .select('listing_id')
        .eq('user_id', user.id);
      if (error) throw error;
      return data.map(f => f.listing_id);
    },
    enabled: !!user,
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async (listingId: string) => {
      const isFavorited = favoriteIds.includes(listingId);
      
      if (isFavorited) {
        const { error } = await supabase
          .from('user_favourites')
          .delete()
          .eq('user_id', user!.id)
          .eq('listing_id', listingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_favourites')
          .insert({ user_id: user!.id, listing_id: listingId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites-mobile'] });
      queryClient.invalidateQueries({ queryKey: ['favorite-ids'] });
      toast({
        title: "Success",
        description: "Favorites updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex-1 bg-gray-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading favorites...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="p-4 bg-gray-800 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white">Saved Properties</h1>
        <p className="text-gray-400 text-sm mt-1">
          {favorites.length} saved propert{favorites.length !== 1 ? 'ies' : 'y'}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 px-8">
            <Heart className="w-16 h-16 text-gray-600 mb-4" />
            <div className="text-gray-400 text-lg text-center">No saved properties</div>
            <div className="text-gray-500 text-sm text-center mt-2">
              Properties you save will appear here
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {favorites.map((listing) => (
              <MobileListingCard
                key={listing.id}
                listing={listing}
                onEdit={onEdit}
                onToggleFavorite={(id) => toggleFavoriteMutation.mutate(id)}
                isFavorited={favoriteIds.includes(listing.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
