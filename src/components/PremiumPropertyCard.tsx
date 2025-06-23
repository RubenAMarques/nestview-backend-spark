
import { useState } from 'react';
import { Heart, Bed, Bath, Square, MapPin, Star } from 'lucide-react';
import { LuxuryCard } from '@/components/ui/luxury-card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
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

interface PremiumPropertyCardProps {
  listing: Listing;
  onEdit?: (listing: Listing) => void;
  onToggleFavorite?: (listingId: string) => void;
  isFavorited?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'featured' | 'compact';
}

export const PremiumPropertyCard = ({ 
  listing, 
  onEdit, 
  onToggleFavorite, 
  isFavorited,
  onClick,
  variant = 'default'
}: PremiumPropertyCardProps) => {
  const { user } = useAuth();
  const haptic = useHapticFeedback();
  const [imageLoaded, setImageLoaded] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusIndicator = (status: string) => {
    const statusConfig = {
      approved: { label: 'Available', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
      pending: { label: 'Coming Soon', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
      need_fix: { label: 'Under Review', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
      rejected: { label: 'Unavailable', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
      expired: { label: 'Expired', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
      default: { label: status, color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.default;
  };

  const canEdit = user?.id === listing.agent_id || user?.role === 'admin';
  const statusInfo = getStatusIndicator(listing.status);

  const handleHeartToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    haptic.light();
    onToggleFavorite?.(listing.id);
  };

  const cardHeight = variant === 'featured' ? 'h-96' : variant === 'compact' ? 'h-64' : 'h-80';

  return (
    <LuxuryCard 
      variant="glass"
      glow={variant === 'featured'}
      className={`group relative ${cardHeight} overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]`}
      onClick={onClick}
    >
      {/* Premium Image Gallery Area */}
      <div className="relative h-3/5 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900">
        {/* Property Image Placeholder with elegant loading */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white/40">
            <div className={`w-16 h-16 mx-auto mb-3 rounded-2xl bg-white/5 flex items-center justify-center transition-all duration-500 ${imageLoaded ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
              <Square className="w-8 h-8" />
            </div>
            <p className="text-sm font-medium" style={Typography.caption}>
              Premium Gallery
            </p>
            <p className="text-xs text-white/25 mt-1">
              6+ Professional Photos
            </p>
          </div>
        </div>
        
        {/* Elegant overlay gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        
        {/* Top floating elements */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
          {/* Status Badge */}
          <div className={`px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-xl border ${statusInfo.color}`}>
            {statusInfo.label}
          </div>
          
          {/* Favorite Heart */}
          {onToggleFavorite && (
            <Button
              variant="glass"
              size="icon"
              onClick={handleHeartToggle}
              className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-xl border-white/10 hover:bg-black/30 transition-all duration-200"
            >
              <Heart 
                className={`w-5 h-5 transition-all duration-200 ${
                  isFavorited 
                    ? 'fill-red-400 text-red-400 scale-110' 
                    : 'text-white/80 hover:text-white'
                }`} 
              />
            </Button>
          )}
        </div>

        {/* Featured badge for premium listings */}
        {variant === 'featured' && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2">
            <div className="px-4 py-2 bg-gradient-to-r from-amber-500/90 to-yellow-500/90 backdrop-blur-xl rounded-full flex items-center gap-2">
              <Star className="w-4 h-4 fill-white text-white" />
              <span className="text-white text-xs font-semibold tracking-wide">FEATURED</span>
            </div>
          </div>
        )}
      </div>

      {/* Premium Content Section */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        {/* Price - Elegant typography */}
        <div 
          className="text-3xl font-light text-white mb-2 tracking-tight"
          style={Typography.title}
        >
          {formatPrice(listing.price_eur)}
        </div>
        
        {/* Title with luxury spacing */}
        <h3 
          className="text-lg font-medium text-white/95 mb-3 line-clamp-2 leading-relaxed"
          style={Typography.subtitle}
        >
          {listing.title}
        </h3>
        
        {/* Location with refined icon */}
        {(listing.address || listing.city) && (
          <div className="flex items-center gap-2 text-white/70 mb-4">
            <MapPin className="w-4 h-4 text-white/50" />
            <span className="text-sm font-medium">
              {[listing.address, listing.city].filter(Boolean).join(', ')}
            </span>
          </div>
        )}
        
        {/* Property Details - Clean grid */}
        <div className="flex items-center gap-6 text-white/60">
          <div className="flex items-center gap-1.5">
            <Bed className="w-4 h-4" />
            <span className="text-sm font-medium">{listing.bedrooms}</span>
          </div>
          {listing.bathrooms && (
            <div className="flex items-center gap-1.5">
              <Bath className="w-4 h-4" />
              <span className="text-sm font-medium">{listing.bathrooms}</span>
            </div>
          )}
          {listing.area_m2 && (
            <div className="flex items-center gap-1.5">
              <Square className="w-4 h-4" />
              <span className="text-sm font-medium">{listing.area_m2}m²</span>
            </div>
          )}
        </div>
      </div>

      {/* Edit button for authorized users - Elegant positioning */}
      {canEdit && onEdit && (
        <div className="absolute bottom-4 right-4">
          <Button
            variant="glass"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(listing);
            }}
            className="bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/20 text-xs px-3 py-1.5"
          >
            Edit
          </Button>
        </div>
      )}
    </LuxuryCard>
  );
};
