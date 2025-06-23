
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LuxuryCard } from '@/components/ui/luxury-card';
import { FilterModal } from './FilterModal';
import { ListingPreviewCard } from './ListingPreviewCard';

interface MapProps {
  onListingSelect: (listing: any) => void;
  onEdit?: (listing: any) => void;
}

interface ActiveFilters {
  priceMin?: string;
  priceMax?: string;
  bedrooms?: string;
  bathrooms?: string;
  areaMin?: string;
  areaMax?: string;
  status?: string;
}

interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  listing: any;
}

export const WebMapFallback = ({ onListingSelect, onEdit }: MapProps) => {
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
  const [mapRegion] = useState({
    latitude: 39.3999,  // Portugal
    longitude: -8.2245,
    latitudeDelta: 8.0,
    longitudeDelta: 8.0,
  });

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['map-listings', activeFilters],
    queryFn: async () => {
      let query = supabase
        .from('listings')
        .select(`
          *,
          listing_photos:listing_photos(url, is_primary)
        `)
        .eq('status', 'approved')
        .or('expires_at.is.null,expires_at.gt.now()')
        .order('created_at', { ascending: false });

      // Apply filters
      if (activeFilters.priceMin) {
        query = query.gte('price_eur', parseInt(activeFilters.priceMin));
      }
      if (activeFilters.priceMax) {
        query = query.lte('price_eur', parseInt(activeFilters.priceMax));
      }
      if (activeFilters.bedrooms && activeFilters.bedrooms !== 'any') {
        query = query.gte('bedrooms', parseInt(activeFilters.bedrooms));
      }
      if (activeFilters.bathrooms && activeFilters.bathrooms !== 'any') {
        query = query.gte('bathrooms', parseInt(activeFilters.bathrooms));
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  // Generate mock coordinates for listings that don't have lat/lng
  const mapMarkers: MapMarker[] = useMemo(() => {
    return listings.map((listing, index) => ({
      id: listing.id,
      latitude: listing.lat ? parseFloat(listing.lat.toString()) : mapRegion.latitude + (Math.random() - 0.5) * 0.1 * (index + 1),
      longitude: listing.lng ? parseFloat(listing.lng.toString()) : mapRegion.longitude + (Math.random() - 0.5) * 0.1 * (index + 1),
      listing,
    }));
  }, [listings, mapRegion]);

  const handleMarkerPress = (marker: MapMarker) => {
    console.log('Marker pressed for listing:', marker.listing.id);
    setSelectedListing(marker.listing);
  };

  const handleViewDetails = (listing: any) => {
    console.log('View details pressed for listing ID:', listing.id);
    onListingSelect(listing);
  };

  const handleApplyFilters = (filters: ActiveFilters) => {
    setActiveFilters(filters);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="flex-1 bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative bg-black">
      {/* Map Container - Web Fallback */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800">
        {/* Interactive Map Area */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center mb-8">
            <MapPin className="w-16 h-16 text-amber-400 mb-4 mx-auto" />
            <h3 className="text-white text-xl font-semibold mb-2">Interactive Map</h3>
            <p className="text-gray-400 text-center px-8">
              {listings.length} approved properties loaded from Supabase
            </p>
            <p className="text-gray-500 text-sm mt-2">
              (Map view available on mobile device)
            </p>
          </div>
          
          {/* Mock Map with Clickable Markers */}
          <div className="relative w-80 h-48 bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
            {mapMarkers.slice(0, 12).map((marker, index) => (
              <button
                key={marker.id}
                onClick={() => handleMarkerPress(marker)}  
                className="absolute w-8 h-8 bg-amber-500 rounded-full border-2 border-white shadow-lg hover:scale-110 transition-transform flex items-center justify-center group"
                style={{
                  left: `${15 + (index % 4) * 20}%`,
                  top: `${25 + Math.floor(index / 4) * 40}%`,
                }}
              >
                <div className="w-3 h-3 bg-white rounded-full" />
                {/* Price tooltip */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {formatPrice(marker.listing.price_eur)}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Controls */}
      <div className="absolute top-12 right-4 z-20">
        <Button
          onClick={() => setShowFilters(true)}
          variant="glass"
          size="icon"
          className="rounded-full shadow-lg"
        >
          <MapPin className="w-5 h-5" />
        </Button>
      </div>

      {/* Property Count */}
      <div className="absolute top-12 left-4 bg-black/70 backdrop-blur-sm rounded-full px-4 py-2 z-20 border border-gray-700">
        <span className="text-white font-medium">{listings.length} Properties</span>
        {Object.keys(activeFilters).length > 0 && (
          <span className="text-amber-500 text-sm ml-2">• Filtered</span>
        )}
      </div>

      {/* Listing Preview Card */}
      {selectedListing && (
        <div className="absolute bottom-20 left-4 right-4 z-30">
          <ListingPreviewCard
            listing={selectedListing}
            onViewDetails={() => handleViewDetails(selectedListing)}
            onClose={() => setSelectedListing(null)}
            onEdit={onEdit}
          />
        </div>
      )}

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};
