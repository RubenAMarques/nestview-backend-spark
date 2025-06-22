
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Bed, Bath, Square, Heart, Edit } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

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

interface ListingCardProps {
  listing: Listing;
  onEdit?: (listing: Listing) => void;
  onToggleFavorite?: (listingId: string) => void;
  isFavorited?: boolean;
}

export const ListingCard = ({ listing, onEdit, onToggleFavorite, isFavorited }: ListingCardProps) => {
  const { user } = useAuth();

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
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'need_fix':
        return 'bg-red-100 text-red-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const canEdit = user?.id === listing.agent_id || user?.role === 'admin';

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold line-clamp-2">{listing.title}</h3>
          <div className="flex gap-2">
            <Badge className={getStatusColor(listing.status)}>
              {listing.status.replace('_', ' ')}
            </Badge>
            {onToggleFavorite && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleFavorite(listing.id)}
                className="p-1 h-8 w-8"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            )}
          </div>
        </div>
        <div className="text-2xl font-bold text-blue-600">
          {formatPrice(listing.price_eur)}
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        {listing.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{listing.description}</p>
        )}

        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Bed className="w-4 h-4" />
            {listing.bedrooms} bed{listing.bedrooms !== 1 ? 's' : ''}
          </div>
          {listing.bathrooms && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Bath className="w-4 h-4" />
              {listing.bathrooms} bath{listing.bathrooms !== 1 ? 's' : ''}
            </div>
          )}
          {listing.area_m2 && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Square className="w-4 h-4" />
              {listing.area_m2}m²
            </div>
          )}
        </div>

        {(listing.address || listing.city) && (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            {[listing.address, listing.city].filter(Boolean).join(', ')}
          </div>
        )}
      </CardContent>

      {canEdit && onEdit && (
        <CardFooter className="pt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(listing)}
            className="w-full flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
