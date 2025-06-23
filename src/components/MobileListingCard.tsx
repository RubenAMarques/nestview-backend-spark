
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Heart, MapPin, Bed, Bath, Square, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LuxuryCard, LuxuryCardContent } from '@/components/ui/luxury-card';
import { Typography } from '@/theme/tokens';

interface MobileListingCardProps {
  listing: any;
  onEdit?: (listing: any) => void;
  onToggleFavorite?: (listingId: string) => void;
  isFavorited?: boolean;
  showFullDetails?: boolean;
  onClick?: () => void;
}

export const MobileListingCard = ({ 
  listing, 
  onEdit, 
  onToggleFavorite,
  isFavorited = false,
  showFullDetails = true,
  onClick
}: MobileListingCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLocalFavorited, setIsLocalFavorited] = useState(isFavorited);

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Must be logged in to save properties');
      
      if (isLocalFavorited) {
        const { error } = await supabase
          .from('user_favourites')
          .delete()
          .eq('user_id', user.id)
          .eq('listing_id', listing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_favourites')
          .insert({ user_id: user.id, listing_id: listing.id });
        if (error) throw error;
      }
    },
    onMutate: () => {
      // Optimistic update
      setIsLocalFavorited(!isLocalFavorited);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites-mobile'] });
      queryClient.invalidateQueries({ queryKey: ['favorite-ids'] });
      toast({
        title: isLocalFavorited ? "Removed from favorites" : "Added to favorites",
        description: isLocalFavorited ? "Property removed from your saved list" : "Property saved to your favorites",
      });
      
      if (onToggleFavorite) {
        onToggleFavorite(listing.id);
      }
    },
    onError: () => {
      // Revert optimistic update
      setIsLocalFavorited(isLocalFavorited);
      toast({
        title: "Error",
        description: "Unable to update favorites. Please try again.",
        variant: "destructive",
      });
    },
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const canEdit = user?.id === listing.agent_id || user?.role === 'admin';

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger card click if clicking on action buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onClick?.();
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user) {
      toggleFavoriteMutation.mutate();
    } else {
      toast({
        title: "Sign in required",
        description: "Please sign in to save properties to your favorites",
        variant: "destructive",
      });
    }
  };

  return (
    <LuxuryCard 
      className={`w-full transition-transform hover:scale-[1.02] ${onClick ? 'cursor-pointer' : ''}`}
      onClick={handleCardClick}
    >
      <LuxuryCardContent className="p-0">
        <div className="relative">
          {/* Mock Property Image */}
          <div className="h-48 bg-gradient-to-br from-gray-700 to-gray-800 rounded-t-2xl flex items-center justify-center">
            <Square className="w-16 h-16 text-gray-400" />
          </div>
          
          {/* Heart Button */}
          <Button
            onClick={handleFavoriteClick}
            variant="glass"
            size="sm"
            className="absolute top-3 right-3 rounded-full p-2"
            disabled={toggleFavoriteMutation.isPending}
          >
            <Heart className={`w-5 h-5 transition-colors ${
              isLocalFavorited ? 'fill-red-500 text-red-500' : 'text-white'
            }`} />
          </Button>
        </div>

        <div className="p-4">
          {/* Price */}
          <div className="text-2xl font-bold text-amber-400 mb-2">
            {formatPrice(listing.price_eur)}
          </div>

          {/* Title */}
          <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
            {listing.title}
          </h3>

          {/* Property Details */}
          <div className="flex gap-4 mb-3 text-gray-300">
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              <span className="text-sm">{listing.bedrooms} bed{listing.bedrooms !== 1 ? 's' : ''}</span>
            </div>
            {listing.bathrooms && (
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                <span className="text-sm">{listing.bathrooms} bath{listing.bathrooms !== 1 ? 's' : ''}</span>
              </div>
            )}
            {listing.area_m2 && (
              <div className="flex items-center gap-1">
                <Square className="w-4 h-4" />
                <span className="text-sm">{listing.area_m2}m²</span>
              </div>
            )}
          </div>

          {/* Location */}
          {(listing.address || listing.city) && (
            <div className="flex items-center gap-1 text-gray-400 text-sm mb-4">
              <MapPin className="w-4 h-4" />
              <span className="line-clamp-1">
                {[listing.address, listing.city].filter(Boolean).join(', ')}
              </span>
            </div>
          )}

          {/* Description (if showing full details) */}
          {showFullDetails && listing.description && (
            <p className="text-gray-300 text-sm mb-4 line-clamp-3">
              {listing.description}
            </p>
          )}

          {/* Edit Button for agents */}
          {canEdit && onEdit && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(listing);
              }}
              variant="outline"
              size="sm"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Listing
            </Button>
          )}
        </div>
      </LuxuryCardContent>
    </LuxuryCard>
  );
};
