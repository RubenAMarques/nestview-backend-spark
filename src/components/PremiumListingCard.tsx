
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { MapPin, Bed, Bath, Square, Heart, Edit } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { Typography, Colors } from '@/theme/tokens';

interface Listing {
  id: string;
  title: string;
  description?: string;
  price_eur: number;
  bedrooms: number;
  bathrooms?: number;
  area_m2?: number;
  address?: string;
  city?: string;
  status: string;
  agent_id: string;
}

interface PremiumListingCardProps {
  listing: Listing;
  onEdit?: (listing: Listing) => void;
  onToggleFavorite?: (listingId: string) => void;
  isFavorited?: boolean;
  onClick?: () => void;
}

export const PremiumListingCard = ({ 
  listing, 
  onEdit, 
  onToggleFavorite, 
  isFavorited,
  onClick 
}: PremiumListingCardProps) => {
  const { user } = useAuth();
  const currentUser = useUser();
  const haptic = useHapticFeedback();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'need_fix':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'expired':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const canEdit = user?.id === listing.agent_id || user?.role === 'admin';
  const showAgentBadge = currentUser?.role === 'buyer' || currentUser?.role === 'investor';

  const handleHeartToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    haptic.light();
    onToggleFavorite?.(listing.id);
  };

  return (
    <div 
      className="group relative bg-[#1E1E1E] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      {/* Media-first image area */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-800 to-gray-900">
        {/* Placeholder for property image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <Square className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm opacity-75">Property Gallery</p>
          </div>
        </div>
        
        {/* Overlay gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Top badges and actions */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
          <div className="flex gap-2">
            {showAgentBadge && (
              <Badge className="bg-orange-500/90 text-white border-orange-500/30 text-xs px-2 py-1 font-medium backdrop-blur-sm">
                Agent Listed
              </Badge>
            )}
            <Badge className={`${getStatusColor(listing.status)} border text-xs px-2 py-1 backdrop-blur-sm`}>
              {listing.status.replace('_', ' ')}
            </Badge>
          </div>
          
          {onToggleFavorite && (
            <button
              onClick={handleHeartToggle}
              className="p-2 bg-black/30 backdrop-blur-sm rounded-full hover:bg-black/50 transition-all duration-200 active:scale-95"
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-white'}`} />
            </button>
          )}
        </div>

        {/* Bottom overlay content */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <GlassCard className="p-4">
            {/* Price - prominent display */}
            <div 
              className="text-2xl font-bold text-white mb-2"
              style={Typography.title}
            >
              {formatPrice(listing.price_eur)}
            </div>
            
            {/* Location */}
            {(listing.address || listing.city) && (
              <div className="flex items-center gap-1 text-white/80 mb-3">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {[listing.address, listing.city].filter(Boolean).join(', ')}
                </span>
              </div>
            )}
            
            {/* Property details */}
            <div className="flex gap-4 text-white/70">
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4" />
                <span className="text-sm">{listing.bedrooms}</span>
              </div>
              {listing.bathrooms && (
                <div className="flex items-center gap-1">
                  <Bath className="w-4 h-4" />
                  <span className="text-sm">{listing.bathrooms}</span>
                </div>
              )}
              {listing.area_m2 && (
                <div className="flex items-center gap-1">
                  <Square className="w-4 h-4" />
                  <span className="text-sm">{listing.area_m2}m²</span>
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Content section */}
      <div className="p-4">
        <h3 
          className="text-lg font-semibold text-white line-clamp-2 mb-2"
          style={Typography.subtitle}
        >
          {listing.title}
        </h3>
        
        {listing.description && (
          <p className="text-gray-300 text-sm line-clamp-2 mb-4 leading-relaxed">
            {listing.description}
          </p>
        )}

        {/* Edit button for authorized users */}
        {canEdit && onEdit && (
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(listing);
            }}
            className="w-full mt-2"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Property
          </Button>
        )}
      </div>
    </div>
  );
};
