
import { X, Bed, Bath, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LuxuryCard, LuxuryCardContent } from '@/components/ui/luxury-card';
import { useAuth } from '@/hooks/useAuth';

interface ListingPreviewCardProps {
  listing: any;
  onViewDetails: () => void;
  onClose: () => void;
  onEdit?: (listing: any) => void;
}

export const ListingPreviewCard = ({ 
  listing, 
  onViewDetails, 
  onClose, 
  onEdit 
}: ListingPreviewCardProps) => {
  const { user } = useAuth();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const canEdit = user?.id === listing.agent_id || user?.role === 'admin';

  return (
    <LuxuryCard className="animate-slide-in-right">
      <LuxuryCardContent className="p-0">
        <div className="relative">
          {/* Mock Property Image */}
          <div className="h-32 bg-gradient-to-br from-gray-700 to-gray-800 rounded-t-2xl flex items-center justify-center">
            <Square className="w-12 h-12 text-gray-400" />
          </div>
          
          {/* Close Button */}
          <Button
            onClick={onClose}
            variant="glass"
            size="sm"
            className="absolute top-2 right-2 rounded-full p-2"
          >
            <X className="w-4 h-4" />
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
          <div className="flex gap-4 mb-4 text-gray-300">
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

          {/* Location */}
          {(listing.address || listing.city) && (
            <p className="text-gray-400 text-sm mb-4">
              {[listing.address, listing.city].filter(Boolean).join(', ')}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={onViewDetails}
              className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
            >
              View Details
            </Button>
            {canEdit && onEdit && (
              <Button
                onClick={() => onEdit(listing)}
                variant="outline"
                className="border-gray-600"
              >
                Edit
              </Button>
            )}
          </div>
        </div>
      </LuxuryCardContent>
    </LuxuryCard>
  );
};
