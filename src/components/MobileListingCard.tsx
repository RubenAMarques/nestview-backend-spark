
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Bed, Bath, Square, Heart, Edit, Phone, Mail } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

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

interface MobileListingCardProps {
  listing: Listing;
  onEdit?: (listing: Listing) => void;
  onToggleFavorite?: (listingId: string) => void;
  isFavorited?: boolean;
  showFullDetails?: boolean;
}

export const MobileListingCard = ({ 
  listing, 
  onEdit, 
  onToggleFavorite, 
  isFavorited,
  showFullDetails = false 
}: MobileListingCardProps) => {
  const { user } = useAuth();
  const [showContact, setShowContact] = useState(false);

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

  return (
    <Card className="bg-gray-800 border-gray-700 text-white">
      <CardContent className="p-0">
        {/* Image Placeholder */}
        <div className="aspect-[4/3] bg-gradient-to-br from-gray-700 to-gray-800 rounded-t-lg flex items-center justify-center relative">
          <div className="text-gray-400 text-center">
            <Square className="w-12 h-12 mx-auto mb-2" />
            <span className="text-sm">Property Image</span>
          </div>
          
          {/* Heart Button */}
          {onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(listing.id)}
              className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-white'}`} />
            </button>
          )}

          {/* Status Badge */}
          <div className="absolute bottom-3 left-3">
            <Badge className={`${getStatusColor(listing.status)} border`}>
              {listing.status.replace('_', ' ')}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Price and Title */}
          <div className="mb-3">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {formatPrice(listing.price_eur)}
            </div>
            <h3 className="text-lg font-semibold text-white line-clamp-2">
              {listing.title}
            </h3>
          </div>

          {/* Property Details */}
          <div className="flex flex-wrap gap-4 mb-3 text-gray-300">
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
            <div className="flex items-center gap-1 text-gray-400 mb-3">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">
                {[listing.address, listing.city].filter(Boolean).join(', ')}
              </span>
            </div>
          )}

          {/* Description (if full details) */}
          {showFullDetails && listing.description && (
            <div className="mb-4">
              <p className="text-gray-300 text-sm leading-relaxed">
                {listing.description}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            {showFullDetails && (
              <Button
                onClick={() => setShowContact(!showContact)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Phone className="w-4 h-4 mr-2" />
                Contact Agent
              </Button>
            )}
            
            {canEdit && onEdit && (
              <Button
                variant="outline"
                onClick={() => onEdit(listing)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
          </div>

          {/* Contact Form (if shown) */}
          {showContact && showFullDetails && (
            <div className="mt-4 p-4 bg-gray-700/50 rounded-lg">
              <h4 className="font-semibold mb-3">Contact Agent</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full p-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400"
                />
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Email"
                    className="flex-1 p-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400"
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    className="flex-1 p-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400"
                  />
                </div>
                <textarea
                  placeholder="Message..."
                  rows={3}
                  className="w-full p-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 resize-none"
                />
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
